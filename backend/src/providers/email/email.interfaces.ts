export interface Message {
  from: ISender
  to: IReceiver | IReceiver[]
  subject: string
  textContent: string
  htmlContent?: string
}

export interface IReceiver {
  email: string
}

export interface ISender {
  email: string
  name?: string
}
