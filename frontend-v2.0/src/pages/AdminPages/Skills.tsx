import { Button, Card, Col, Form, Input, Modal, Radio, Row, Space, Table, Typography, message } from 'antd'
import { DeleteTwoTone, EditTwoTone, PlusCircleTwoTone, SearchOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { getAllJobs, getSkills } from 'src/api/job-apis'
import { createSkill, deleteSkill, updateSkill } from 'src/api/skill-apis'

const { Title } = Typography

// table code start
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: '20%',
  },
  {
    title: 'NAME',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'VIETNAMESE NAME',
    dataIndex: 'name_vi',
    key: 'name_vi',
  },
  {
    title: 'CATEGORY',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: 'NUMBER JOBS USING SKILL',
    key: 'numberOfJobs',
    dataIndex: 'numberOfJobs',
    width: '100px',
  },
  {
    title: 'ACTION',
    key: 'action',
    dataIndex: 'action',
    width: '100px',
  },
]

function SkillsTable() {
  const [skills, setSkills] = useState([])
  const [skillInJobs, setSkillInJobs] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [openEditModal, setOpenEditModal] = useState('')
  const [openAddModal, setOpenAddModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form] = Form.useForm()
  const [formAdd] = Form.useForm()
  const [modal, contextHolder] = Modal.useModal()
  const [update, forceUpdate] = useState({})

  useEffect(() => {
    getSkills()
      .then(res => setSkills(res.data || []))
      .catch(err => message.error('Failed to get skills'))
  }, [update])

  useEffect(() => {
    getAllJobs()
      .then(res => {
        if (res?.data?.length) {
          setSkillInJobs(
            res.data
              .filter(job => job?.reqSkills)
              .map(job => job.reqSkills.map(item => item.skill))
              ?.flat()
          )
        } else {
          setSkillInJobs([])
        }
      })
      .catch(err => message.error('Failed to get jobs'))
      .finally(() => setLoading(false))
  }, [])

  const getNumber = (skillId: string) => {
    return skillInJobs.filter(x => x === skillId).length
  }

  const onChange = e => {
    setFilter(e.target.value)
  }
  const handleSearch = e => {
    setSearch(e.target.value)
  }

  const handleDelete = async id => {
    await deleteSkill(id)
      .then(() => setSkills(skills.filter(skill => skill._id !== id)))
      .catch(err => message.error('Failed to delete skills'))
  }

  const confirmDelete = (name: string, id: string) => ({
    title: `Are you sure you want to delete "${name}"`,
    onOk() {
      handleDelete(id)
    },
  })

  const handleOk = () => {
    updateSkill(
      {
        name: form.getFieldValue('name') || skills.find(skill => skill._id === openEditModal)?.name,
        name_vi: form.getFieldValue('name_vi') || skills.find(skill => skill._id === openEditModal)?.name_vi,
        category: form.getFieldValue('category') || skills.find(skill => skill._id === openEditModal)?.category,
      },
      openEditModal
    )
      .then(() => {
        setSkills(
          skills.map(skill => {
            if (skill._id === openEditModal) {
              skill.name = form.getFieldValue('name') || skills.find(skill => skill._id === openEditModal)?.name
              skill.name_vi =
                form.getFieldValue('name_vi') || skills.find(skill => skill._id === openEditModal)?.name_vi
              skill.category =
                form.getFieldValue('category') || skills.find(skill => skill._id === openEditModal)?.category
            }
            return skill
          })
        )
      })
      .catch(err => message.error('Failed to update skill'))
      .finally(() => handleCancel())
  }

  const handleAdd = async () => {
    await createSkill({
      name: formAdd.getFieldValue('name'),
      name_vi: formAdd.getFieldValue('name_vi'),
      category: formAdd.getFieldValue('category'),
    })
      .then(() => {
        forceUpdate({})
        handleCancel()
      })
      .catch(err => message.error(err?.responseBody?.message || 'Failed to add skill'))
  }

  const handleCancel = () => {
    setOpenEditModal('')
    setOpenAddModal(false)
    form.resetFields()
    formAdd.resetFields()
  }

  const data = !skills?.length
    ? []
    : skills
        .filter(skill => {
          return filter === 'all' || getNumber(skill._id) > 0
        })
        .filter(skill => {
          return !search || skill.name.toLowerCase().includes(search.trim().toLowerCase())
        })
        .map(skill => ({
          key: skill._id,
          id: (
            <div className="author-info">
              <p>{skill._id}</p>
            </div>
          ),
          name: (
            <div className="avatar-info">
              <Title level={5}>{skill.name}</Title>
            </div>
          ),
          name_vi: (
            <div className="avatar-info">
              <Title level={5}>{skill?.name_vi}</Title>
            </div>
          ),
          category: (
            <div className="avatar-info">
              <Title level={5}>{skill?.category}</Title>
            </div>
          ),
          numberOfJobs: (
            <>
              <Button type="primary" className="tag-primary">
                {getNumber(skill._id)}
              </Button>
            </>
          ),
          action: (
            <Space>
              <Button
                icon={<DeleteTwoTone twoToneColor={'#f01f1f'} />}
                type="link"
                // onClick={() => handleDelete(skill._id)}
                onClick={() => {
                  modal.confirm(confirmDelete(skill.name, skill._id))
                }}
              />
              <Button
                icon={<EditTwoTone twoToneColor={'#1f7af0'} />}
                type="link"
                onClick={() => setOpenEditModal(skill._id)}
              />
            </Space>
          ),
        }))
  return (
    <div className="tabled">
      <Modal title="Edit skill" open={!!openEditModal} onOk={handleOk} onCancel={handleCancel} destroyOnClose>
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} style={{ maxWidth: 600 }} form={form}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input defaultValue={skills.find(skill => skill._id === openEditModal)?.name} />
          </Form.Item>
          <Form.Item name="name_vi" label="Vietnamese name" rules={[{ required: true }]}>
            <Input defaultValue={skills.find(skill => skill._id === openEditModal)?.name_vi} />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Input defaultValue={skills.find(skill => skill._id === openEditModal)?.category} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Add new skill" open={openAddModal} onOk={handleAdd} onCancel={handleCancel} destroyOnClose>
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} style={{ maxWidth: 600 }} form={formAdd}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Enver skill name" />
          </Form.Item>
          <Form.Item name="name_vi" label="Vietnamese name" rules={[{ required: true }]}>
            <Input placeholder="Enter skill name in Vietnamese" />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Input placeholder="Enter category" />
          </Form.Item>
        </Form>
      </Modal>

      <Row gutter={[24, 0]}>
        <Col xs="24" xl={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title="Manage skills"
            extra={
              <Space>
                <Input
                  className="header-search"
                  placeholder="Search here"
                  prefix={<SearchOutlined />}
                  value={search}
                  onInput={handleSearch}
                />
                <Radio.Group onChange={onChange} value={filter}>
                  <Radio.Button value="all">All</Radio.Button>
                  <Radio.Button value="used">USED IN JOB</Radio.Button>
                </Radio.Group>
                <Button
                  icon={<PlusCircleTwoTone twoToneColor={'#861cff'} />}
                  type="primary"
                  onClick={() => setOpenAddModal(true)}
                >
                  ADD SKILL
                </Button>
              </Space>
            }
          >
            <div className="table-responsive">
              <Table columns={columns} dataSource={data} pagination={false} className="ant-border-space" loading={loading} />
            </div>
          </Card>
        </Col>
      </Row>
      {contextHolder}
    </div>
  )
}

export default SkillsTable
