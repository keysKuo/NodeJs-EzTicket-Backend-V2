const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Ticket = new Schema(
    {
        event: { type: Schema.Types.ObjectId, ref: 'Event' },
        name: { type: String, required: true },
        code: { type: String, required: true },
        expiry: { type: Date, required: true },
        price: { type: Number, required: true },
        status: { type: String, default: "available", enum: ['available', 'unavailable', 'pending', 'sold'] }, // available (unavailable) -> pending -> soldout
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Ticket', Ticket);

