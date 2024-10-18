const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const usersSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'please provide First Name'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'please provide Last Name'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'please provide password'],
        minLength: [8, 'password must be at least 8 characters'],
        select: false
    },
    email: {
        type: String,
        required: [true, 'please provide Email Address'],
        unique: [true, 'email already exists'],
        trim: true
    },
    phoneNumber: {
        type: String,
    },
    email_verified: {
        type: Boolean,
        default: false,
    },
    verification_token: {
        type: String,
    },
    image: {
        type: String,
    }
})
usersSchema.pre('save', async function (next){
    if(!this.isModified('password')) return next()

        this.password = await bcrypt.hash(this.password, 12);
    next();
})
const users = mongoose.model('users', usersSchema)
module.exports = users;