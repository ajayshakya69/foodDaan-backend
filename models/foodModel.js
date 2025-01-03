const {Schema,mongoose} = require("../lib/db")
 




const foodSchema = new Schema({
    foodName: { type: String, required: true },
    description: String,
    quantity: { type: Number, required: true },
    location: { type: String, required: true },
    expirationDate: { type: String, required: true },
    donatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    isAvailable: { type: Boolean, default: true }
});

module.exports = mongoose.model('Food_donation', foodSchema);