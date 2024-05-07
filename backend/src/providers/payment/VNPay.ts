import { URL } from 'url'
import config from '@config/config'
import { createMd5Hash, toUpperCase, vnPayDateFormat } from './helper'
import { IVNPayCheckoutPayload, IVNPayConfig, IVNPayReturnObject } from './interface'
import { VNPayCheckoutSchema, VNPayConfigSchema } from './validation'

/**
 * const TEST_CONFIG = VNPay.TEST_CONFIG;
 *
 * const vnpayCheckout = new VNPay({
 * 	paymentGateway: TEST_CONFIG.paymentGateway,
 * 	merchant: TEST_CONFIG.merchant,
 * 	secureSecret: TEST_CONFIG.secureSecret,
 * });
 *
 * // checkoutUrl is an URL instance
 * const checkoutUrl = await vnpayCheckout.buildCheckoutUrl(params);
 *
 * this.response.writeHead(301, { Location: checkoutUrl.href });
 * this.response.end();
 */
class VNPay {
  config: IVNPayConfig

  static CURRENCY_VND: any

  static LOCALE_VN: any

  static VERSION: any

  static COMMAND: any

  static LOCALE_EN: string

  static TEST_CONFIG: { paymentGateway: string; merchant: string; secureSecret: string }

  /**
   * @param  {Object} config
   */
  constructor(c: object) {
    VNPayConfigSchema.validate(this.config)
    // check type validity
    this.config = { ...c } as IVNPayConfig
  }

  /**
   * Build checkoutUrl to redirect to the payment gateway
   * <br>
   * @param  {IVNPayCheckoutPayload} payload
   * @return {Promise<URL>} buildCheckoutUrl promise
   */
  buildCheckoutUrl(payload: IVNPayCheckoutPayload): Promise<URL> {
    return new Promise((resolve, reject) => {
      const data = { ...this.checkoutPayloadDefaults, ...payload }

      data.vnpSecretKey = this.config.secureSecret
      data.vnpMerchant = this.config.merchant

      // Input type checking
      try {
        this.validateCheckoutPayload(data)
      } catch (error: any) {
        reject(error.message)
      }

      // convert amount to VNPay format (100 = 1VND):
      data.amount = Math.floor(data.amount * 100)

      /* prettier-ignore */
      const arrParam = {
        vnp_Version: data.vnpVersion,
        vnp_Command: data.vnpCommand,
        vnp_TmnCode: data.vnpMerchant,
        vnp_Locale: data.locale,
        vnp_BankCode: data.bankCode,
        vnp_CurrCode: data.currency,
        vnp_TxnRef: data.orderId,
        vnp_OrderInfo: data.orderInfo,
        vnp_OrderType: data.orderType,
        vnp_Amount: String(data.amount),
        vnp_ReturnUrl: data.returnUrl,
        vnp_IpAddr: data.clientIp,
        vnp_CreateDate: data.createdDate || vnPayDateFormat(new Date()),
      };

      // Step 2. Create the target redirect URL at VNPay server
      const redirectUrl = new URL(this.config.paymentGateway)
      const secureCode = []

      Object.keys(arrParam)
        .sort()
        .forEach(key => {
          const value = arrParam[key]

          if (value == null || value.length === 0) {
            return
          }

          redirectUrl.searchParams.append(key, value) // no need to encode URI with URLSearchParams object

          if (value.length > 0 && (key.startsWith('vnp_') || key.startsWith('user_'))) {
            // secureCode is digested from vnp_* params but they should not be URI encoded
            secureCode.push(`${key}=${value}`)
          }
        })

      /* Step 3. calculate the param checksum with md5 */

      if (secureCode.length > 0) {
        redirectUrl.searchParams.append('vnp_SecureHashType', 'MD5')
        redirectUrl.searchParams.append('vnp_SecureHash', createMd5Hash(data.vnpSecretKey + secureCode.join('&')))
      }

      resolve(redirectUrl)
    })
  }

  /**
   * @param {IVNPayCheckoutPayload} payload
   */
  validateCheckoutPayload(payload: IVNPayCheckoutPayload) {
    VNPayCheckoutSchema.validate(payload)
  }

  /**
   * @return {IVNPayCheckoutPayload}
   */
  get checkoutPayloadDefaults() {
    /* prettier-ignore */
    return {
      currency: VNPay.CURRENCY_VND,
      locale: VNPay.LOCALE_VN,
      vnpVersion: VNPay.VERSION,
      vnpCommand: VNPay.COMMAND,
    };
  }

