const mongoose = require('mongoose');
const { createCode } = require('../../utils/crypto');
const Ticket = require('./Model');
const Event = require('../Event/Model');

// [POST] -> api/ticket/create
module.exports.POST_CreateTicket = async (req, res, next) => {
    const { ticket_type, ticket_name, qty } = req.body;
    let payloads = [];
    let oneMonthLater = new Date();
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

    for (let i = 0; i < qty; i++) {
        payloads.push({ ticket_type, ticket_code: createCode(8).toUpperCase(), expiry: oneMonthLater, status: 'available' });
    }

    return await Ticket.insertMany(payloads)
        .then((tickets) => {
            return res.status(200).json({
                success: true,
                tickets,
                msg: `Đã tạo thành công ${tickets.length} vé ${ticket_name}`,
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                msg: 'Tạo vé thất bại: ' + err,
            });
        });
};

// [PUT] -> api/ticket/update/:ticket_id
module.exports.PUT_UpdateTicket = async (req, res, next) => {
    const { ticket_id } = req.params;

    return await Ticket.findByIdAndUpdate(ticket_id, { $set: { ...req.body } }, { returnOriginal: false })
        .then((ticket) => {
            return res.status(200).json({
                success: true,
                ticket,
                msg: 'Cập nhật vé thành công',
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                msg: 'Cập nhật vé thất bại: ' + err,
            });
        });
};

// [DELETE] -> api/ticket/delete/:ticket_id
module.exports.DELETE_RemoveTicket = async (req, res, next) => {
    const { ticket_id } = req.params;

    return await Ticket.findByIdAndDelete(ticket_id)
        .then((ticket) => {
            return res.status(200).json({
                success: true,
                ticket,
                msg: 'Xóa vé thành công',
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                msg: 'Xóa vé thất bại: ' + err,
            });
        });
};

// [GET] -> api/ticket/detail/:ticket_code
module.exports.GET_TicketDetail = async (req, res, next) => {
    const { ticket_id } = req.params;

    return await Ticket.findOne({ _id: ticket_id }).populate({ path: 'ticket_type', populate: { path: 'event', select: 'event_name banner'}})
        .lean()
        .then((ticket) => {
            if (!ticket) {
                return res.status(404).json({
                    success: false,
                    msg: 'Không tìm thấy vé tương ứng',
                });
            }

            return res.status(200).json({
                success: true,
                ticket,
                msg: 'Tìm kiếm vé thành công',
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                msg: 'Tìm kiếm vé thất bại: ' + err,
            });
        });
};

// [GET] -> api/ticket/search?
module.exports.GET_SearchTickets = async (req, res, next) => {
    return await Ticket.find({ ...req.query })
        .lean()
        .then((tickets) => {
            return res.status(200).json({
                success: true,
                tickets,
                msg: `Đã tìm thấy ${tickets.length} vé tương ứng`,
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: 500,
                msg: 'Lỗi tìm kiếm: ' + err,
            });
        });
};

// [GET] -> api/ticket/group_by_events
module.exports.GET_GroupByEvent = async (req, res, next) => {
    const { event_id } = req.params;
    return await Ticket.aggregate([
        {
            $match: {
                event: new mongoose.Types.ObjectId(event_id) // Lọc để chỉ lấy vé của sự kiện cụ thể
            }
        },
        {
            $group: {
                _id: {
                    name: "$name", // Nhóm theo tên trước
                    status: "$status", // và sau đó theo trạng thái 
                },
                count: { $sum: 1 }, // Đếm số lượng vé
                price: { $first: "$price" }
            }
        },
        {
            $group: {
                _id: "$_id.name",
                // price: "$_id.price",// Nhóm lại theo tên
                statuses: {
                    $push: { // Đẩy các trạng thái và số lượng tương ứng vào một mảng
                        status: "$_id.status",
                        count: "$count",
                        price: "$price"
                    }
                }
            }
        }
    ])
        .then(async (result) => {
            if(result.length !== 0) {      
                let event = await Event.findById(event_id)
                    .select({
                        _id: 1, name: 1, banner: 1
                    })
                    .lean()
                return res.status(200).json({
                    success: 200,
                    tickets: result,
                    event: event,
                    msg: 'Nhóm danh sách vé thành công'
                })
            }
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                msg: 'Nhóm danh sách vé thất bại: ' + err
            })
        });
};
