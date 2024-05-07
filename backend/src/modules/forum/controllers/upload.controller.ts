/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
import archiver from 'archiver'
import AWS from 'aws-sdk'
import { PassThrough } from 'stream'
import { v4 as uuidv4 } from 'uuid'
import BEConfig from '@config/config'
import httpStatus from 'http-status'
import { ApiError } from 'common/errors'
import Post from '../models/Post'
import ApiErrorResponse from '../utils/ApiErrorResponse'

const cloudinary = require('cloudinary').v2

const initS3AWS = () => {
  const accesskeyId = process.env.AWS_S3_ACCESS_KEY
  const secretAccessKey = process.env.AWS_S3_SECRET_KEY
  const config = {
    credentials: {
      accessKeyId: accesskeyId,
      secretAccessKey,
    },
    region: 'ap-northeast-1',
  }

  const s3 = new AWS.S3(config)
  s3.config.update(config)

  return s3
}

cloudinary.config({
  cloud_name: BEConfig.Cloudinary.cloudName,
  api_key: BEConfig.Cloudinary.accessKey,
  api_secret: BEConfig.Cloudinary.secretKey,
})

export const getPresignedUrl = (req: any, res: any, next: any) => {
  const s3 = initS3AWS()
  const extension = req.query.ext
  const { type } = req.query
  const key = `${req?.user?._id}/${uuidv4()}.${req.query.ext}`

  s3.getSignedUrl(
    'putObject',
    {
      Bucket: 'yessir-bucket-tqt',
      Key: key,
      ContentType: type,
      // Conditions: [
      //   ['content-length-range', 0, 10000000],
      // ['starts-with', '$Content-Type', 'image/'],
      //   ['eq', '$Content-Type', type],
      // ],
      Expires: 15,
    },
    (err, url) => {
      if (!err) {
        return res.status(200).json({
          key,
          url,
        })
      }
      return next(new ApiErrorResponse(`cannot call for presigned url, ${err.message}`, 500))
    }
  )
}

const multiFilesStream = fileKeys => {
  const archive = archiver('zip', { zlib: { level: 5 } })
  const s3 = initS3AWS()
  for (const element of fileKeys) {
    const realKey = element.slice(element.lastIndexOf('/') - 24)
    console.log(realKey)
    const passthrough = new PassThrough()
    s3.getObject({
      Bucket: 'yessir-bucket-tqt',
      Key: realKey,
    })
      .createReadStream()
      .pipe(passthrough)
    archive.append(passthrough, { name: realKey })
  }
  return archive
}

export const downloadFiles = async (req: any, res: any, next: any) => {
  try {
    const ideaId = req.query.id
    const idea = await Post.findById(ideaId)
    if (!idea) {
      return next(new ApiErrorResponse(`Not found idea id ${ideaId}`, 404))
    }
    if (!idea?.files) {
      return next(new ApiErrorResponse(`Post id ${ideaId} does not have files`, 400))
    }
    const mfstream = multiFilesStream(idea?.files)
    mfstream.pipe(res)
    mfstream.finalize()
  } catch (err: any) {
    return next(new ApiErrorResponse(`${err.message}`, 500))
  }
}

export const getCLPresignedUrl = async (req: any, res: any, next: any) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000)
    const key = `${req?.user?._id}/${uuidv4()}`
    const signature = await cloudinary.utils.api_sign_request(
      {
        timestamp,
        // eager: 'w_400,h_300,c_pad|w_260,h_200,c_crop',
        // public_id: key,
        // upload_preset: 'uploadProfilePicture',
      },
      BEConfig.Cloudinary.secretKey
    )
    res.status(httpStatus.CREATED).send({
      timestamp,
      signature,
      key,
      cloudName: BEConfig.Cloudinary.cloudName,
      apiKey: BEConfig.Cloudinary.accessKey,
    })
  } catch (e) {
    throw new ApiError(httpStatus.BAD_GATEWAY, `cannot generate presign error ${e}`)
  }
}
