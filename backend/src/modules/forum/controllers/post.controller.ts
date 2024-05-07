/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable operator-assignment */
/* eslint-disable radix */
/* eslint-disable eqeqeq */
import { JobCategory } from '@modules/job/job.model'
import { io } from '@core/libs/SocketIO'
import { User } from '@modules/user'
import Comment from '../models/Comment'
import Department from '../models/Department'
import Post, { IPost } from '../models/Post'
import SpecialEvent from '../models/SpecialEvent'
import ApiErrorResponse from '../utils/ApiErrorResponse'
import { sendNotification } from '../utils/mailer'

export const updatePostNumberRealTime = async () => {
  const totalPost = await Post.find({})
  const totalCategories = await JobCategory.find({})
  io.emit('total_idea', { total: totalPost.length, allCategories: totalCategories })
}

export const createPost = async (req: any, res: any, next: any) => {
  try {
    const ideaBody = req.body

    if (!ideaBody.content || ideaBody.content == '' || ideaBody.title == '') {
      return next(new ApiErrorResponse('Account does not exists.', 400))
    }

    const newPost: IPost = { ...ideaBody, publisherId: req?.user?._id }

    const savedPost = await Post.create(newPost)

    // savedPost = await savedPost.populate('publisherId')

    const user = await User.findById(savedPost.publisherId).populate('department')

    if (ideaBody.specialEvent) {
      // (async function () {
      const specialEvent = await SpecialEvent.findById(savedPost.specialEvent)
      specialEvent.posts.push(savedPost._id)
      specialEvent.save()
      // })()
    }

    user.posts.push(savedPost._id)
    user.save()
    updatePostNumberRealTime()
    res.status(200).json({
      success: true,
      message: 'post is created successfully',
      post: savedPost,
    })
  } catch (err: any) {
    return next(new ApiErrorResponse(`${err.message}`, 500))
  }
}

export const activeMailer = async (name: any, date: any, ideaId: any, department: any, ideaTitle: any, email?: any) => {
  try {
    const sendMails = department.qacGmails.map(async (mail: string) => {
      return (async function () {
        const title = `Your department has received a new post`
        const content = `${name} has posted new post - "${ideaTitle}". Department: <a href="https://main--leaks-app.netlify.app/coordinator/department?id=${
          department._id
        }">${department.name}</a>, posted at ${new Date(date).toUTCString()}.  Check now by click the link bellow`
        const url = `https://main--leaks-app.netlify.app/coordinator/post?id=${ideaId}`
        const isSent: any = await sendNotification(mail, content, title, date, url)
        console.log(isSent)
        if (isSent.status === 400) {
          return new ApiErrorResponse(
            `Send Email Failed, status code: ${isSent.status}, \nData: ${isSent.response} \n`,
            500
          )
        }
        return isSent
      })()
    })

    return await Promise.all(sendMails)
  } catch (err: any) {
    return new ApiErrorResponse(`${err.message}`, 500)
  }
}

export const getPosts = async (req: any, res: any, next: any) => {
  try {
    const reqQuery = req.query

    const page = parseInt(reqQuery.page) || 1
    const limit = parseInt(reqQuery.limit) || 5
    const offset = (page - 1) * limit
    const trending = reqQuery.tab || null
    const endIndex = page * limit
    let keyWord = reqQuery.keyword || null
    const results: any = {}

    if (endIndex < (await Post.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit,
      }
    }

    if (offset > 0) {
      results.previous = {
        page: page - 1,
        limit,
      }
    }

    let options: any = {}

    if (keyWord) {
      keyWord = keyWord.replace(/-/g, ' ').toLowerCase()
      const rgx = pattern => new RegExp(`.*${pattern}.*`)
      const searchRegex = rgx(keyWord)
      options = {
        $or: [{ title: { $regex: searchRegex, $options: 'i' } }, { content: { $regex: searchRegex, $options: 'i' } }],
      }
    }

    const posts = Post.find(options)
      .select('title meta likes dislikes createdAt comments isAnonymous specialEvent content files')
      .populate('specialEvent')
      .populate({
        path: 'publisherId',
        select: ['name', 'avatar', 'email', 'role'],
        populate: 'department',
      })
      .populate('categories')

    if (trending == 'hot') {
      posts.sort({ 'meta.views': -1 })
    } else if (trending == 'best') {
      posts.sort({ 'meta.likesCount': -1 })
    } else if (trending == 'worst') {
      posts.sort({ 'meta.dislikesCount': -1 })
    } else if (trending == 'oldest') {
      posts.sort({ createdAt: 1 })
    } else {
      posts.sort({ createdAt: -1 })
    }

    results.results = await posts.limit(limit).skip(offset).exec()

    res.status(200).json({
      success: true,
      count: results.results.length,
      next: results.next,
      previous: results.previous,
      data: results.results,
    })
  } catch (err: any) {
    return next(new ApiErrorResponse(`${err.message}`, 500))
  }
}

