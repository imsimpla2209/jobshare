/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
import express from 'express'
import { auth } from '@modules/auth'
import { getPresignedUrl } from '../controllers/upload.controller'
import Post from '../models/Post'
import {
  createComment,
  deleteComment,
  disLikeComment,
  editComment,
  getAllCommentsOfUser,
  getComments,
  likeComment,
} from '../controllers/comment.controller'

export const commentRouter = express.Router()

commentRouter.post('/create', auth(), createComment)
commentRouter.put('/edit/:commentId', auth(), editComment)
commentRouter.put('/like/:commentId', auth(), likeComment)
commentRouter.put('/dislike/:commentId', auth(), disLikeComment)
commentRouter.put('/edit', auth(), editComment)
commentRouter.get('/', auth(), getComments)
commentRouter.get('/commentsOfUser', auth(), getAllCommentsOfUser)
commentRouter.delete('/delete/:commentId', auth(), deleteComment)
