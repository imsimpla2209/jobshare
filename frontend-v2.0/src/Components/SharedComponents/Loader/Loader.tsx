import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import React from 'react'

const loadIcon = <LoadingOutlined style={{ fontSize: 70, color: '#12582D' }} spin />

export default function Loader() {
  return (
    <div className="text-center mt-2">
      <Spin indicator={loadIcon} />
    </div>
  )
}
