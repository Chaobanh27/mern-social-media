import { StatusCodes } from 'http-status-codes'
import { CloudinaryProvider } from '../providers/CloudinaryProvider.js'
import { postService } from '../services/postService.js'
import { postModel } from '../model/postModel.js'

const uploadPostFile = async (req, res, next) => {
  try {
    const postFile = req.file
    let uploadResult
    if (postFile) {
      uploadResult = await CloudinaryProvider.streamUpload(postFile.buffer, 'posts')
    }
    res.status(StatusCodes.OK).json({ image: uploadResult.secure_url })

  } catch (error) {
    next(error)
  }

}

const createNew = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const createdPost = await postService.createNew(userId, req.body)

    res.status(StatusCodes.CREATED).json(createdPost)
  } catch (error) {
    next(error)
  }
}

const getPosts = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const getAllPosts = await postService.getPosts(userId, req.body)
    res.status(StatusCodes.OK).json(getAllPosts )
  } catch (error) {
    next(error)
  }
}

const getComments = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { id } = req.params
    const allComments = await postService.getComments(userId, id)
    res.status(StatusCodes.OK).json(allComments)
  } catch (error) {
    next(error)
  }
}

const commentPost = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { id } = req.params
    const comment = await postService.commentPost(userId, req.body, id)
    res.status(StatusCodes.OK).json(comment)
  } catch (error) {
    next(error)
  }
}

const replyPostComment = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { id } = req.params
    const replyComment = await postService.replyPostComment(userId, req.body, id)
    res.status(StatusCodes.OK).json(replyComment)
  } catch (error) {
    next(error)
  }
}

const likePost = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { id } = req.params

    const postLike = await postService.likePost(userId, id)

    res.status(StatusCodes.OK).json({ postLike })

  } catch (error) {
    next(error)
  }

}

const likePostComment = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { id, rId } = req.params
    const commentLike = await postService.likePostComment(userId, id, rId)

    res.status(StatusCodes.OK).json(commentLike)
  } catch (error) {
    next(error)
  }
}

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await postModel.findByIdAndDelete(id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }

}

export const postController = {
  createNew,
  uploadPostFile,
  getPosts,
  getComments,
  commentPost,
  replyPostComment,
  likePost,
  likePostComment,
  deletePost
}