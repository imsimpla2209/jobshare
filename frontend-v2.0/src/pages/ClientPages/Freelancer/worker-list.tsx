import { Button, Card, Col, Divider, Image, Layout, Row, Space, Tag, Typography } from 'antd'
import type { CheckboxValueType } from 'antd/es/checkbox/Group'

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFreelancers } from 'src/api/freelancer-apis'
import { getAllJobs } from 'src/api/job-apis'
import { formatDay } from 'src/utils/helperFuncs'

const { Text } = Typography

interface SelectedValues {
  [menuId: number]: string[]
}
export default function WorkerList() {
  const navigate = useNavigate()

  const dataCard = [
    {
      name: 'ngiuyen quang huy',
      avatar: '',
      birthday: new Date(),
      tag: ['Chatbot Development', 'Lead Generation'],
      email: 'huy132@gmail.com',
      phone: '0987654',
    },
    {
      name: 'ngiuyen quang huy',
      avatar: '',
      birthday: new Date(),
      tag: ['Chatbot Development', 'Lead Generation'],
      email: 'huy132@gmail.com',
      phone: '0987654',
    },
    {
      name: 'ngiuyen quang huy',
      avatar: '',
      birthday: new Date(),
      tag: ['Chatbot Development', 'Lead Generation'],
      email: 'huy132@gmail.com',
      phone: '0987654',
    },
    {
      name: 'ngiuyen quang huy',
      avatar: '',
      birthday: new Date(),
      tag: ['Chatbot Development', 'Lead Generation'],
      email: 'huy132@gmail.com',
      phone: '0987654',
    },
    {
      name: 'ngiuyen quang huy',
      avatar: '',
      birthday: new Date(),
      tag: ['Chatbot Development', 'Lead Generation'],
      email: 'huy132@gmail.com',
      phone: '0987654',
    },
  ]

  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [listFreelancers, setListFreelancers] = useState([])
  const getAllListJobs = async () => {
    setLoading(true)
    await getFreelancers({ limit: 10, page: page })
      .then(res => {
        setListFreelancers([...listFreelancers, ...res.data])
      })
      .finally(() => setLoading(false))
  }
  console.log(listFreelancers)
  useEffect(() => {
    getAllListJobs()
  }, [])

  return (
    <Layout style={{ padding: 20, width: '100%' }}>
      <Row gutter={[16, 16]}>
        {dataCard.map(item => (
          <Col className="gutter-row" xs={12} sm={12} md={6} lg={6} xl={6}>
            <Card bodyStyle={{ padding: 16 }}>
              <Space direction="vertical" size={16} className="w-100">
                <Image
                  src={item?.avatar}
                  fallback="https://i2-prod.manchestereveningnews.co.uk/sport/football/article27536776.ece/ALTERNATES/s1200c/1_GettyImages-1615425379.jpg"
                />
                <div className="center w-100">
                  <Tag color="#f50" style={{ fontSize: 20, padding: 8 }}>
                    {item?.name}
                  </Tag>
                </div>
                <Divider style={{ margin: 0 }} />
                <Text>
                  <b>DOB: </b>
                  {formatDay(item.birthday)}
                </Text>
                <Text>
                  <b>Phone number: </b>
                  {item?.phone || 'None'}
                </Text>
                <Text>
                  <b>Email: </b>
                  {item?.email}
                </Text>
              </Space>
            </Card>
          </Col>
        ))}
        <Button type="text" onClick={() => setPage(page + 1)}>
          Load more
        </Button>
      </Row>
    </Layout>
  )
}
