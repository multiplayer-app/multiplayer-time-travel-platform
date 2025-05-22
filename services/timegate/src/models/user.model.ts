import mongoose from 'mongoose'

const { Schema } = mongoose

const UserSchema = new Schema({
    email: {
        type: String,
        require: true,
        index: true,
        unique: true,
    }
}, {
    timestamps: true,
})

export const UserModel = mongoose.model('User', UserSchema)
