import express from 'express'
import { postController } from '../controllers/postController.js'
import { multerUploadMiddleware } from '../middlewares/multerUploadMiddleware.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const Router = express.Router()

Router.route('/upload-file')
  .post( authMiddleware.isAuthorized, multerUploadMiddleware.upload.single('image'), postController.uploadPostFile)

Router.route('/create-post')
  .post( authMiddleware.isAuthorized, postController.createNew)


Router.route('/get-posts')
  .post(authMiddleware.isAuthorized, postController.getPosts)

Router.route('/get-comments/:id')
  .post(authMiddleware.isAuthorized, postController.getComments)
Router.route('/comment/:id')
  .post(authMiddleware.isAuthorized, postController.commentPost)
Router.route('/reply-comment/:id')
  .post(authMiddleware.isAuthorized, postController.replyPostComment)

Router.route('/like/:id')
  .post(authMiddleware.isAuthorized, postController.likePost)

Router.route('/like-comment/:id/:rId')
  .post(authMiddleware.isAuthorized, postController.likePostComment)

Router.route('/:id')
  .delete(authMiddleware.isAuthorized, postController.deletePost)

export const postRoute = Router