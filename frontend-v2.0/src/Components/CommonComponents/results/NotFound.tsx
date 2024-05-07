import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate()
  return (
    <>
      <Result
      style={{
        color: "white",
        fontSize: 18
      }}
      status="404"
      title="404"
      subTitle={<div style={{
        color: "white",
        fontSize: 18
      }}>Sorry, the content you wanna see does not exist.</div>}
      extra={<Button type="primary" onClick={() => navigate('/')}>Back Home</Button>}
    />
    </>
  )
}

export default NotFound;