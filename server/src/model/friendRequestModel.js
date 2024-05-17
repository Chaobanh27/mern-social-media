import mongoose, { Schema } from 'mongoose'

const requestSchema = Schema(
  {
    requestTo: { type: Schema.Types.ObjectId, ref: 'User' },
    requestFrom: { type: Schema.Types.ObjectId, ref: 'User' },
    requestStatus: { type: String, default: 'Pending' }
  },
  { timestamps: true }
)

export const friendRequestModel = mongoose.model('FriendRequest', requestSchema)


