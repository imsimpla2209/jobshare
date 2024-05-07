import { Table, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { clientStore } from 'src/Store/user.store'
import { getpayments } from 'src/api/payment-api'
import { useSubscription } from 'src/libs/global-state-hook'
import { Text } from 'src/pages/ClientPages/JobDetailsBeforeProposols'
import { currencyFormatter } from 'src/utils/helperFuncs'

export default function PaymentsTable() {
  const { t } = useTranslation(['main'])
  const client = useSubscription(clientStore).state
  const [payments, setPayments] = useState([])
  const [page, setPage] = useState(1)

  const columns = [
    {
      title: 'Purpose',
      dataIndex: 'purpose',
      key: 'purpose',
      render: (_, { purpose }) => <Text>{purpose}</Text>,
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (_, { amount }) => currencyFormatter(amount),
    },
    {
      title: 'Note',
      key: 'note',
      dataIndex: 'note',
    },

    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (_, { status }) => <Tag color={status === 'completed' ? 'success' : 'processing'}>{t(status)}</Tag>,
    },
  ]

  useEffect(() => {
    if (client.user) {
      getpayments(client.user).then(res => setPayments(res.data.results))
    }
  }, [client.user])

  return (
    <Table
      style={{ width: '100%' }}
      columns={columns}
      dataSource={payments.map(payment => ({ ...payment, key: payment._id }))}
    />
  )
}
