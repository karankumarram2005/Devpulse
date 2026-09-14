import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    avatar: {
        type: String,
        default: ''
    },
    provider: {
        type: String,
        enum: ['local', 'google', 'github'],
        default: 'local'
    },

    providerId: {
        type: String,
        default: null
    },
}, { timestamps: true });

// Method to compare entered password with hashed password in DB
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Fixed export syntax
const User = mongoose.model('User', UserSchema);
export default User;