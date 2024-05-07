import 'dotenv/config'

const env = (VARIABLE: string | number, DEFAULT: string | number | undefined = ''): string => {
  return process?.env?.[VARIABLE] ?? DEFAULT.toString()
}

export default env
