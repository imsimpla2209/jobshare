import { DeleteTwoTone, EditTwoTone, PlusCircleTwoTone, SearchOutlined } from '@ant-design/icons'
import { Button, Card, Col, Form, Input, Modal, Radio, Row, Space, Table, Typography, message } from 'antd'
import { useEffect, useState } from 'react'
import { createCategory, deleteCategory, getAllCategories, updateCategory } from 'src/api/category-apis'
import { getAllJobs } from 'src/api/job-apis'

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
    title: 'NUMBER JOBS USING CATEGORY',
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

function CategoriesTable() {
  const [categories, setCategories] = useState([])
  const [categoryInJobs, setCategoryInJobs] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [openEditModal, setOpenEditModal] = useState('')
  const [openAddModal, setOpenAddModal] = useState(false)
  const [form] = Form.useForm()
  const [formAdd] = Form.useForm()
  const [modal, contextHolder] = Modal.useModal()
  const [update, forceUpdate] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getAllCategories()
      .then(res => setCategories(res.data || []))
      .catch(err => message.error('Failed to get categories'))

  }, [update])

  useEffect(() => {
    getAllJobs()
      .then(res => {
        if (res?.data?.length) {
          setCategoryInJobs(
            res.data
              .filter(job => job?.categories)
              .map(job => job.categories.map(item => item._id))
              ?.flat()
          )
        } else {
          setCategoryInJobs([])
        }
      })
      .catch(err => message.error('Failed to get jobs'))
      .finally(() => setLoading(false))
  }, [])

  const getNumber = (categoryId: string) => {
    return categoryInJobs.filter(x => x === categoryId).length
  }

  const onChange = e => {
    setFilter(e.target.value)
  }
  const handleSearch = e => {
    setSearch(e.target.value)
  }

  const handleDelete = async id => {
    await deleteCategory(id)
      .then(() => setCategories(categories.filter(category => category._id !== id)))
      .catch(err => message.error('Failed to delete categories'))
  }

  const confirmDelete = (name: string, id: string) => ({
    title: `Are you sure you want to delete "${name}"`,
    onOk() {
      handleDelete(id)
    },
  })

  const handleOk = () => {
    updateCategory(
      {
        name: form.getFieldValue('name') || categories.find(category => category._id === openEditModal)?.name,
      },
      openEditModal
    )
      .then(() => {
        setCategories(
          categories.map(category => {
            if (category._id === openEditModal) {
              category.name =
                form.getFieldValue('name') || categories.find(category => category._id === openEditModal)?.name
              category.name_vi =
                form.getFieldValue('name_vi') || categories.find(category => category._id === openEditModal)?.name_vi
              category.category =
                form.getFieldValue('category') || categories.find(category => category._id === openEditModal)?.category
            }
            return category
          })
        )
      })
      .catch(err => message.error('Failed to update category'))
      .finally(() => handleCancel())
  }

  const handleAdd = async () => {
    await createCategory({
      name: formAdd.getFieldValue('name'),
    })
      .then(() => {
        forceUpdate({})
        handleCancel()
      })
      .catch(err => message.error(err?.responseBody?.message || 'Failed to add category'))
  }

  const handleCancel = () => {
    setOpenEditModal('')
    setOpenAddModal(false)
    form.resetFields()
    formAdd.resetFields()
  }

  const data = !categories?.length
    ? []
    : categories
        .filter(category => {
          return filter === 'all' || getNumber(category._id) > 0
        })
        .filter(category => {
          return !search || category.name.toLowerCase().includes(search.trim().toLowerCase())
        })
        .map(category => ({
          key: category._id,
          id: (
            <div className="author-info">
              <p>{category._id}</p>
            </div>
          ),
          name: (
            <div className="avatar-info">
              <Title level={5}>{category.name}</Title>
            </div>
          ),
          numberOfJobs: (
            <>
              <Button type="primary" className="tag-primary">
                {getNumber(category._id)}
              </Button>
            </>
          ),
          action: (
            <Space>
              <Button
                icon={<DeleteTwoTone twoToneColor={'#f01f1f'} />}
                type="link"
                // onClick={() => handleDelete(category._id)}
                onClick={() => {
                  modal.confirm(confirmDelete(category.name, category._id))
                }}
              />
              <Button
                icon={<EditTwoTone twoToneColor={'#1f7af0'} />}
                type="link"
                onClick={() => setOpenEditModal(category._id)}
              />
            </Space>
          ),
        }))
  return (
    <div className="tabled">
      <Modal title="Edit category" open={!!openEditModal} onOk={handleOk} onCancel={handleCancel} destroyOnClose>
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} style={{ maxWidth: 600 }} form={form}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input defaultValue={categories.find(category => category._id === openEditModal)?.name} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Add new category" open={openAddModal} onOk={handleAdd} onCancel={handleCancel} destroyOnClose>
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} style={{ maxWidth: 600 }} form={formAdd}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Enver category name" />
          </Form.Item>
        </Form>
      </Modal>

      <Row gutter={[24, 0]}>
        <Col xs="24" xl={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title="Manage categories"
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
                  ADD CATEGORY
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

export default CategoriesTable
