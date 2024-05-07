import { Typography } from 'antd'
import { ApexOptions } from 'apexcharts'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { getYearPaymentStats } from 'src/api/admin-apis'
import { eRevenueChart } from './configs/eChart'

function RevenueChart() {
  const { Title, Paragraph } = Typography
  const [data, setData] = useState([])

  useEffect(() => {
    getYearPaymentStats().then(res => setData(res.data))
  }, [])

  const currentMonth = data?.[11]?.totalAmount || 0
  const lastMonth = data?.[10]?.totalAmount || 0
  // Calculate percent change
  const percentChange = ((currentMonth - lastMonth) / Math.abs(lastMonth)) * 100

  return (
    <>
      <div id="chart">
        <ReactApexChart
          className="bar-chart"
          options={{
            ...(eRevenueChart.options as ApexOptions),
            xaxis: { ...eRevenueChart.options.xaxis, categories: data.map(d => format(new Date(d._id), 'LLL')) },
          }}
          series={eRevenueChart.series.map(s => ({
            ...s,
            data: data.map(d => {
              return d.totalAmount
            }),
          }))}
          type="bar"
          height={220}
        />
      </div>
      <div className="chart-vistior">
        <Title level={5}>Revenue</Title>
        <Paragraph className="lastweek">
          than last month{' '}
          <span className="bnb2">
            {currentMonth > lastMonth ? '+' : '-'}
            {percentChange}%
          </span>
        </Paragraph>
        {/* <Paragraph className="lastweek"></Paragraph>
        <Row>
          {items.map((v, index) => (
            <Col xs={6} xl={6} sm={6} md={6} key={index}>
              <div className="chart-visitor-count">
                <Title level={4}>{v.Title}</Title>
                <span>{v.user}</span>
              </div>
            </Col>
          ))}
        </Row> */}
      </div>
    </>
  )
}

export default RevenueChart
