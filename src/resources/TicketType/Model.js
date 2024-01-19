const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketType = new Schema(
    {
        event: { type: Schema.Types.ObjectId, ref: 'Event' },
        ticket_name: { type: String, required: true },
        price: { type: Number, required: true },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('TicketType', TicketType);

