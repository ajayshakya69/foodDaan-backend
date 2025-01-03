const bcrypt= require("bcrypt");
const { Schema, mongoose } = require("../lib/db")



const userSchema = new Schema({
    name: { type: String, required: true },
    organization_name:{ type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['donor', 'requester','admin'], default: 'requester' },
    address: String,
    phone: String,
    createdAt: { type: Date, default: Date.now }
});



userSchema.pre('save', async function (next) {
    
    if (!this.isModified('password')) return next();
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


userSchema.methods.matchPassword = async function (userPassword){


    return await bcrypt.compare(userPassword, this.password);
}



module.exports = mongoose.model('User', userSchema);