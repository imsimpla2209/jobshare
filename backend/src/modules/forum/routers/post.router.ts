/* eslint-disable import/prefer-default-export */
import { auth } from '@modules/auth'
import express from 'express'
import {
  createPost,
  deletePost,
  disLikePost,
  editPost,
  getAllPostsByCategory,
  getAllPostsByDepartment,
  getAllPostsOfUser,
  getDataSuggestion,
  getPost,
  getPosts,
  getPostsByManager,
  getPostLikes,
  getTotalPost,
  likePost,
  omitVotePost,
  postTotalByDuration,
} from '../controllers/post.controller'
import { downloadFiles, getPresignedUrl } from '../controllers/upload.controller'

export const postRouter = express.Router()

postRouter.get('/', auth(), getPosts)
postRouter.get('/manager', auth(), getPostsByManager)
postRouter.get('/suggest', auth(), getDataSuggestion)
postRouter.get('/postsOfUser', auth(), getAllPostsOfUser)
postRouter.get('/postsByCategory', auth(), getAllPostsByCategory)
postRouter.get('/postsByDepartment', auth(), getAllPostsByDepartment)
postRouter.get('/preSignUrl', auth(), getPresignedUrl)
postRouter.get('/detail', auth(), getPost)
postRouter.get('/postLikes', auth(), getPostLikes)
postRouter.get('/downloadFiles', auth(), downloadFiles)
postRouter.get('/totalPost', auth(), getTotalPost)
postRouter.get('/postTotalByDuration', auth(), postTotalByDuration)
postRouter.post('/create', auth(), createPost)
postRouter.put('/dislike', auth(), disLikePost)
postRouter.put('/like', auth(), likePost)
postRouter.put('/omitVote', auth(), omitVotePost)
postRouter.put('/edit/:postId', auth(), editPost)
postRouter.delete('/delete/:postId', auth(), deletePost)
