/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/naming-convention */
import config from '@config/config'
import { Connect, Process } from './mongodb'

/* eslint-disable import/prefer-default-export */
export async function startBackup() {
  try {
    console.log('Backup tool start....')

    const { log } = console
    console.log = function (...args) {
      args.unshift(new Date())
      log.apply(console, args)
    }
    /** *********************************************************************** */
    console.log(config)
    /** *********************************************************************** */
    const primary = await Connect(config.mongoose.url)
    const database = primary.db('test')
    console.log(`Connect db primary....`)
    const slave = await Connect(config.mongoose.slave)
    const backup_db = slave.db(config.mongoose.slaveName)
    console.log(`Connect db slave....`)
    /** *********************************************************************** */
    const total = await Process(database, backup_db)
    console.log(`${total} documents backup done...`)
    await primary.close()
    await slave.close()
  } catch (err) {
    console.log(err)
  }
}
