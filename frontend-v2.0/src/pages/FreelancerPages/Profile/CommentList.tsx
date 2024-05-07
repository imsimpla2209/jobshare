import { SlidersFilled } from '@ant-design/icons'
import { Button, Dropdown, List, MenuProps, Space, Typography } from 'antd'
import { useState } from 'react'
import Comment from './Comment'
import { useSocket } from 'src/socket.io'
interface DataType {
  gender?: string
  name: {
    title?: string
    first?: string
    last?: string
  }
  email?: string
  picture: {
    large?: string
    medium?: string
    thumbnail?: string
  }
  nat?: string
  loading: boolean
}

function CommentsList({ reviews }: any) {
  const [list, setList] = useState<any[]>(reviews || [])
  const [filter, setFilter] = useState('new')

  
  const onClickFilter = (val: any) => {
    setFilter(val)
  }

  const moreItems: MenuProps['items'] = [
    {
      key: 'new',
      label: (
        <Typography.Text style={{ fontSize: 15, margin: 0 }} onClick={() => onClickFilter('new')}>
          Newest
        </Typography.Text>
      ),
    },
    {
      key: 'oldest',
      label: (
        <Typography.Text style={{ fontSize: 15, margin: 0 }} onClick={() => onClickFilter('oldest')}>
          Oldest
        </Typography.Text>
      ),
    },
  ]

  return (
    <>
      <Space
        style={{
          width: '100%',
          borderBottom: '0.5px #ccc solid',
          padding: '10px',
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <Dropdown menu={{ items: moreItems }} placement="bottom" arrow trigger={['click']}>
          <Button>
            <SlidersFilled />
          </Button>
        </Dropdown>
      </Space>
      <List
        itemLayout="vertical"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 5,
        }}
        dataSource={list}
        style={{ width: '100%' }}
        renderItem={item => (
          <Comment  item={item} loading={item.loading} />
        )}
      />
    </>
  )
}

export default CommentsList
