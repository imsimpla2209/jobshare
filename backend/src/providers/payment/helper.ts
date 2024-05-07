import crypto from 'crypto'

const urlRegExp = /https?:\/\/.*/

export { urlRegExp }

/**
 * Global function to convert String to upper case, with type checking
 *
 * @param {string} s
 * @return {string} all upper case string
 */
export function toUpperCase(s = '') {
  if (typeof s !== 'string') {
    throw new Error('toUpperCase:param must be string')
  }

  return s.toUpperCase()
}

/**
 * @param {*} data
 * @param {*} encoding
 * @return {Buffer} Buffer of data encoded with `encoding` method
 */
export function pack(data: any, encoding: any = 'hex'): Buffer {
  return Buffer.from(data, encoding)
}

/**
 * @param  {string} algorithm  hashing algorithm
 * @param  {*}      data       data string to be hashed
 * @param  {Buffer} secret     Secret key used to hash data, generated with `pack` method
 * @return {string}            digested hash
 */
export function hashHmac(algorithm: string, data: any, secret: Buffer): string {
  const hmac = crypto.createHmac(algorithm, secret)
  hmac.update(data)

  return hmac.digest('hex')
}

/**
 * Convenient function to convert number to 2 digit number string
 * @param {*} number
 * @return {string} formatted number
 */
export function to2DigitNumber(number: any): string {
  if (Number.isNaN(number)) {
    throw new Error('to2DigitNumber:param must be a number')
  }
  if (!number) {
    return '00'
  }

  return `0${number}`.substring(-2, 2)
}

/**
 * Convenient function to convert date to format yyyyMMddHHmmss
 *
 * @param {Date} date Date object that need to be formatted
 * @return {string} date string formatted in yyyyMMddHHmmss
 */
export function vnPayDateFormat(date: Date): string {
  if (date.constructor.name !== 'Date') {
    throw new Error('vnPayDateFormat:param must be a date')
  }

  let result = ''
  result += date.getFullYear().toString()
  result += to2DigitNumber(date.getMonth() + 1)
  result += to2DigitNumber(date.getDate())
  result += to2DigitNumber(date.getHours())
  result += to2DigitNumber(date.getMinutes())
  result += to2DigitNumber(date.getSeconds())

  return result
}

/**
 * Convenient function to create md5 hash from string.
 *
 * @param {*} data
 * @return {string} md5 hash
 */
export function createMd5Hash(data: any): string {
  return crypto.createHash('md5').update(data).digest('hex')
}
