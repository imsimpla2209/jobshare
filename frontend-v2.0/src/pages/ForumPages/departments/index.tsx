import { PlusCircleTwoTone } from '@ant-design/icons'
import { Col, Divider, Input, Row, Skeleton, Typography, message } from 'antd'
import { Http } from 'api/http'
import { useEffect, useState } from 'react'
import AddDepartmentModal from './add-new-department'
import DepartmentCardItem from './card-department'
import { BlueColorButton } from 'Components/CommonComponents/custom-style-elements/button'

const { Title } = Typography

function DepartmentManager() {
  const [searchKey, setSearchKey] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [allDepartmentList, setAllDepartmentList] = useState([])
  const [editDepartment, setEditDepartment] = useState(null)
  const [loading, setLoading] = useState(false)

  const getDepartmentList = async () => {
    setLoading(true)
    await Http.get('/api/v1/department')
      .then(res => {
        setAllDepartmentList(res.data.data)
      })
      .catch(error => message.error(error.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getDepartmentList()
  }, [])

  const handleDeleteDepartment = async (id: string) => {
    await Http.post('/api/v1/department/delete', { id })
      .then(() => setAllDepartmentList(allDepartmentList.filter(department => department._id !== id)))
      .catch(error => message.error(error.message))
  }

  return (
    <>
      <AddDepartmentModal
        setLoading={setLoading}
        isOpen={openModal}
        onCloseModal={() => setOpenModal(false)}
        setDeparments={setAllDepartmentList}
        deparments={allDepartmentList}
        currentDepartment={editDepartment}
      />
      <div style={{ padding: 20, margin: 0 }}>
        <Row justify="space-between">
          <Title level={3} style={{ margin: 0 }}>
            Departments list
          </Title>
          <BlueColorButton
            icon={<PlusCircleTwoTone twoToneColor={'#005ec2'} />}
            onClick={() => {
              setOpenModal(true)
              setEditDepartment(null)
            }}
            size="large"
          >
            Add new Department
          </BlueColorButton>
        </Row>
        <Divider />
        <Input
          style={{ marginBottom: 16 }}
          allowClear
          placeholder="Search categories"
          value={searchKey}
          onChange={e => setSearchKey(e.target.value)}
        ></Input>
        <Skeleton loading={loading} avatar active>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {allDepartmentList
              .filter(c => c.name.toLowerCase().includes(searchKey.toLowerCase()))
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .map((department, index) => (
                <Col className="gutter-row" xs={24} sm={12} md={8} lg={8} key={index} style={{ marginBottom: 16 }}>
                  <DepartmentCardItem
                    department={department}
                    setEditDepartment={department => {
                      setEditDepartment(department)
                      setOpenModal(true)
                    }}
                    handleDeleteDepartment={() => handleDeleteDepartment(department._id)}
                  />
                </Col>
              ))}
          </Row>
        </Skeleton>
      </div>
    </>
  )
}

export default DepartmentManager
