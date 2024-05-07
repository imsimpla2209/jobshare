export const ResponseStatus = {
  OK: 200,
  CREATED: 201,
  MULTIPLE_CHOICE: 300,
  FOUND: 302,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  CONNECTION_TIMED_OUT: 522,
  ORIGIN_IS_UNREACHABLE: 523,
  INVALID_SSL_CERTIFICATE: 526
}

export const Level = [
  'Beginer',
  'Intermediate',
  'Junior',
  'Senior',
  'Expert',
]

export enum EMessagePurpose {
  Proposal = 'Proposal',
  Job = 'Job',
  None = 'Communication',
}

export enum ERoomType {
  Single = 'Single',
  Multi = 'Multi',
}

export enum EMessageType {
  Normal = 'Normal',
  HTML = 'HTML',
  Attachment = 'Attachment',
  Embed = 'Embed',
}

export const PAYPAL_CLIENT_ID='AZ_UPj7fyxZxMWb1fViq9b0sgXVEmJGfAPK-5pw3w4CRfqJT7XlT8vxi9TybaCAeERyMxpy9oID_Z7ml'

export const stopWords = new Set(['and', 'or', 'to', 'in', 'a', 'the', /* ...and more */ ])