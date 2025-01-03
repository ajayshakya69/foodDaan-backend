
const { Schema, mongoose } = require("../lib/db")

const requestSchema = new Schema({
    requesterId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    donorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    foodItemId: {
        type: Schema.Types.ObjectId,
        ref: 'Food_donation',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'cancelled'],
        default: 'pending',
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Request', requestSchema);
