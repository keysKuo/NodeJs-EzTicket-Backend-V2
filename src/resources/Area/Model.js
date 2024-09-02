const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Area = new Schema(
    {
        event: { type: Schema.Types.ObjectId, ref: 'Event' },
        area_name: { type: String, required: true },
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
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Area', Area);
