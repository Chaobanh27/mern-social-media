import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/ApiError.js'
import { userService } from '../services/userService.js'
import ms from 'ms'

const createNew = async (req, res, next) => {
  try {
    const createdUser = await userService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) { next(error) }
}

const verifyAccount = async (req, res, next) => {
  try {
    const result = await userService.verifyAccount(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body)
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const logout = async (req, res, next) => {
  try {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.status(StatusCodes.OK).json({ loggedOut: true })
  } catch (error) { next(error) }
}

const refreshToken = async (req, res, next) => {
  try {
    const result = await userService.refreshToken(req.cookies?.refreshToken)

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(new ApiError(StatusCodes.FORBIDDEN, 'Please Sign In! '))
  }
}

const suggestedFriends = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id

    const results = await userService.suggestedFriends(userId)

    res.status(StatusCodes.OK).json(results)
  } catch (error) {
    next(error)
  }
}

const friendRquest = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { requestTo } = req.body
    const result = await userService.friendRquest(userId, requestTo)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getFriendRquest = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const result = await userService.getFriendRquest(userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const acceptFriendRequest = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const result = await userService.acceptFriendRequest(userId, req.body)
    res.status(201).json({ result })
  } catch (error) {
    next(error)
  }
}

export const userController = {
  createNew,
  verifyAccount,
  login,
  logout,
  refreshToken,
  suggestedFriends,
  friendRquest,
  getFriendRquest,
  acceptFriendRequest
}