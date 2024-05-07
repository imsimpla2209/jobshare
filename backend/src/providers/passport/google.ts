/* eslint-disable no-console */
import config from '@config/config'
import { createUser, getUserByOptions } from '../../modules/user/user.service'

const GoogleStrategy = require('passport-google-oauth2').Strategy

/**
 * Expose
 */

const googleStrategy = new GoogleStrategy(
  {
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL,
  },
  function (accessToken: any, refreshToken: any, profile: any, done: any) {
    const options = { 'oAuth.google.id': profile.id }
    console.log('===== GOOGLE AUTH =======')
    console.log('Google Token', accessToken, refreshToken)
    console.log('===== 420 =======')
    getUserByOptions(options)
      .then(user => {
        if (!user) {
          createUser({
            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.username,
            isEmailVerified: true,
            oAuth: { google: profile._json, facebook: {} },
            password: '',
            role: '',
            phone: '',
            nationalId: '',
            dob: profile?.birthday,
            isPhoneVerified: false,
            sex: profile?.gender,
          }).then(createdUser => {
            return done(null, createdUser)
          })
        } else {
          return done(null, user)
        }
      })
      .catch(error => {
        return done(error, false)
      })
  }
)

export default googleStrategy
