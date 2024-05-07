/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import mongoose from 'mongoose'
import mongooseLong from 'mongoose-long'

mongooseLong(mongoose)

const { Long } = mongoose.Schema.Types

export { Long }
