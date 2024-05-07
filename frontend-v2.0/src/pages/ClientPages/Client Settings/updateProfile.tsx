import { PlusOutlined } from '@ant-design/icons'
import { handleValidateFile, onChangeUpload, previewFile } from 'Components/CommonComponents/upload/upload'
import { Button, Form, Input, Modal, Row, Space, Typography, Upload, message } from 'antd'
import { Http } from 'api/http'
import { useSubscription } from 'libs/global-state-hook'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { userStore } from 'src/Store/user.store'
import { updateUser } from 'src/api/user-apis'
import { fetchAllToCL } from 'src/utils/helperFuncs'

const { Title } = Typography

function EditProfileForm() {
  const { t } = useTranslation(['main'])
  const { state, setState } = useSubscription(userStore)
  const [form] = Form.useForm()
  const [files, setFiles] = useState(null)
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)

  userStore.subscribe(newState => {
    form.setFieldsValue({
      name: newState?.name,
      address: newState?.address,
      phone: newState.phone,
      email: !newState.email || newState.email === 'None' ? '' : newState.email,
    })
  })

  const onReset = () => {
    form.resetFields()
  }

  const handleUpdateProfile = async () => {
    setLoading(true)
    const userform = {
      name: form.getFieldValue('name'),
      address: form.getFieldValue('address'),
      phone: form.getFieldValue('phone'),
      email: form.getFieldValue('email'),
      avatar: '',
    }
    if (!form.getFieldValue('name') || !form.getFieldValue('email')) {
      return message.error('Please input the required fields')
    }
    if (form.getFieldValue('address').length <= 3 || form.getFieldValue('name').length <= 10) {
      return message.error('Please input the valid fields')
    }

    if (files?.length) {
      try {
        const fileNameList = await fetchAllToCL(files, false)
        userform['avatar'] = fileNameList[0]
      } catch (error) {
        console.error(error)
      }
    }

    await updateUser(userform, state.id)
      .then(() => {
        message.success('Updated profile successfully!')
        setState({
          name: form.getFieldValue('name'),
          address: form.getFieldValue('address'),
          phone: form.getFieldValue('phone'),
          email: form.getFieldValue('email'),
          avatar: userform?.avatar ? userform?.avatar : state.avatar,
        })
      })
      .catch(() => message.error('Failed to update profile!'))
      .finally(() => setLoading(false))
  }

  return (
    <>
      <Button onClick={() => setOpenModal(true)}>{t('Edit profile')}</Button>
      <Modal
        open={openModal}
        onCancel={() => {
          setOpenModal(false)
          onReset()
        }}
        onOk={handleUpdateProfile}
        okButtonProps={{ loading, disabled: loading }}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          layout="horizontal"
          style={{ width: '100%' }}
          form={form}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Title level={3} style={{ margin: '0px 10px 16px' }}>
              General
            </Title>
          </Row>

          <Form.Item
            name="name"
            label="Full name"
            labelAlign="left"
            initialValue={state.name}
            rules={[
              { required: true, message: 'Please input your fullname' },
              { type: 'string', min: 10, message: 'Invalid fullname (At least 10 characters)' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            labelAlign="left"
            initialValue={state.address}
            rules={[{ type: 'string', min: 3, message: 'Invalid address (At least 3 characters)' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone number"
            labelAlign="left"
            initialValue={state.phone}
            rules={[
              {
                pattern: new RegExp(/^[0-9]{10}$/),
                message: 'The input is not valid phone number!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            labelAlign="left"
            initialValue={!state.email || state.email === 'None' ? '' : state.email}
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              { required: true, message: 'Please input your email' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="image"
            label="Upload image"
            valuePropName="fileList"
            labelAlign="left"
            getValueFromEvent={e => {
              const validFiles = handleValidateFile(e)
              setFiles(validFiles)
            }}
          >
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              onPreview={previewFile}
              accept="image/*"
              beforeUpload={file => onChangeUpload(file)}
              maxCount={1}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default EditProfileForm
