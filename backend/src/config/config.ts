import Joi from 'joi'
import 'dotenv/config'

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    MONGODB_POOLSIZE: Joi.number().required().description('Mongo DB pool size'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    CLIENT_URL: Joi.string().required().description('Client url'),
    GOOGLE_CLIENTID: Joi.string().required().description('Google Client ID'),
    GOOGLE_SECRET: Joi.string().required().description('Google Client SECRET'),
    FB_CLIENTID: Joi.string().required().description('FB Client ID'),
    FB_SECRET: Joi.string().required().description('FB Client SECRET'),
    API_HOST: Joi.string().required().description('Api host'),
    COOKIE_MAX_AGE: Joi.number().description('cookie max age'),
    AWS_S3_ACCESS_KEY: Joi.string().required().description('S3 Access Key'),
    AWS_S3_SECRET_KEY: Joi.string().required().description('S3 Secret Key'),
    S3_BUCKET_NAME: Joi.string().required().description('S3 Bucket name'),
    SIB_API_KEY: Joi.string().required().description('Sendinblue Secret Key'),
    VNP_TMNCODE: Joi.string().required().description('VNP code'),
    VNP_HASHSECRET: Joi.string().required().description('VNP secret key'),
    VNP_URL: Joi.string().description('VNP URL'),
    VNP_API: Joi.string().description('VNP API'),
    VNP_RETURNURL: Joi.string().description('VNP return url'),
    PAYPAL_CLIENT_ID: Joi.string().description('PAYPAL client id'),
    CL_ACCESS_KEY: Joi.string().required().description('Cloudiary Access Key'),
    CL_SECRET_KEY: Joi.string().required().description('Cloudiary Secret Key'),
    S3_CL_name: Joi.string().required().description('Cloudiary name'),
    SMS_ACCESS_KEY: Joi.string().required().description('SMS Access Key'),
    DEVICE_ID: Joi.string().required().description('SMS Device id'),
    REDIS_PORT: Joi.number().required().description('Redis port'),
    REDIS_HORT: Joi.string().required().description('Redis hort'),
  })
  .unknown()

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  apiHost: envVars.API_HOST,
  mongoose: {
    // url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    url: `${envVars.MONGODB_URL}backup`,
    slave: `${envVars.MONGODB_URL}backup`,
    slaveName: `backup-jobsicker-version-${new Date().getTime()}`,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    poolSize: envVars.MONGODB_POOLSIZE,
  },
  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    cookieOptions: {
      httpOnly: true,
      secure: envVars.NODE_ENV === 'production',
      signed: true,
      maxAge: envVars.COOKIE_MAX_AGE,
    },
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
    sibKey: envVars.SIB_API_KEY,
  },
  SMS: {
    accessKey: envVars.SMS_ACCESS_KEY,
    deviceId: envVars.DEVICE_ID,
  },
  clientUrl: envVars.CLIENT_URL,
  google: {
    clientID: envVars.GOOGLE_CLIENTID,
    clientSecret: envVars.GOOGLE_SECRET,
    callbackURL: `${envVars.API_HOST}/auth/google/callback`,
  },
  facebook: {
    clientID: envVars.FB_CLIENTID,
    clientSecret: envVars.FB_SECRET,
    callbackURL: `${envVars.API_HOST}/auth/facebook/callback`,
  },
  AWS_S3: {
    accessKey: envVars.AWS_S3_ACCESS_KEY,
    secretKey: envVars.AWS_S3_SECRET_KEY,
    s3BucketName: envVars.S3_BUCKET_NAME,
  },
  Cloudinary: {
    accessKey: envVars.CL_ACCESS_KEY,
    secretKey: envVars.CL_SECRET_KEY,
    cloudName: envVars.S3_CL_name,
  },
  VN_pay: {
    vnp_TmnCode: envVars.VNP_TMNCODE,
    vnp_HashSecret: envVars.VNP_HASH_SECRET,
    vnp_Url: envVars.VNP_URL,
    vnp_Api: envVars.VNP_API,
    vnp_ReturnUrl: envVars.VNP_RETURNURL,
  },
  PAYPAL: {
    client_id: envVars.PAYPAL_CLIENT_ID,
  },
}

export default config
