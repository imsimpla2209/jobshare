import { Card, Checkbox, Col, Divider, Image, Layout, Row, Space, Tag, theme, Typography } from 'antd'
import type { CheckboxValueType } from 'antd/es/checkbox/Group'
import { formatDay } from 'utils/helperFuncs'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const { Text } = Typography

interface SelectedValues {
  [menuId: number]: string[]
}
export default function WorkerList() {
  const navigate = useNavigate()
  const { Sider } = Layout
  const {
    token: { colorBgContainer },
  } = theme.useToken()

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
      title: 'Client history',
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
    console.log(selectedValues)
  }
  return (
    <Layout style={{ padding: 20, width: '100%' }}>
      <Space size={[0, 8]} wrap>
        {allSelectedValues.map(item => (
          <StyleTag onClose={log}>{item}</StyleTag>
        ))}
      </Space>
      <Layout>
        <Layout>
          {/* <Sider
            width={300}
            style={{
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
          </Sider> */}
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
          </Row>
        </Layout>
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
