/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable eqeqeq */
import { io } from '@core/libs/SocketIO'
import User from '@modules/user/user.model'
import Comment from '../models/Comment'
import Post from '../models/Post'
import ApiErrorResponse from '../utils/ApiErrorResponse'
import { sendNotification } from '../utils/mailer'

export const activeMailer = async (name: any, email: any, date: any, ideaId: any) => {
  try {
    const title = 'Your post has received a new comment'
    const content = `${name} has commented on your post, commented at ${new Date(
      date
    ).toUTCString()}.  Check now by click the link bellow`
    const url = `https://main--leaks-app.netlify.app/staff/post?id=${ideaId}`
    const isSent: any = await sendNotification(email, content, title, date, url)
    if (isSent.status === 400) {
      return new ApiErrorResponse(
        `Send Email Failed, status code: ${isSent.status}, \nData: ${isSent.response} \n`,
        500
      )
    }
    return isSent
  } catch (err: any) {
    return new ApiErrorResponse(`${err.message}`, 500)
  }
}

export const createComment = async (req: any, res: any, next: any) => {
  try {
    const commentBody = req.body

    if (
      !commentBody.content ||
      commentBody.content == '' ||
      req.payload?.user?.id == '' ||
      commentBody.ideaId === '' ||
      commentBody.publisherEmail === ''
    ) {
      return next(new ApiErrorResponse('Lack of required information.', 400))
    }

    let post = await Post.findById(commentBody.ideaId).select('createdAt comments specialEvent')
    if (post?.specialEvent) {
      post = await post.populate({
        path: 'specialEvent',
        select: ['finalCloseDate'],
      })
      if (new Date(post.specialEvent.finalCloseDate) <= new Date()) {
        return next(new ApiErrorResponse(`This post reached final closure date, post id: ${commentBody.ideaId}`, 400))
      }
    }

    const data = { content: commentBody.content, ideaId: commentBody.ideaId, isAnonymous: commentBody.isAnonymous }
    const newComment = { ...data, userId: req.payload?.user?.id }
    const savedComment = await Comment.create(newComment)

    const user = await User.findById(req.payload?.user?.id).select('comments name email avatar role')
    user.comments.push(savedComment._id)
    post.comments.push(savedComment._id)
    user.save()
    post.save()
    savedComment.userId = user

    console.log(savedComment)

    io.emit('comments', { action: 'create', ideaId: commentBody.ideaId, comment: savedComment })
    if (commentBody.publisherEmail != 'None') {
      activeMailer(user.name, commentBody.publisherEmail, new Date(), post._id)
        .then(data => console.log('isSent', data))
        .catch(error => console.log('error', error))
    }
    res.status(200).json({
      success: true,
      message: 'Comment is created successfully',
      Comment: savedComment,
    })
  } catch (err: any) {
    return next(new ApiErrorResponse(`${err.message}`, 500))
  }
}

export const getComments = async (req: any, res: any, next: any) => {
  try {
    const reqQuery = req.query
    const { ideaId } = reqQuery
    const trending = reqQuery.tab || null
    const results = {}

    const options: any = { ideaId }

    const comments = Comment.find(options).populate({
      path: 'userId',
      select: ['name', 'avatar', 'email', 'role'],
    })

    if (trending == 'best') {
      comments.sort({ like: -1 })
    } else {
      comments.sort({ date: -1 })
    }
    if (trending == 'oldest') {
      comments.sort({ date: 1 })
    } else {
      comments.sort({ date: -1 })
    }

    results['results'] = await comments
      // .limit(5)
      // .skip(offset)
      .exec()

    res.status(200).json({
      success: true,
      count: results['results'].length,
      data: results['results'],
    })
  } catch (err: any) {
    return next(new ApiErrorResponse(`${err.message}`, 500))
  }
}

export const getAllCommentsOfUser = async (req: any, res: any, next: any) => {
  try {
    const option = req.query.uid
    const userId = option == 'me' ? req?.user?._id : option

    const user = await User.findById(userId)
    if (!user) {
      return next(new ApiErrorResponse(`Not found user id ${userId}`, 500))
    }
    const comments = await Comment.find({ publisherId: { $in: user._id } })
      .populate({
        path: 'userId',
        select: ['name', 'avatar', 'email', 'role'],
      })
      .populate('categories')
    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    })
  } catch (err: any) {
    return next(new ApiErrorResponse(`${err.message}`, 500))
  }
}

export const deleteComment = async (req: any, res: any, next: any) => {
  try {
    const { commentId } = req.params

    const deletedComment = await Comment.findByIdAndDelete(commentId)
    if (!deletedComment) {
      return next(new ApiErrorResponse(`Comment id ${commentId} not found`, 404))
    }

    const user = await User.findById(deletedComment.userId)
    const post = await Post.findById(deletedComment.postId)
    // await User.deleteMany({ CommentId: deletedComment._id });

    const newUserComments = user.comments.filter(userI => userI['_id'].toString() !== deletedComment._id)
    const newIdeaComment = post.comments.filter(userC => userC['_id'].toString() !== deletedComment._id)

    user.comments = newUserComments
    post.comments = newIdeaComment
    user.save()
    post.save()

    res.status(200).json({ success: true, message: 'Comment is deleted!', deletedComment, user })
  } catch (error: any) {
    return next(new ApiErrorResponse(`${error.message}`, 500))
  }
}

export const editComment = async (req: any, res: any, next: any) => {
  try {
    //init req body obj
    const reqBody = req.body

    //get Comment id from req params prop
    const { CommentId } = req.params

    //update Comment with req body obj
    const updatedComment = await Comment.findByIdAndUpdate(CommentId, reqBody, { new: true, useFindAndModify: false })
      .populate('userId')
      .populate({
        path: 'comments',
        populate: {
          path: 'userId',
        },
      })
      .populate('likes')

    if (!updatedComment) {
      return next(new ApiErrorResponse(`Not found Comment id ${CommentId}`, 404))
    }

    await updatedComment.save()

    res.status(202).json({ message: 'Comment succesfully updated!', updatedComment })
  } catch (error: any) {
    return next(new ApiErrorResponse(`${error.message}`, 500))
  }
}

export const likeComment = async (req: any, res: any, next: any) => {
  try {
    const { commentId } = req.params
    const comment = await Comment.findById(commentId)
    comment.like = +comment.like + 1
    await comment.save()
    res.status(200).json({ success: true, message: 'Comment liked!', comment })
  } catch (error: any) {
    return next(new ApiErrorResponse(`${error.message}`, 500))
  }
}

export const disLikeComment = async (req: any, res: any, next: any) => {
  try {
    const { commentId } = req.params
    const comment = await Comment.findById(commentId)
    comment.like = +comment.like - 1
    await comment.save()
    res.status(200).json({ success: true, message: 'Comment liked!', comment })
  } catch (error: any) {
    return next(new ApiErrorResponse(`${error.message}`, 500))
  }
}