export const getPostsByManager = async (req: any, res: any, next: any) => {
  try {
    const reqQuery = req.query

    const page = parseInt(reqQuery.page) || 1
    const limit = parseInt(reqQuery.limit) || 5
    const offset = (page - 1) * limit
    const trending = reqQuery.tab || null
    const endIndex = page * limit
    let keyWord = reqQuery.keyword || null
    const results: any = {}

    let options: any = {
      $expr: {
        $gt: [{ $size: { $ifNull: ['$files', []] } }, 0],
      },
    }

    if (keyWord) {
      keyWord = keyWord.replace(/-/g, ' ').toLowerCase()
      const rgx = pattern => new RegExp(`.*${pattern}.*`)
      const searchRegex = rgx(keyWord)
      options = {
        $expr: {
          $gt: [{ $size: { $ifNull: ['$files', []] } }, 0],
        },
        $or: [{ title: { $regex: searchRegex, $options: 'i' } }, { content: { $regex: searchRegex, $options: 'i' } }],
      }
    }

    const posts = Post.find(options)
      .select('title meta likes dislikes createdAt comments isAnonymous specialEvent content files')
      .populate('specialEvent')
      .populate({
        path: 'publisherId',
        select: ['name', 'avatar', 'email', 'role'],
        populate: 'department',
      })
      .populate('categories')

    if (endIndex < (await Post.find(options).count())) {
      results.next = {
        page: page + 1,
        limit,
      }
    }

    if (offset > 0) {
      results.previous = {
        page: page - 1,
        limit,
      }
    }

    if (trending == 'hot') {
      posts.sort({ 'meta.views': -1 })
    } else if (trending == 'best') {
      posts.sort({ 'meta.likesCount': -1 })
    } else if (trending == 'worst') {
      posts.sort({ 'meta.dislikesCount': -1 })
    } else if (trending == 'oldest') {
      posts.sort({ createdAt: 1 })
    } else {
      posts.sort({ createdAt: -1 })
    }

    results.results = await posts.exec()

    res.status(200).json({
      success: true,
      count: results.results.length,
      next: results.next,
      previous: results.previous,
      data: results.results,
    })
  } catch (err: any) {
    return next(new ApiErrorResponse(`${err.message}`, 500))
  }
}

export const getTotalPost = async (req: any, res: any, next: any) => {
  try {
    const { accessRole } = req.query
    const ideasLength = await Post.find(
      accessRole === 'manager'
        ? {
            $expr: {
              $gt: [{ $size: { $ifNull: ['$files', []] } }, 0],
            },
          }
        : {}
    ).count()

    res.status(200).json({
      success: true,
      total: ideasLength,
    })
  } catch (err: any) {
    return next(new ApiErrorResponse(`${err.message}`, 500))
  }
}

export const getAllPostsOfUser = async (req: any, res: any, next: any) => {
  try {
    const option = req.query.uid
    const userId = option == 'me' ? req?.user?._id : option

    const user = await User.findById(userId)
    if (!user) {
      return next(new ApiErrorResponse(`Not found user id ${userId}`, 500))
    }
    const posts = await Post.find({ publisherId: { $in: user._id } })
      .select('title likes dislikes meta createdAt comments isAnonymous specialEvent content files')

      .populate({
        path: 'publisherId',
        select: ['name', 'avatar', 'email', 'role'],
      })
      .populate('categories')
    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    })
  } catch (err: any) {
    return next(new ApiErrorResponse(`${err.message}`, 500))
  }
}

export const getAllPostsByCategory = async (req: any, res: any, next: any) => {
  try {
    const categoryId = req.query.uid

    const category = await JobCategory.findById(categoryId)
    if (!category) {
      return next(new ApiErrorResponse(`Not found category id ${categoryId}`, 500))
    }
    const posts = await Post.find({ categories: { $in: [category._id] } }) // $all
      .select('title likes dislikes meta createdAt comments isAnonymous specialEvent content files')
      .populate({
        path: 'publisherId',
        select: ['name', 'avatar', 'email', 'role'],
      })
      .populate('categories')
    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    })
  } catch (err: any) {
    return next(new ApiErrorResponse(`${err.message}`, 500))
  }
}

