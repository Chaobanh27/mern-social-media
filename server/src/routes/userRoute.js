import express from 'express'
import { userController } from '../controllers/userController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const Router = express.Router()

Router.route('/register')
  .post(userController.createNew)

Router.route('/verify')
  .put(userController.verifyAccount)

Router.route('/login')
  .post(userController.login)

Router.route('/logout')
  .delete(userController.logout)

Router.route('/refresh_token')
  .get(userController.refreshToken)

Router.route('/suggested-friends')
  .post(authMiddleware.isAuthorized, userController.suggestedFriends)

Router.route('/friend-request')
  .post(authMiddleware.isAuthorized, userController.friendRquest)

Router.route('/get-friend-request')
  .post(authMiddleware.isAuthorized, userController.getFriendRquest)

Router.route('/accept-request')
  .post(authMiddleware.isAuthorized, userController.acceptFriendRequest)

export const userRoute = Router