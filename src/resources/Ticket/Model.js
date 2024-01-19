const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Ticket = new Schema(
    {
        ticket_type: { type: mongoose.Types.ObjectId, ref: 'TicketType' },
        ticket_code: { type: String, required: true },
        expiry: { type: Date, required: true },
        status: { type: String, default: "available", enum: ['available', 'unvailable', 'unavailable', 'pending', 'sold', 'used'] }, // available (unavailable) -> pending -> soldout
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Ticket', Ticket);

