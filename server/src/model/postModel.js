import mongoose, { Schema } from 'mongoose'

const postSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    description: { type: String, required: true },
    image: { type: String },
    likes: [{ type: String }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comments' }]
  },
  { timestamps: true }
)

export const postModel = mongoose.model('Post', postSchema)
