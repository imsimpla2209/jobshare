export interface IVNPayReturnObject {
  // Whether the payment succeeded or not.
  isSuccess?: boolean
  // Approve or error message based on the response code.
  message?: string
  // Merchant ID, should be the same as the checkout request.
  merchant?: string
  // Merchant's transaction ID, should be the same as the checkout request.
  transactionId?: string
  // Amount paid by the customer, already divided by 100.
  amount?: number
  // Order info, should be the same as the checkout request.
  orderInfo?: string
  // Response code, payment has errors if it is non-zero.
  responseCode?: string
  // Bank code of the bank where the payment occurred.
  bankCode?: string
  // Bank transaction ID, used to look up at the bank's side.
  bankTranNo?: string
  // Type of card.
  cardType?: string
  // Date when the transaction occurred.
  payDate?: string
  // Gateway's own transaction ID, used to look up at the gateway's side.
  gatewayTransactionNo?: string
  // Checksum of the returned data, used to verify data integrity.
  secureHash?: string
  // Additional properties specific to VNPay:

  // Example: COCOSIN
  vnp_TmnCode?: string
  // Example: node-2018-01-15T10:04:36.540Z
  vnp_TxnRef?: string
  // Example: 90000000
  vnp_Amount?: string
  // Example: Thanh toan giay adidas
  vnp_OrderInfo?: string
  // Example: 00
  vnp_ResponseCode?: string
  // Example: NCB
  vnp_BankCode?: string
  // Example: 20180115170515
  vnp_BankTranNo?: string
  // Example: ATM
  vnp_CardType?: string
  // Example: 20180115170716
  vnp_PayDate?: string
  // Example: 13008888
  vnp_TransactionNo?: string
  // Example: 115ad37de7ae4d28eb819ca3d3d85b20
  vnp_SecureHash?: string
}

export interface IVNPayCheckoutPayload {
  createdDate?: string // optional: true
  amount: number // Integer, max: 9999999999
  clientIp: string // max: 16
  currency: 'VND' // allowedValues: ['VND']
  billingCity?: string // optional: true, max: 255
  billingCountry?: string // optional: true, max: 255
  billingPostCode?: string // optional: true, max: 255
  billingStateProvince?: string // optional: true, max: 255
  billingStreet?: string // optional: true, max: 255
  customerEmail?: string // optional: true, max: 255, regEx: SimpleSchema.RegEx.Email
  customerId?: string // optional: true, max: 255
  customerPhone?: string // optional: true, max: 255
  deliveryAddress?: string // optional: true, max: 255
  deliveryCity?: string // optional: true, max: 255
  deliveryCountry?: string // optional: true, max: 255
  deliveryProvince?: string // optional: true, max: 255
  bankCode?: string // optional: true, max: 50
  locale: 'vn' | 'en' // allowedValues: ['vn', 'en']
  orderId: string // max: 34
  orderInfo: string // max: 255
  orderType: string // max: 40
  returnUrl: string // max: 255
  transactionId: string // max: 40
  vnpSecretKey: string // max: 32
  vnpMerchant: string // max: 16
  vnpCommand: string // max: 16
  vnpVersion: string // max: 2
  paymentGateway: string // regEx: SimpleSchema.RegEx.Url
  merchant: string
  secureSecret: string
}

export interface IVNPayConfig {
  paymentGateway: string
  returnUrl?: string
  merchant?: string
  secureSecret?: string
}
