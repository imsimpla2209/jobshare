import { Typography } from 'antd'
import { ApexOptions } from 'apexcharts'
import { addMonths, format, sub } from 'date-fns'
import { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { getProjectStats } from 'src/api/admin-apis'
import eChart from './configs/eChart'
import { EStatus } from 'src/utils/enum'

function PostJobsChart() {
  const { Title, Paragraph } = Typography
  const now = new Date()
  const startDate = new Date(addMonths(sub(now, { years: 1 }).setDate(1), 1))
  const endDate = new Date()
  const [data, setData] = useState([])

  useEffect(() => {
    getProjectStats({
      startDate,
      endDate,
      timelineOption: 'monthly',
    }).then(res => setData(res.data))
  }, [])
  return (
    <>
      <div id="chart">
        <Title level={5}>Post jobs chart</Title>

        <ReactApexChart
          className="jobs-chart"
          options={{
            ...(eChart.options as ApexOptions),
            xaxis: { ...eChart.options.xaxis, categories: data.map(d => format(new Date(d.date), 'LLL')) },
          }}
          series={eChart.series.map(s => ({
            ...s,
            data: data.map(d => {
              if (s.key === EStatus.PENDING) {
                return d.count.pendingJobs
              } else if (s.key === EStatus.INPROGRESS) {
                return d.count.wipJobs
              }
              return d.count.doneJobs
            }),
          }))}
          type="bar"
          height={220}
        />
      </div>
    </>
  )
}

export default PostJobsChart
