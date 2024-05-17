import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/ApiError.js'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { WEBSITE_DOMAIN } from '../utils/constants.js'
import { env } from '../config/environment.js'
import { JwtProvider } from '../providers/JwtProvider.js'
import { pickUser } from '../utils/formatters.js'
import { BrevoProvider } from '../providers/BrevoProvider.js'
import { userModel } from '../model/userModel.js'
import { friendRequestModel } from '../model/friendRequestModel.js'

const createNew = async (reqBody) => {
  try {
    const existUser = await userModel.findOne({ email: reqBody.email })
    if (existUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists!')
    }

    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8),
      username: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4()
    }

    const createdUser = await userModel.create(newUser)
    const getNewUser = await userModel.findById(createdUser._id)

    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
    const customSubject = 'Trello MERN Stack Advanced: Please verify your email before using our services!'
    const htmlContent = `
        <h3>Here is your verification link:</h3>
        <h3>${verificationLink}</h3>
        <h3>Sincerely,<br/> - Trungquandev - Một Lập Trình Viên - </h3>
      `
    await BrevoProvider.sendEmail(getNewUser.email, customSubject, htmlContent)

    return pickUser(getNewUser)
  } catch (error) { throw error }
}

const verifyAccount = async (reqBody) => {
  try {
    const existUser = await userModel.findOne({ email: reqBody.email })

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (existUser.verified) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is already active!')
    if (reqBody.token !== existUser.verifyToken) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token is invalid!')
    }

    const updateData = {
      verified: true,
      verifyToken: null
    }
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: existUser._id },
      { $set: updateData },
      { returnDocument: 'after' } // sẽ trả về kết quả mới sau khi cập nhật
    )

    return pickUser(updatedUser)
  } catch (error) { throw error }
}

const login = async (reqBody) => {
  try {
    const existUser = await userModel.findOne({ email: reqBody.email })

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.verified) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')
    if (!bcryptjs.compareSync(reqBody.password, existUser.password)) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your Email or Password is incorrect!')
    }

    const userInfo = { _id: existUser._id, email: existUser.email }

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
    )

    return { accessToken, refreshToken, ...pickUser(existUser) }
  } catch (error) { throw error }
}

const refreshToken = async (clientRefreshToken) => {
  try {
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      clientRefreshToken,
      env.REFRESH_TOKEN_SECRET_SIGNATURE
    )

    const userInfo = { _id: refreshTokenDecoded._id, email: refreshTokenDecoded.email }

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      //5 // 5 giây
      env.ACCESS_TOKEN_LIFE
    )

    return { accessToken }
  } catch (error) { throw error }
}

const suggestedFriends = async (userId) => {
  try {
    let queryObject = {}

    queryObject._id = { $ne: userId }

    queryObject.friends = { $nin: userId }

    let results = await userModel.find(queryObject)
      .limit(15)
      .select('-password')

    return results

  } catch (error) {
    throw error
  }
}

const friendRquest = async (userId, requestTo) => {
  try {
    const requestFromUserExist = await friendRequestModel.findOne({
      requestFrom: userId,
      requestTo: requestTo
    })

    if (requestFromUserExist) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Friend Request already sent')
    }

    const requestFromPersonExist = await friendRequestModel.findOne({
      requestFrom: requestTo,
      requestTo: userId
    })

    if (requestFromPersonExist) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Friend Request already sent you')
    }

    const result = await friendRequestModel.create({
      requestFrom: userId,
      requestTo: requestTo
    })

    return result

  } catch (error) {
    throw error
  }
}

const getFriendRquest = async (userId) => {
  try {
    const AllRequests = await friendRequestModel.find({
      requestTo: userId,
      requestStatus: 'Pending'
    })
      .populate({
        path: 'requestFrom',
        select: '-password'
      })
      .limit(10)
      .sort({
        _id: -1
      })

    return AllRequests
  } catch (error) {
    throw error
  }
}

const acceptFriendRequest = async (userId, reqBody) => {
  try {
    const { rid, status } = reqBody

    const requestExist = await friendRequestModel.findById(rid)

    if (!requestExist) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'no friend request found')
    }

    const newRes = await friendRequestModel.findByIdAndUpdate(
      { _id: rid },
      { requestStatus: status }
    )

    if (status === 'Accepted') {
      const user = await userModel.findById(userId)

      user.friends.push(newRes?.requestFrom)

      await user.save()

      const friend = await userModel.findById(newRes?.requestFrom)

      friend.friends.push(newRes?.requestTo)

      await friend.save()
    }

    return status

  } catch (error) {
    throw error
  }
}

export const userService = {
  createNew,
  verifyAccount,
  login,
  refreshToken,
  suggestedFriends,
  friendRquest,
  getFriendRquest,
  acceptFriendRequest
}