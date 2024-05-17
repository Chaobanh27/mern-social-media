import { commentModel } from '../model/commentModel.js'
import { postModel } from '../model/postModel.js'
import { userModel } from '../model/userModel.js'
import ApiError from '../utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'

const createNew = async (userId, reqBody) => {
  try {
    const existUser = await userModel.findById(userId)
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.verified) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')
    const { description, image } = reqBody
    if (!description) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Description is required')
    }
    const createdPost = await postModel.create({
      userId,
      description,
      image
    })
    const getNewPost = await postModel.findById(createdPost._id)

    return getNewPost
  } catch (error) {
    throw error
  }
}

const getPosts = async (userId, reqBody) => {
  try {
    const existUser = await userModel.findById(userId)
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.verified) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

    const { search } = reqBody

    /**
     * Chuyển đổi mảng các ObjectId của existUser?.friends thành một chuỗi và chia thành mảng bằng cách sử dụng toString().split(",")
     * sau đó thêm id của user hiện tại vào mảng đó để tổng hợp bài viết
     */
    const friends = existUser?.friends?.toString().split(',') ?? []
    friends.push(userId)

    const searchPostQuery = {
      $or: [
        {
          description: { $regex: search, $options: 'i' }
        }
      ]
    }

    /**
     * Sử dụng Posts.find() để lấy danh sách bài viết từ cơ sở dữ liệu. Nếu search tồn tại,
     * áp dụng truy vấn tìm kiếm searchPostQuery, ngược lại lấy tất cả bài viết.
     */
    const posts = await postModel.find(search ? searchPostQuery : {})
      .populate({
        path: 'userId',
        select: '-password'
      })
      .sort({ _id: -1 })


    /**
      * Sử dụng .filter() để lọc danh sách bài viết và chỉ giữ lại những bài viết có userId thuộc danh sách bạn bè
    */
    const friendsPosts = posts?.filter((post) => {
      return friends.includes(post?.userId?._id.toString())
    })

    /**
     * Sử dụng .filter() một lần nữa để lọc danh sách bài viết và chỉ giữ lại những bài viết không thuộc danh sách bạn bè
     */
    const otherPosts = posts?.filter(
      (post) => !friends.includes(post?.userId?._id.toString())
    )

    let postsRes = null

    if (friendsPosts?.length > 0) {
      postsRes = search ? friendsPosts : [...friendsPosts, ...otherPosts]
    } else {
      postsRes = posts
    }
    return postsRes
  } catch (error) {
    throw error
  }
}

const getComments = async (userId, postId) => {
  try {
    const existUser = await userModel.findById(userId)
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.verified) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')
    const postComments = await commentModel.find({ postId })
      .populate({
        path: 'userId',
        select: '-password'
      })
      .populate({
        path: 'replies.userId',
        select: '-password'
      })
      .sort({ _id: -1 })

    return postComments
  } catch (error) {
    throw error
  }
}

const commentPost = async (userId, reqBody, postId) => {
  try {
    const existUser = await userModel.findById(userId)
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.verified) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')
    const { comment, from } = reqBody
    if (!comment) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Comment is required')
    }

    const createdComment = await commentModel.create({ comment, from, userId, postId })

    const getPostById = await postModel.findById(postId)

    getPostById.comments.push(createdComment._id)

    await postModel.findByIdAndUpdate(postId, getPostById, {
      new : true
    })

    const getNewComment = await commentModel.findById(createdComment._id)

    return getNewComment

  } catch (error) {
    throw error
  }
}

const replyPostComment = async (userId, reqBody, commentId) => {
  try {
    const existUser = await userModel.findById(userId)
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.verified) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')
    const { comment, from, replyAt } = reqBody
    if (!comment) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Comment is required')
    }
    const existComment = await commentModel.findById(commentId)

    if (!existComment) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Comment is not exist')
    }

    existComment.replies.push({
      comment,
      replyAt,
      from,
      userId,
      created_At: Date.now()
    })

    existComment.save()

    return existComment

  } catch (error) {
    throw error
  }
}

const likePost = async (userId, postId) => {
  try {
    const existUser = await userModel.findById(userId)
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.verified) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')
    const postById = await postModel.findById(postId)
    const index = postById.likes.findIndex(like => like === String(userId))

    if (index === -1) {
      postById.likes.push(userId)
    } else {
      postById.likes = postById.likes.filter(like => like !== String(userId))
    }

    const newPost = await postModel.findByIdAndUpdate(postId, postById, {
      new: true
    })
    return newPost
  } catch (error) {
    throw error
  }
}

const likePostComment = async (userId, commentId, replyCommentId) => {
  try {
    const existUser = await userModel.findById(userId)
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.verified) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

    if (replyCommentId === 'undefined' || replyCommentId === null) {
      const comment = await commentModel.findById(commentId)

      const index = comment.likes.findIndex((el) => el === String(userId))

      if (index === -1) {
        comment.likes.push(userId)
      } else {
        comment.likes = comment.likes.filter((i) => i !== String(userId))
      }

      const updatedComment = await commentModel.findByIdAndUpdate(commentId, comment, {
        new: true
      })
      return updatedComment
    } else {
      const replyComment = await commentModel.findOne(
        { _id : commentId },
        {
          replies: {
            $elemMatch: {
              _id: replyCommentId
            }
          }
        }
      )


      const index = replyComment?.replies[0]?.likes.findIndex(
        (i) => i === String(userId)
      )

      if (index === -1) {
        replyComment.replies[0].likes.push(userId)
      } else {
        replyComment.replies[0].likes = replyComment.replies[0]?.likes.filter(
          (i) => i !== String(userId)
        )
      }

      const query = { _id: commentId, 'replies._id' : replyCommentId }

      const updated = {
        $set: {
          'replies.$.likes': replyComment.replies[0].likes
        }
      }

      const updatedReplyComment = await commentModel.updateOne(query, updated, { new: true })

      return updatedReplyComment
    }
  } catch (error) {
    throw error
  }
}

export const postService = {
  createNew,
  getPosts,
  getComments,
  commentPost,
  replyPostComment,
  likePost,
  likePostComment
}