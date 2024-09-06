const mongoose = require('mongoose');
const TicketType = require('./Model');
const Ticket = require('../Ticket/Model');

function generateMatrixWithDimensions(width, height, numItems) {
    const matrix = [];
    let count = 0;

    // Function to generate the name in the format 'A-1', 'A-2', etc.
    function generateName(row, col) {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const letter = letters[row % letters.length]; // Wraps around if height exceeds 26
        return `${letter}-${col + 1}`;
    }

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if (count < numItems) {
                const name = generateName(y, x);
                matrix.push({ x, y, i: name, w: 1, h: 1 });
                count++;
            }
        }
    }

    return matrix;
}

// [POST] -> api/ticket_type/create
module.exports.POST_CreateTicketType = async (req, res, next) => {
    const { n_stock, ticket_name, position } = req.body;
    const ticket_map = generateMatrixWithDimensions(position.w, position.h, n_stock);

    return await TicketType.create({ ...req.body, ticket_map })
        .then((ticket_type) => {
            return res.status(200).json({
                success: true,
                ticket_type,
                msg: `Đã tạo thành công ${n_stock} vé ${ticket_name}`,
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                msg: 'Tạo loại vé thất bại: ' + err,
            });
        });
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

// [PUT] -> api/ticket_type/update/:type_id
module.exports.PUT_UpdateManyTicketType = async (req, res, next) => {
    return await TicketType.updateMany(req.body)
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

    return await Ticket.findOne({ _id: type_id })
        .populate({ path: 'event', select: 'event_name banner' })
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
                msg: `Đã tìm thấy ${ticket_types.length} loại vé tương ứng`,
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: 500,
                msg: 'Lỗi tìm kiếm: ' + err,
            });
        });
};
