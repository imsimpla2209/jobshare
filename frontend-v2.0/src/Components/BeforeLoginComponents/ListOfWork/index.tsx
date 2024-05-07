import { DollarOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Col, Layout, Row, Skeleton, Space, Tag, theme } from 'antd'
import type { CheckboxValueType } from 'antd/es/checkbox/Group'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllJobs } from 'src/api/job-apis'
import styled from 'styled-components'

interface SelectedValues {
  [menuId: number]: string[]
}
export default function ListOfWork() {
  const navigate = useNavigate()
  const { Sider } = Layout
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const [loading, setLoading] = useState(false)
  const [listJobs, setListJobs] = useState([])
  const getAllListJobs = async () => {
    setLoading(true)
    await getAllJobs()
      .then(res => {
        setListJobs(res.data)
      })
      .finally(() => setLoading(false))
  }
  console.log(listJobs)
  useEffect(() => {
    getAllListJobs()
  }, [])

  const dataMenu = [
    {
      title: 'Job type',
      option: [
        {
          name: 'Hourly',
          quantity: '426',
          value: 'Hourly',
        },
        {
          name: 'Fixed-Price',
          quantity: '323',
          value: 'Fixed-Price',
        },
      ],
    },
    {
      title: 'Job size',
      // eslint-disable-next-line no-sparse-arrays
      option: [
        {
          name: 'No hires',
          quantity: '397',
          value: 'No hires',
        },
        {
          name: '1 to 9 hires',
          quantity: '190',
          value: '1 to 9 hires',
        },
        ,
        {
          name: '10+ hires',
          quantity: '198',
          value: '10+ hires',
        },
      ],
    },
  ]

  const [selectedValues, setSelectedValues] = useState<SelectedValues>({})

  const allSelectedValues = [].concat(...Object.values(selectedValues))
  const log = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e)
  }

  const onChange = (menuId: number, selectedList: CheckboxValueType[]) => {
    const selectedStrings = selectedList.map(String)

    setSelectedValues({
      ...selectedValues,
      [menuId]: selectedStrings,
    })
  }
  if (loading) return <Skeleton></Skeleton>

  return (
    <Layout style={{ padding: 20, width: '100%' }}>
      <Space size={[0, 8]} wrap>
        {allSelectedValues.map(item => (
          <StyleTag onClose={log}>{item}</StyleTag>
        ))}
      </Space>
      <Layout style={{ gap: 20 }}>
        <Sider
          width={300}
          style={{
            background: 'none',
          }}
        >
          <Card
            bordered
            style={{
              width: 300,
              background: colorBgContainer,
            }}
          >
            {dataMenu.map((item, index) => (
              <div key={index}>
                <Checkbox.Group
                  style={{ width: '100%', display: 'block' }}
                  value={selectedValues[index] || []}
                  onChange={selectedList => onChange(index, selectedList)}
                >
                  <h4>{item.title}</h4>
                  {item.option.map(i => (
                    <Space direction="vertical" size="middle" style={{ display: 'flex', paddingTop: '12px' }}>
                      <StyleCheckbox className="hove" value={i?.value}>
                        {i?.name} <span>({i?.quantity})</span>
                      </StyleCheckbox>
                    </Space>
                  ))}
                </Checkbox.Group>
              </div>
            ))}
          </Card>
        </Sider>
        <Row gutter={[16, 16]}>
          {listJobs.map(item => (
            <Col className="gutter-row" xs={24} sm={24} md={12} lg={12} xl={12} key={item._id}>
              <Card bordered>
                <Row>
                  <h2>{item.title}</h2>
                </Row>
                <Row style={{ marginBottom: '8px' }}>
                  <Button
                    className="btn signup-btn-cn px-3 py-2 "
                    type="primary"
                    shape="round"
                    size="large"
                    onClick={() => navigate(`/freelance-jobs/${item._id}`)}
                  >
                    View job
                  </Button>
                </Row>

                <p>{item.description}</p>
                <Row style={{ marginBottom: '8px' }}>
                  <span>
                    <DollarOutlined /> {item.payment.amount} {item.payment.type}
                  </span>
                </Row>

                <div>
                  {item.categories.map(i => (
                    <Tag
                      style={{
                        borderRadius: '10rem',
                        height: '32px',
                        lineHeight: '32px',
                        backgroundColor: '#f2f7f2',
                      }}
                    >
                      {i.name}
                    </Tag>
                  ))}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Layout>
    </Layout>
  )
}

const StyleTag = styled(Tag)`
  background-color: #108a00;
  height: 32px;
  text-align: center;
  line-height: 32px;
  border-radius: 10rem;
  color: #ffff;
`
const StyleCheckbox = styled(Checkbox)`
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #108a00;
    border-color: #108a00;
  }
  .hove:hove {
    background-color: #108a00;
    border-color: #108a00;
  }
`
