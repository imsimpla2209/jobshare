import { Typography } from 'antd'
import { ApexOptions } from 'apexcharts'
import { addMonths, format, sub } from 'date-fns'
import { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { getUserSignUpStats } from 'src/api/admin-apis'
import lineChart from './configs/lineChart'
import { MinusOutlined } from '@ant-design/icons'

function LineChart() {
  const { Title, Paragraph } = Typography
  const now = new Date()
  const startDate = new Date(addMonths(sub(now, { years: 1 }).setDate(1), 1))
  const endDate = new Date()
  const [data, setData] = useState([])

  useEffect(() => {
    getUserSignUpStats({
      startDate,
      endDate,
      timelineOption: 'monthly',
    }).then(res => setData(res.data))
  }, [])

  console.log(data)

  const currentMonth = (data?.[11]?.freelancer || 0) + (data?.[11]?.client || 0)
  const lastMonth = (data?.[10]?.freelancer || 0) + (data?.[10]?.client || 0)
  // Calculate percent change
  const percentChange = ((currentMonth - lastMonth) / Math.abs(lastMonth)) * 100

  return (
    <>
      <div className="linechart">
        <div>
          <Title level={5}>Active users</Title>
          <Paragraph className="lastweek">
            than last week{' '}
            <span className="bnb2">
              {currentMonth > lastMonth ? '+' : '-'}
              {percentChange}%
            </span>
          </Paragraph>
        </div>
        <div className="sales">
          <ul>
            <li>{<MinusOutlined />} Client</li>
            <li>{<MinusOutlined />} Freelancer</li>
          </ul>
        </div>
      </div>

      <ReactApexChart
        className="full-width"
        options={{
          ...(lineChart.options as ApexOptions),
          xaxis: { ...lineChart.options.xaxis, categories: data.map(d => format(new Date(d.date), 'LLL')) },
        }}
        series={
          [
            {
              name: 'Clients',
              data: data?.map(d => d.client),
              offsetY: 0,
              color: '#b37feb',
            },
            {
              name: 'Freelancers',
              data: data?.map(d => d.freelancer),
              offsetY: 0,
              color: '#1890ff',
            },
          ] as any
        }
        type="area"
        height={350}
        width={'100%'}
      />
    </>
  )
}

export default LineChart
