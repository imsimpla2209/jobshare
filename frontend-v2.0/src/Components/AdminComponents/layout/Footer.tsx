import { Layout, Row, Col } from 'antd'
import { HeartFilled } from '@ant-design/icons'

function Footer() {
  const { Footer: AntFooter } = Layout

  return (
    <AntFooter style={{ background: '#fafafa' }}>
      <Row className="just">
        <Col xs={24} md={12} lg={12}></Col>
        <Col xs={24} md={12} lg={12}>
          <div className="footer-menu">
            <ul>
              <li className="nav-item">
                <a href="#" className="nav-link text-muted" target="_blank">
                  JobShare
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link text-muted" target="_blank">
                  About Us
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link pe-0 text-muted" target="_blank">
                  License
                </a>
              </li>
            </ul>
          </div>
        </Col>
      </Row>
    </AntFooter>
  )
}

export default Footer
