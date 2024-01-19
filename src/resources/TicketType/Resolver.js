const mongoose = require('mongoose');
const TicketType = require('./Model');
const Event = require('../Event/Model');

// [POST] -> api/ticket_type/create
module.exports.POST_CreateTicketType = async (req, res, next) => {
    return await TicketType.create({...req.body})
        .then(ticket_type => {
            return res.status(200).json({
                success: true,
                ticket_type,
                msg: 'Tạo loại vé thành công'
            })
        })
        .catch(err => {
            return res.status(500).json({
                success: false,
                msg: 'Tạo loại vé thất bại: ' + err
            })
        })
};

// [PUT] -> api/ticket_type/update/:type_id
module.exports.PUT_UpdateTicketType = async (req, res, next) => {
    const { type_id } = req.params;

    return await TicketType.findByIdAndUpdate(type_id, { $set: { ...req.body } }, { returnOriginal: false })
        .then((ticket) => {
            return res.status(200).json({
                success: true,
                ticket,
                msg: 'Cập nhật loại vé thành công',
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                msg: 'Cập nhật loại vé thất bại: ' + err,
            });
        });
};

// [DELETE] -> api/ticket_type/delete/:type_id
module.exports.DELETE_RemoveTicketType = async (req, res, next) => {
    const { type_id } = req.params;

    return await TicketType.findByIdAndDelete(type_id)
        .then((ticket_type) => {
            return res.status(200).json({
                success: true,
                ticket_type,
                msg: 'Xóa loại vé thành công',
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                msg: 'Xóa loại vé thất bại: ' + err,
            });
        });
};

// [GET] -> api/ticket_type/detail/:type_id
module.exports.GET_TicketTypeDetail = async (req, res, next) => {
    const { type_id } = req.params;

    return await Ticket.findOne({ _id: type_id }).populate({ path: 'event', select: 'event_name banner'})
        .lean()
        .then((ticket_type) => {
            if (!ticket_type) {
                return res.status(404).json({
                    success: false,
                    msg: 'Không tìm thấy vé tương ứng',
                });
            }

            return res.status(200).json({
                success: true,
                ticket_type,
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

// [GET] -> api/ticket_type/search?
module.exports.GET_SearchTicketTypes = async (req, res, next) => {
    return await TicketType.find({ ...req.query })
        .lean()
        .then((ticket_types) => {
            return res.status(200).json({
                success: true,
                ticket_types,
                msg: `Đã tìm thấy ${ticket_types.length} vé tương ứng`,
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: 500,
                msg: 'Lỗi tìm kiếm: ' + err,
            });
        });
};

