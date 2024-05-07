import { Title } from 'src/pages/ClientPages/JobDetailsBeforeProposols'
import PaymentsTable from './tablePayment'
import { useTranslation } from 'react-i18next'

export default function TransactionHistory() {
  const { t } = useTranslation(['main'])

  return (
    <div style={{ padding: 20 }}>
      <Title>{t('Transaction history')}</Title>
      <PaymentsTable />
    </div>
  )
}