  /**
   * @param  {Object} query
   * @return {Promise<IVNPayReturnObject>}
   */
  verifyReturnUrl(query: object): Promise<IVNPayReturnObject> {
    return new Promise(resolve => {
      const returnObject = this._mapQueryToObject(query)

      const data: any = { ...query }
      const vnpTxnSecureHash = data.vnp_SecureHash
      const verifyResults: any = {}
      delete data.vnp_SecureHashType
      delete data.vnp_SecureHash

      if (this.config.secureSecret.length > 0) {
        const secureCode = []

        Object.keys(data)
          .sort() // need to sort the key by alphabetically
          .forEach(key => {
            const value = data[key]

            if (value.length > 0 && (key.startsWith('vnp_') || key.startsWith('user_'))) {
              secureCode.push(`${key}=${value}`)
            }
          })

        if (
          toUpperCase(vnpTxnSecureHash) === toUpperCase(createMd5Hash(this.config.secureSecret + secureCode.join('&')))
        ) {
          verifyResults.isSuccess = returnObject.responseCode === '00'
        } else {
          verifyResults.isSuccess = false
          verifyResults.message = 'Wrong checksum'
        }
      }

      resolve(Object.assign(returnObject, query, verifyResults))
    })
  }

  _mapQueryToObject(query) {
    const returnObject = {
      merchant: query.vnp_TmnCode,
      transactionId: query.vnp_TxnRef,
      amount: parseInt(query.vnp_Amount, 10) / 100,
      orderInfo: query.vnp_OrderInfo,
      responseCode: query.vnp_ResponseCode,
      bankCode: query.vnp_BankCode,
      bankTranNo: query.vnp_BankTranNo,
      cardType: query.vnp_CardType,
      payDate: query.vnp_PayDate,
      gatewayTransactionNo: query.vnp_TransactionNo,
      secureHash: query.vnp_SecureHash,
      message: VNPay.getReturnUrlStatus(query.vnp_ResponseCode), // no message from gateway, we'll look it up on our side
    }

    return returnObject
  }

  /**
   * @param {*} responseCode
   * @param {*} locale
   *  @return {string}
   */
  static getReturnUrlStatus(responseCode: any, locale: any = 'vn'): string {
    const responseCodeTable = {
      '00': {
        vn: 'Giao dịch thành công',
        en: 'Approved',
      },
      '01': {
        vn: 'Giao dịch đã tồn tại',
        en: 'Transaction is already exist',
      },
      '02': {
        vn: 'Merchant không hợp lệ (kiểm tra lại vnp_TmnCode)',
        en: 'Invalid merchant (check vnp_TmnCode value)',
      },
      '03': {
        vn: 'Dữ liệu gửi sang không đúng định dạng',
        en: 'Sent data is not in the right format',
      },
      '04': {
        vn: 'Khởi tạo GD không thành công do Website đang bị tạm khóa',
        en: 'Payment website is not available',
      },
      '05': {
        vn: 'Giao dịch không thành công do: Quý khách nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
        en: 'Transaction failed: Too many wrong password input',
      },
      '06': {
        vn: 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
        en: 'Transaction failed: Wrong OTP input',
      },
      '07': {
        vn: 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường). Đối với giao dịch này cần merchant xác nhận thông qua merchant admin: Từ chối/Đồng ý giao dịch',
        en: 'This transaction is suspicious',
      },
      '08': {
        vn: 'Giao dịch không thành công do: Hệ thống Ngân hàng đang bảo trì. Xin quý khách tạm thời không thực hiện giao dịch bằng thẻ/tài khoản của Ngân hàng này.',
        en: 'Transaction failed: The banking system is under maintenance. Please do not temporarily make transactions by card / account of this Bank.',
      },
      '09': {
        vn: 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
        en: 'Transaction failed: Cards / accounts of customer who has not yet registered for Internet Banking service.',
      },
      10: {
        vn: 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
        en: 'Transaction failed: Customer incorrectly validate the card / account information more than 3 times',
      },
      11: {
        vn: 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
        en: 'Transaction failed: Pending payment is expired. Please try again.',
      },
      24: {
        vn: 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
        en: 'Transaction canceled',
      },
      51: {
        vn: 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
        en: 'Transaction failed: Your account is not enough balance to make the transaction.',
      },
      65: {
        vn: 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
        en: 'Transaction failed: Your account has exceeded the daily limit.',
      },
      75: {
        vn: 'Ngân hàng thanh toán đang bảo trì',
        en: 'Banking system is under maintenance',
      },
      default: {
        vn: 'Giao dịch thất bại',
        en: 'Failured',
      },
    }

    const respondText = responseCodeTable[responseCode]

    return respondText ? respondText[locale] : responseCodeTable.default[locale]
  }
}

// should not be changed
VNPay.VERSION = '2'
VNPay.COMMAND = 'pay'
// vnpay only support VND
VNPay.CURRENCY_VND = 'VND'
VNPay.LOCALE_EN = 'en'
VNPay.LOCALE_VN = 'vn'

VNPay.TEST_CONFIG = {
  paymentGateway: 'http://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  merchant: 'COCOSIN',
  secureSecret: 'RAOEXHYVSDDIIENYWSLDIIZTANXUXZFJ',
}

const VNPayProvider = new VNPay({
  paymentGateway: config.VN_pay.vnp_Url,
  returnUrl: config.VN_pay.vnp_ReturnUrl,
  secureSecret: config.VN_pay.vnp_HashSecret,
  merchant: 'COCOSIN',
})

export default VNPayProvider
