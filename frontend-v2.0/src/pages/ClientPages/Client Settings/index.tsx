import { CheckCircleTwoTone, DollarTwoTone, FormOutlined } from '@ant-design/icons'
import { Button, Card, Col, Flex, Row } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import VerifyPaymentModal from 'src/Components/ClientComponents/HomeLayout/VerifyPaymentModal'
import { clientStore, userStore } from 'src/Store/user.store'
import { useSubscription } from 'src/libs/global-state-hook'
import img from '../../../assets/img/icon-user.svg'
import { Title } from '../JobDetailsBeforeProposols'
import EditProfileForm from './updateProfile'
import TransactionHistory from 'src/pages/FreelancerPages/Reports/TransactionHistory'
import PaymentsTable from 'src/pages/FreelancerPages/Reports/TransactionHistory/tablePayment'

export default function Settings() {
  const { t } = useTranslation(['main'])
  const { state: user } = useSubscription(userStore)
  const { state: client } = useSubscription(clientStore)
  const [openVerifyModal, setOpenVerifyModal] = useState(false)

  return (
    <div style={{ padding: 20 }}>
      <VerifyPaymentModal open={openVerifyModal} handleClose={() => setOpenVerifyModal(false)} />

      <Row gutter={[16, 16]}>
        <Col span={18}>
          <Card title={t('My profile')} extra={<EditProfileForm />}>
            <Flex vertical={false} gap={20}>
              <img
                alt=""
                style={{ width: 150, height: 150 }}
                className=" avatar vertical-align-middle m-0 avatar-sm avatar-responsive"
                src={user?.avatar || img}
              />

              <Flex vertical gap={12}>
                <span className="fw-bold">
                  {t('Name')}: <span className="fw-bold text-muted">{user.name}</span>
                </span>
                <span className="fw-bold">
                  {t('Email')}: <span className="fw-bold text-muted">{user.email}</span>
                </span>

                <span className="fw-bold">
                  {t('Phone number')}: <span className="fw-bold text-muted">{user.phone}</span>
                </span>

                <span className="fw-bold">
                  {t('Address')}: <span className="fw-bold text-muted">{user.address}</span>
                </span>
              </Flex>
            </Flex>
          </Card>
        </Col>

        <Col span={6}>
          <Card bodyStyle={{ padding: 16 }}>
            {client?.paymentVerified ? (
              <>
                <Button
                  className="text-success"
                  type="text"
                  icon={<CheckCircleTwoTone className="me-2" twoToneColor="#52c41a" />}
                >
                  {t('Account verified')}
                </Button>
              </>
            ) : (
              <Button
                className="text-success"
                type="dashed"
                icon={<FormOutlined />}
                onClick={() => setOpenVerifyModal(true)}
              >
                {t('Verify Account')}
              </Button>
            )}

            <div style={{ background: '#f9f9f9', borderRadius: 20, padding: 12, marginTop: 10 }}>
              <Title level={5}>
                <DollarTwoTone spin twoToneColor="#eb2f96" style={{ marginRight: 8 }} />
                {t('Avalable jobsPoints')}: {user.jobsPoints}
              </Title>
              <Button type="default">
                <Link to="/buyconnects">{t('Buy jobsPoints')}</Link>
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Card title={t('Payments history')} className="mt-3" style={{ width: '100%' }}>
          <PaymentsTable />
        </Card>
      </Row>
    </div>
  )
}
