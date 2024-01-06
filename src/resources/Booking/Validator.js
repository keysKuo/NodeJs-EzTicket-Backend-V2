const Booking = require('./Model');
const Ticket = require('../Ticket/Model');

module.exports.Validate_CreateBooking = async (req, res, next) => {
    const { tickets } = req.body;

    let list = tickets.split(',');
    return await Ticket.countDocuments({ _id: { $in: list }, status: { $ne: 'available' }})
        .then(count => {
            if (count !== 0) {
                return res.status(400).json({
                    success: false,
                    msg: `Tìm thấy ${count} vé đang không có sẵn`
                })
            }

            next();
        })
        .catch(err => {
            return res.status(500).json({
                success: false,
                msg: `Kiểm tra lượng vé thất bại: ` + err
            })
        })
}