import Joi from 'joi'

const VNPayCheckoutSchema = Joi.object({
  createdDate: Joi.string().optional(),
  amount: Joi.number().integer().max(9999999999).required(),
  clientIp: Joi.string().max(16).required(),
  currency: Joi.string().valid('VND').required(),
  billingCity: Joi.string().max(255).optional(),
  billingCountry: Joi.string().max(255).optional(),
  billingPostCode: Joi.string().max(255).optional(),
  billingStateProvince: Joi.string().max(255).optional(),
  billingStreet: Joi.string().max(255).optional(),
  customerEmail: Joi.string().max(255).email().optional(),
  customerId: Joi.string().max(255).optional(),
  customerPhone: Joi.string().max(255).optional(),
  deliveryAddress: Joi.string().max(255).optional(),
  deliveryCity: Joi.string().max(255).optional(),
  deliveryCountry: Joi.string().max(255).optional(),
  deliveryProvince: Joi.string().max(255).optional(),
  bankCode: Joi.string().max(50).optional(),
  locale: Joi.string().valid('vn', 'en').required(),
  orderId: Joi.string().max(34).required(),
  orderInfo: Joi.string().max(255).required(),
  orderType: Joi.string().max(40).required(),
  returnUrl: Joi.string().max(255).required(),
  transactionId: Joi.string().max(40).required(),
  vnpSecretKey: Joi.string().max(32).required(),
  vnpMerchant: Joi.string().max(16).required(),
  vnpCommand: Joi.string().max(16).required(),
  vnpVersion: Joi.string().max(2).required(),
})

const VNPayConfigSchema = Joi.object({
  paymentGateway: Joi.string().uri().required(),
  returnUrl: Joi.string().uri().required(),
  merchant: Joi.string().required(),
  secureSecret: Joi.string().required(),
})

export { VNPayConfigSchema, VNPayCheckoutSchema }
