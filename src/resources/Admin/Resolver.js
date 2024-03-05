require('dotenv').config();
const User = require('../User/Model');
const Booking = require('../Booking/Model');
const Ticket = require('../Ticket/Model');
const jwt = require('jsonwebtoken');

// [POST] -> api/admin/login
module.exports.POST_AdminLogin = (req, res, next) => {
    const { username, password } = req.body;

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        
        const adminToken = jwt.sign({ isAdmin: true }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '72h' });
        return res.status(200).json({
            success: true,
            adminToken,
            msg: 'Đăng nhập admin thành công',
        });
    }

    return res.status(500).json({
        success: false,
        msg: 'Đăng nhập admin thất bại',
    });
};

// [ANY] -> api/admin/test_authentication
module.exports.ANY_CheckAdminToken = async (req, res ,next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({
            success: false,
            msg: 'Token not found'
        })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
            // req.session.destroy();
            return res.status(401).json({
                success: false,
                msg: 'Token invalid'
            })
        }
        
        return res.status(200).json({
            success: true,
            isAdmin: data.isAdmin,
            msg: 'Admin authenticated'
        })
        // next();
    });
}

// [POST] -> /api/admin/search_booking
module.exports.POST_SearchBooking = async (req, res, next) => {
    const { startDate, endDate, phone } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
        return res.status(404).json({
            success: false,
            msg: `Không tìm thấy người dùng này`,
        });
    }

    return await Booking.find({ customer: user._id })
        .where('createdAt')
        .gte(startDate)
        .lte(endDate)
        .then((bookings) => {
            return res.status(200).json({
                success: true,
                bookings,
                msg: `Tìm thấy ${bookings.length} booking tương ứng`,
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                msg: 'Tìm kiếm booking thất bại: ' + err,
            });
        });
};

// [GET] /api/admin/refund_list
module.exports.GET_RefundList = async (req, res, next) => {
    const booking = await Booking.findById('65d0e6b3925851d346ed82a7');
    const bookingUpdatedAt = new Date(booking.updatedAt).getTime();
    const upperTimeLimit = bookingUpdatedAt + 6000000;

    return await Ticket.find({
        owner: booking.customer,
        createdAt: {
            $gte: bookingUpdatedAt,
            $lte: upperTimeLimit,
        },
    })
        .then((tickets) => {
            // console.log(tickets[0].createdAt.getTime(), upperTimeLimit, bookingUpdatedAt)
            return res.status(200).json({
                success: true,
                tickets,
                booking,
                msg: `Tìm thấy ${tickets.length} vé tương ứng`,
            });
        })
        .catch((err) => {
            return res.status(505).json({
                success: false,
                msg: 'Tìm kiếm vé thất bại: ' + err,
            });
        });
};
