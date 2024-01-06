const Booking = require('./Model');
const Ticket = require('../Ticket/Model');

// [POST] -> api/booking/create
module.exports.POST_CreateBooking = async (req, res, next) => {
    const { tickets } = req.body;
    return await Booking.create({ ...req.body, tickets: tickets.split(','), status: 'pending' })
        .then(async (booking) => {
            if (!booking) {
                return res.status(404).json({
                    success: false,
                    msg: `Không tìm thấy booking hoặc booking đã kết thúc`,
                });
            }

            await Ticket.updateMany({ _id: { $in: booking.tickets }, status: 'available' }, { status: 'pending' }).then(
                (result) => {
                    return res.status(200).json({
                        success: true,
                        booking,
                        result,
                        msg: `Tạo booking vé thành công`,
                    });
                },
            );
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                msg: `Tạo booking vé thất bại: ` + err,
            });
        });
};

// [PUT] -> api/booking/complete/:booking_id
module.exports.PUT_CompleteBooking = async (req, res, next) => {
    const { booking_id } = req.params;

    return await Booking.findOneAndUpdate(
        { _id: booking_id, status: 'pending' },
        { $set: { status: 'completed' } },
        { returnOriginal: false },
    )
        .populate({
            path: 'tickets',
            select: '-status -__v -createdAt -updatedAt',
            populate: {
                path: 'event',
                select: '-introduce -__v -createdAt -updatedAt',
                populate: { path: 'categories', select: '-__v -createdAt -updatedAt' },
            },
        })
        .then(async (booking) => {
            if (!booking) {
                return res.status(404).json({
                    success: false,
                    msg: `Không tìm thấy booking hoặc booking đã kết thúc`,
                });
            }

            return await Ticket.updateMany(
                { _id: { $in: booking.tickets }, status: 'pending' },
                { status: 'sold' },
            ).then((result) => {
                return res.status(200).json({
                    success: true,
                    booking,
                    result,
                    msg: `Hoàn tất booking vé thành công`,
                });
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                msg: `Hoàn tất booking vé thất bại: ` + err,
            });
        });
};

// [PUT] -> api/booking/cancel/:booking_id
module.exports.PUT_CancelBooking = async (req, res, next) => {
    const { booking_id } = req.params;

    return await Booking.findOneAndUpdate(
        { _id: booking_id, status: 'pending' },
        { $set: { status: 'canceled' } },
        { returnOriginal: false },
    )
        .then(async (booking) => {
            if (!booking) {
                return res.status(404).json({
                    success: false,
                    msg: `Không tìm thấy booking hoặc booking đã kết thúc`,
                });
            }

            await Ticket.updateMany({ _id: { $in: booking.tickets }, status: 'pending' }, { status: 'available' }).then(
                (result) => {
                    return res.status(200).json({
                        success: true,
                        booking,
                        result,
                        msg: `Hủy booking vé thành công`,
                    });
                },
            );
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                msg: `Hủy booking vé thất bại: ` + err,
            });
        });
};

// [GET] -> api/booking/detail/:booking_id
module.exports.GET_BookingDetail = async (req, res, next) => {
    const { booking_id } = req.params;

    return await Booking.findById(booking_id)
        .populate({ path: 'tickets' })
        .lean()
        .then((booking) => {
            if (!booking) {
                return res.status(404).json({
                    success: false,
                    msg: `Không tìm thấy booking vé`,
                });
            }
            return res.status(200).json({
                success: true,
                booking,
                msg: `Tìm booking vé thành công`,
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                msg: `Tìm booking vé thất bại: ` + err,
            });
        });
};

// [GET] -> api/booking/search?
module.exports.GET_SearchBookings = async (req, res, next) => {
    return await Booking.find({ ...req.query })
        .lean()
        .then((bookings) => {
            return res.status(200).json({
                success: true,
                bookings,
                msg: `Đã tìm thấy ${bookings.length} booking vé`,
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                msg: `Tìm booking vé thất bại: ` + err,
            });
        });
};
