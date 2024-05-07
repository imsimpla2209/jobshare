import { Button, Card, Col, Descriptions, Row, Tag, message } from 'antd'
import { useEffect, useState } from 'react'
import { getAllPayments } from 'src/api/payment-api'
import { currencyFormatter } from 'src/utils/helperFuncs'

function Billing() {
  const pencil = [
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" key={0}>
      <path
        d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z"
        className="fill-gray-7"
      ></path>
      <path d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z" className="fill-gray-7"></path>
    </svg>,
  ]

  const deletebtn = [
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" key={0}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 2C8.62123 2 8.27497 2.214 8.10557 2.55279L7.38197 4H4C3.44772 4 3 4.44772 3 5C3 5.55228 3.44772 6 4 6L4 16C4 17.1046 4.89543 18 6 18H14C15.1046 18 16 17.1046 16 16V6C16.5523 6 17 5.55228 17 5C17 4.44772 16.5523 4 16 4H12.618L11.8944 2.55279C11.725 2.214 11.3788 2 11 2H9ZM7 8C7 7.44772 7.44772 7 8 7C8.55228 7 9 7.44772 9 8V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V8ZM12 7C11.4477 7 11 7.44772 11 8V14C11 14.5523 11.4477 15 12 15C12.5523 15 13 14.5523 13 14V8C13 7.44772 12.5523 7 12 7Z"
        fill="#111827"
        className="fill-danger"
      ></path>
    </svg>,
  ]

  const information = [
    {
      title: 'Oliver Liam',
      description: 'Viking Burrito',
      address: 'oliver@burrito.com',
      vat: 'FRB1235476',
    },
    {
      title: 'Lucas Harper',
      description: 'Stone Tech Zone',
      address: 'lucas@syone-tech.com',
      vat: 'FRB1235476',
    },
    {
      title: 'Oliver Liam',
      description: 'ethan@fiber.com',
      vat: 'NumberFRB1235476',
    },
  ]

  const [payments, setPayments] = useState([])

  useEffect(() => {
    getAllPayments()
      .then(res => setPayments(res.data.results))
      .catch(err => message.error(err))
  }, [])

  console.log(payments)

  return (
    <>
      <Row gutter={[24, 0]}>
        <Card
          className="header-solid h-full"
          bordered={false}
          title={[<h6 className="font-semibold m-0">Billing Information</h6>]}
          bodyStyle={{ paddingTop: '0' }}
        >
          <Row gutter={[24, 24]}>
            {payments.map((payment, index) => (
              <Col span={24} key={index}>
                <Card className="card-billing-info" bordered={false}>
                  <div className="col-info">
                    <Descriptions title={payment.from.name}>
                      <Descriptions.Item label="Purpose" span={3}>
                        {payment.purpose}
                      </Descriptions.Item>
                      <Descriptions.Item label="Note" span={3}>
                        {payment.note}
                      </Descriptions.Item>
                      <Descriptions.Item label="Payment method" span={3}>
                        {payment.paymentMethod}
                      </Descriptions.Item>
                      <Descriptions.Item label="Amount" span={3}>
                        {currencyFormatter(payment.amount)}
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                  <div className="col-action">
                    <span>
                      <Tag color={payment.status === 'completed' ? 'success' : 'processing'}>{payment.status}</Tag>
                    </span>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </Row>
    </>
  )
}

export default Billing
