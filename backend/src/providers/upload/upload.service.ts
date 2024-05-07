import config from '@config/config'
import archiver from 'archiver'
import AWS from 'aws-sdk'
import { ApiError } from 'common/errors'
import httpStatus from 'http-status'
import { PassThrough } from 'stream'
import { v4 as uuidv4 } from 'uuid'
import { Response } from 'express'

const initS3AWS = () => {
  const accessKeyId = config.AWS_S3.accessKey
  const secretAccessKey = config.AWS_S3.secretKey
  const configS3 = {
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    region: 'us-east-1',
  }
  const s3 = new AWS.S3(configS3)
  s3.config.update(configS3)
  return s3
}

/**
 * get presignURL for upload to S3
 * @param {any} type
 * @param {any} type
 * @returns {Promise<void>}
 */
export const getPresignedUrl = (type: any, ext: string, userId: string) => {
  const s3 = initS3AWS()
  const key = `${userId}/${uuidv4()}.${ext}`
  s3.getSignedUrl(
    'putObject',
    {
      Bucket: 'yessir-bucket-tqt',
      Key: key,
      ContentType: type,
      Expires: 15,
    },
    (err, url) => {
      if (!err) {
        return {
          key,
          url,
        }
      }
      throw new ApiError(httpStatus.BAD_REQUEST, `cannot call for presigned url, ${err.message}`)
    }
  )
}

/**
 * stream all files from S3
 * @param {string[]} fileKeys
 * @returns {Promise<void>}
 */
const multiFilesStream = (fileKeys: any) => {
  const archive = archiver('zip', { zlib: { level: 5 } })
  const s3 = initS3AWS()
  // eslint-disable-next-line no-restricted-syntax
  for (const element of fileKeys) {
    const realKey = element.slice(element.lastIndexOf('/') - 24)
    const passthrough = new PassThrough()
    s3.getObject({
      Bucket: config.AWS_S3.s3BucketName,
      Key: realKey,
    })
      .createReadStream()
      .pipe(passthrough)
    archive.append(passthrough, { name: realKey })
  }
  return archive
}

/**
 * download files stored in S3
 * @param {Response} res
 * @param {string[]} fileNames
 * @returns {Promise<void>}
 */
export const downloadFiles = async (fileNames: string[], res: Response): Promise<void> => {
  try {
    const mfstream = multiFilesStream(fileNames)
    mfstream.pipe(res)
    mfstream.finalize()
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, `cannot download files`)
  }
}