export const getAllPostsByDepartment = async (req: any, res: any, next: any) => {
  try {
    const departmentId = req.query.uid

    const department = await Department.findById(departmentId).populate({
      path: 'users',
      select: ['name', 'avatar', 'email', 'role'],
      populate: {
        path: 'posts',
        select: [
          'title',
          'likes',
          'dislikes',
          'meta',
          'createdAt',
          'comments',
          'isAnonymous',
          'specialEvent',
          'content',
          'files',
        ],
      },
    })
    if (!department) {
      return next(new ApiErrorResponse(`Not found department id ${departmentId}`, 500))
    }
    // const posts = await Post
    //   .find({ department: { "$in": [department._id] } }) //$all
    //   .select('title likes dislikes meta createdAt comments isAnonymous specialEvent content')
    //   .populate({
    //     path: 'publisherId',
    //     select: ['name', 'avatar', 'email', 'role'],
    //   })
    //   .populate('categories')
    res.status(200).json({
      success: true,
      // count: department..length,
      data: department,
    })
  } catch (err: any) {
    return next(new ApiErrorResponse(`${err.message}`, 500))
  }
}

export const getPost = async (req: any, res: any, next: any) => {
  try {
    const post = await Post.findById(req.query.id)
      .populate({
        path: 'publisherId',
        select: ['name', 'avatar', 'email', 'role'],
        populate: 'department',
      })
      .populate('categories')
      .populate('specialEvent')
      .populate('hashtags')
    post.meta.views = post.meta.views + 1
    await post.save()
    res.status(200).json({
      success: true,
      data: post,
    })
  } catch (err: any) {
    return next(new ApiErrorResponse(`${err.message}`, 500))
  }
}

export const getDataSuggestion = async (req: any, res: any, next: any) => {
  try {
    const posts = await Post.find().select('title')
    // const users = await User
    //   .find()
    //   .select('name')
    // const categories = await JobCategory
    //   .find()
    //   .select('name')
    res.status(200).json({
      success: true,
      data: posts,
      count: posts.length,
    })
  } catch (err: any) {
    return next(new ApiErrorResponse(`${err.message}`, 500))
  }
}

export const deletePost = async (req: any, res: any, next: any) => {
  try {
    const { ideaId } = req.params
    const deletedPost = await Post.findByIdAndDelete(ideaId)
    if (!deletedPost) {
      return next(new ApiErrorResponse(`Post id ${ideaId} not found`, 404))
    }

    const user = await User.findById(deletedPost.publisherId)
      .populate('posts')
      .populate('comments')
      .populate({
        path: 'posts',
        populate: {
          path: 'publisherId',
        },
      })
      .populate({
        path: 'posts',
        populate: {
          path: 'comments',
        },
      })
    Comment.deleteMany({ ideaId: deletedPost._id })

    const newUserPosts = user.posts.filter(userI => userI['_id'].toString() !== deletedPost._id)
    const newUserComment = user.comments.filter(userC => userC['_id'].toString() !== deletedPost._id)
    if (deletedPost.specialEvent) {
      const specialEvent = await SpecialEvent.findOne({ posts: { $in: [deletedPost._id] } })
      const newSpecialEventPosts = specialEvent.posts.filter(ideaI => ideaI._id.toString() !== deletedPost._id)
      specialEvent.posts = newSpecialEventPosts
      specialEvent.save()
    }
    user.posts = newUserPosts
    user.comments = newUserComment
    user.save()
    updatePostNumberRealTime()
    res.status(200).json({ success: true, message: 'post is deleted!', deletedPost, user })
  } catch (error: any) {
    return next(new ApiErrorResponse(`${error.message}`, 500))
  }
}

