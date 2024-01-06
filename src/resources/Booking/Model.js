const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Booking = new Schema(
    {
        tickets: [{ type: Schema.Types.ObjectId, ref: 'Ticket', required: true }],
        payment_type: { type: String, required: true, enum: ['paypal', 'credit', 'cash'] },
        total: { type: Number, required: true },
        note: { type: String },
        status: { type: String , required: true, enum: ['pending', 'completed', 'canceled'] },
        customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Booking', Booking);