import mongoose, { Schema } from 'mongoose'

const commentSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  postId: { type: Schema.Types.ObjectId, ref: 'Post' },
  comment: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  replies: [
    {
      rId: { type: mongoose.Schema.Types.ObjectId },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      from: { type: String },
      replyAt: { type: String },
      comment: { type: String },
      created_At: { type: Date, default: Date.now() },
      updated_At: { type: Date, default: Date.now() },
      likes: [{ type: String }]
    }
  ],
  likes: [{ type:String }]
},
{ timestamps: true }
)

export const commentModel = mongoose.model('Comment', commentSchema)