export const editPost = async (req: any, res: any, next: any) => {
  try {
    // init req body obj
    const reqBody = req.body

    // get post id from req params prop
    const { ideaId } = req.params

    // update post with req body obj
    const updatedPost = await Post.findByIdAndUpdate(ideaId, reqBody, { new: true, useFindAndModify: false })
      .populate('publisherId')
      .populate({
        path: 'comments',
        populate: {
          path: 'userId',
        },
      })
      .populate('likes')

    if (!updatedPost) {
      return next(new ApiErrorResponse(`Not found Post id ${ideaId}`, 404))
    }

    updatedPost.files = reqBody.files ? reqBody.files : updatedPost.files
    await updatedPost.save()

    res.status(202).json({ message: 'post succesfully updated!', updatedPost })
  } catch (error: any) {
    return next(new ApiErrorResponse(`${error.message}`, 500))
  }
}

export const likePost = async (req: any, res: any, next: any) => {
  try {
    const { ideaId } = req.body
    const userId = req?.user?._id
    const post = await Post.findById(ideaId).select('createdAt dislikes likes')
    if (post.likes.indexOf(userId) >= 0) {
      return res.status(200).json({ success: true, message: 'already like!' })
    }
    if (post.dislikes.indexOf(userId) >= 0) {
      post.dislikes = post.dislikes.filter(like => like.toString() !== userId)
    }
    if (post.likes.indexOf(userId) === -1) {
      post.likes.push(userId)
    }
    await post.save()
    User.findById(userId)
      .select('comments name email avatar role')
      .then(user => {
        io.emit('votes', { action: 'like', ideaId, user })
      })
    res.status(200).json({ success: true, message: 'post liked!' })
  } catch (error: any) {
    return next(new ApiErrorResponse(`${error.message}`, 500))
  }
}

export const disLikePost = async (req: any, res: any, next: any) => {
  try {
    const { ideaId } = req.body
    const userId = req?.user?._id
    const post = await Post.findById(ideaId).select('createdAt dislikes likes')
    if (post.dislikes.indexOf(userId) >= 0) {
      return res.status(200).json({ success: true, message: 'already dislike!' })
    }
    if (post.likes.indexOf(userId) >= 0) {
      post.likes = post.likes.filter(like => like.toString() !== userId)
    }
    if (post.dislikes.indexOf(userId) === -1) {
      post.dislikes.push(userId)
    }

    await post.save()
    User.findById(userId)
      .select('comments name email avatar role')
      .then(user => {
        io.emit('votes', { action: 'dislike', ideaId, user })
      })
    res.status(200).json({ success: true, message: 'post liked!' })
  } catch (error: any) {
    return next(new ApiErrorResponse(`${error.message}`, 500))
  }
}

export const omitVotePost = async (req: any, res: any, next: any) => {
  try {
    const { ideaId } = req.body
    const userId = req?.user?._id
    const post = await Post.findById(ideaId).select('createdAt dislikes likes')
    if (post.dislikes.indexOf(userId) === -1 && post.likes.indexOf(userId) === -1) {
      return res.status(200).json({ success: true, message: 'already omit!' })
    }
    if (post.likes.indexOf(userId) >= 0) {
      post.likes = post.likes.filter(like => like.toString() !== userId)
    }
    if (post.dislikes.indexOf(userId) >= 0) {
      post.dislikes = post.dislikes.filter(like => like.toString() !== userId)
    }

    await post.save()
    User.findById(userId)
      .select('comments name email avatar role')
      .then(user => {
        io.emit('votes', { action: 'omit', ideaId, user })
      })
    res.status(200).json({ success: true, message: 'omit oke!' })
  } catch (error: any) {
    return next(new ApiErrorResponse(`${error.message}`, 500))
  }
}

export const getPostLikes = async (req: any, res: any, next: any) => {
  try {
    const { ideaId } = req.query

    const posts = await Post.findById(ideaId)
      .populate({
        path: 'likes',
        select: ['name', 'avatar'],
      })
      .populate({
        path: 'dislikes',
        select: ['name', 'avatar'],
      })

    res.status(201).json({
      success: true,
      message: 'Post likers fetched succesfully!',
      likes: posts.likes,
      dislikes: posts.dislikes,
    })
  } catch (error: any) {
    return next(new ApiErrorResponse(`${error.message}`, 500))
  }
}

export const postTotalByDuration = async (req: any, res: any, next: any) => {
  try {
    const results = await Post.aggregate([
      { $project: { week: { $week: { date: '$createdAt', timezone: 'GMT' } }, date: '$createdAt' } },
      { $group: { _id: { weeK: '$week' }, count: { $sum: 1 } } },
    ])
    res.status(201).json({
      success: true,
      data: results,
    })
  } catch (error: any) {
    return next(new ApiErrorResponse(`${error.message}`, 500))
  }
}
