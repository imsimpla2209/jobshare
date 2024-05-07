import config from '@config/config'
import FacebookStrategy from 'passport-facebook'
import { createUser, getUserByOptions } from '../../modules/user/user.service'

/**
 * Expose
 */

const facebookStrategy = new FacebookStrategy(
  {
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
  },
  function (accessToken: any, refreshToken: any, profile: any, done: any) {
    const options = { 'oAuth.facebook.id': profile.id }
    // eslint-disable-next-line no-console
    console.log('Facebook Token', accessToken, refreshToken)
    getUserByOptions(options)
      .then(user => {
        if (!user) {
          createUser({
            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.username,
            isEmailVerified: true,
            oAuth: { google: {}, facebook: profile._json },
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

export default facebookStrategy
