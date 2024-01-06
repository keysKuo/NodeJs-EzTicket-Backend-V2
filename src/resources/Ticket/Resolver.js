const { createCode } = require('../../utils/crypto');
const Ticket = require('./Model');


// [POST] -> api/ticket/create
module.exports.POST_CreateTicket = async (req, res, next) => {
    const data = req.body;
    let payloads = [];
    let oneMonthLater = new Date();
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

    for(let i = 0; i < data.qty; i++) {
        payloads.push({...data, code: createCode(8).toUpperCase(), expiry: oneMonthLater, status: 'available' });
    }

    return await Ticket.insertMany(payloads)
        .then(tickets => {
            return res.status(200).json({
                success: true,
                tickets,
                msg: `Đã tạo thành công ${tickets.length} vé [${data.name}]`
            })
        })
        .catch(err => {
            return res.status(500).json({
                success: false,
                msg: 'Tạo vé thất bại: ' + err
            })
        })
}

// [PUT] -> api/ticket/update/:ticket_id
module.exports.PUT_UpdateTicket = async (req, res, next) => {
    const { ticket_id } = req.params;

    return await Ticket.findByIdAndUpdate(ticket_id, { $set: {...req.body} }, { returnOriginal: false })
        .then(ticket => {
            return res.status(200).json({
                success: true,
                ticket,
                msg: 'Cập nhật vé thành công'
            })
        })
        .catch(err => {
            return res.status(500).json({
                success: false,
                msg: 'Cập nhật vé thất bại: ' + err
            })
        })
}

// [DELETE] -> api/ticket/delete/:ticket_id
module.exports.DELETE_RemoveTicket = async (req, res, next) => {
    const { ticket_id } = req.params;

    return await Ticket.findByIdAndDelete(ticket_id)
        .then(ticket => {
            return res.status(200).json({
                success: true,
                ticket,
                msg: 'Xóa vé thành công'
            })
        })
        .catch(err => {
            return res.status(500).json({
                success: false,
                msg: 'Xóa vé thất bại: ' + err
            })
        })
}

// [GET] -> api/ticket/detail/:ticket_code
module.exports.GET_TicketDetail = async (req, res, next) => {
    const { ticket_code } = req.params;

    return await Ticket.findOne({ code: ticket_code }).lean()
        .then(ticket => {
            if(!ticket) {
                return res.status(404).json({
                    success: false,
                    msg: 'Không tìm thấy vé tương ứng'
                })
            }

            return res.status(200).json({
                success: true,
                ticket,
                msg: 'Tìm kiếm vé thành công'
            })
        })
        .catch(err => {
            return res.status(500).json({
                success: false,
                msg: 'Tìm kiếm vé thất bại: ' + err
            })
        })
}

// [GET] -> api/ticket/search?
module.exports.GET_SearchTickets = async (req, res, next) => {
    return await Ticket.find({...req.query}).lean()
        .then(tickets => {
            return res.status(200).json({
                success: true,
                tickets,
                msg: `Đã tìm thấy ${tickets.length} vé tương ứng`
            })
        })
        .catch(err => {
            return res.status(500).json({
                success: 500,
                msg: 'Lỗi tìm kiếm: ' + err
            })
        })
}
