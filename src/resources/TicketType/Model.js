const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketType = new Schema(
    {
        event: { type: Schema.Types.ObjectId, ref: 'Event' },
        ticket_name: { type: String, required: true },
        price: { type: Number, required: true },
        n_sold: { type: Number, default: 0 },
        n_stock: { type: Number, default: 0 },
        is_selling: { type: Boolean, default: false },
        position: {
            type: {
                x: { type: Number, default: 0 },
                y: { type: Number, default: 0 },
                w: { type: Number, default: 1 },
                h: { type: Number, default: 1 },
            },
            default: {
                x: 0,
                y: 0,
                w: 1,
                h: 1,
            },
        },
        is_area: { type: Boolean, default: false },
        ticket_map: [
            {
                name: { type: String },
                x: { type: Number, default: 0 },
                y: { type: Number, default: 0 },
                w: { type: Number, default: 1 },
                h: { type: Number, default: 1 },
            },
        ],
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('TicketType', TicketType);
