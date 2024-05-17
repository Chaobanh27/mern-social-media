import mongoose, { Schema } from 'mongoose'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, ' Email is Required!'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is Required!'],
    minlength: [6, 'Password length should be greater than 6 character']
  },
  username: {
    type: String,
    require: true
  },
  displayName: {
    type: String,
    require: true
  },
  location: {
    type: String,
    default: 'Earth'
  },
  avatar: {
    type: String,
    default: 'https://res.cloudinary.com/dbk1x83kg/image/upload/v1706293138/samples/people/jazz.jpg'
  },
  profession: {
    type: String,
    default: 'Developer'
  },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  views: [{ type: String }],
  verified: {
    type: Boolean,
    default: false
  },
  verifyToken: {
    type: String,
    default : null
  }
},
{ timestamps: true }
)

export const userModel = mongoose.model('User', userSchema)