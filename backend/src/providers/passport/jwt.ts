import config from '@config/config'
import { Request } from 'express'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import { IPayload } from '../../modules/token/token.interfaces'
import tokenTypes from '../../modules/token/token.types'
import User from '../../modules/user/user.model'

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromExtractors([
      (request: Request) => {
        return request?.cookies?.Authentication?.token
      },
    ]),
    // passReqToCallback: true,
  },
  async (payload: IPayload, done) => {
    try {
      if (payload.type !== tokenTypes.ACCESS) {
        throw new Error('Invalid token type')
      }
      const user = await User.findById(payload.sub)
      if (!user) {
        return done(null, false)
      }
      done(null, user)
    } catch (error) {
      done(error, false)
    }
  }
)

export default jwtStrategy
