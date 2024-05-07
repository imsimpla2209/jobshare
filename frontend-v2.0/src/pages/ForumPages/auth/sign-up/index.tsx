import { Button, Card, Col, Grid, Layout, Row, Space, Typography } from 'antd'
import { useState } from 'react'
import styled from 'styled-components'

const { Title, Text, Link } = Typography

export default function SignUp() {
  const [activeOption, setActiveOption] = useState(null)
  return (
    <Layout style={{ alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <StyledCard>
        <Space direction="vertical" size="large" style={{ display: 'flex', alignItems: 'center' }}>
          <Title>Join as a worker or hire</Title>
          <Space>
            <Card
              style={{ width: 250, cursor: 'pointer' }}
              className={`${activeOption === 'worker' ? 'active' : ''}`}
              onClick={() => setActiveOption('worker')}
            >
              <Text style={{ fontSize: 20 }}>I'm a worker, hiring for a job</Text>
            </Card>

            <Card
              style={{ width: 250, cursor: 'pointer' }}
              className={`${activeOption === 'hire' ? 'active' : ''}`}
              onClick={() => setActiveOption('hire')}
            >
              <Text style={{ fontSize: 20 }}>I'm a hire, finding workers</Text>
            </Card>
          </Space>
          <Button type="primary" disabled={!activeOption} style={{ minWidth: 300 }}>
            {!activeOption ? 'Create an account' : activeOption === 'hire' ? 'Join as a hire' : 'Join as a worker'}
          </Button>
          <Text>
            Already have an account? <Link href="/login">Login</Link>{' '}
          </Text>
        </Space>
      </StyledCard>
    </Layout>
  )
}

const StyledCard = styled(Card)`
  .active {
    border: 2px solid #394c90;
  }
`
