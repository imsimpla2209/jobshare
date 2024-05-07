import { jwtStrategy, googleStrategy, facebookStrategy } from 'providers/passport'
import mongoose from 'mongoose'
import { userService } from '@modules/user'
import passport from 'passport'

// serialize
passport.serializeUser((user: any, done) => done(null, user._id))
passport.deserializeUser(async (id: string, done) =>
  userService.getUserById(new mongoose.Types.ObjectId(id)).then(user => done(null, user))
)

// use these strategies
passport.use('jwt', jwtStrategy)
passport.use('google', googleStrategy)
passport.use('facebook', facebookStrategy)

export default passport
