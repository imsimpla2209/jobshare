import { EStatus } from 'src/utils/enum'
import { currencyFormatter } from 'src/utils/helperFuncs'

const eChart = {
  series: [
    {
      key: EStatus.PENDING,
      name: 'Pending jobs',
      data: [],
      color: '#edc810',
    },
    {
      key: EStatus.INPROGRESS,
      name: 'Open jobs',
      data: [],
      color: '#1da0cc',
    },
    {
      key: EStatus.COMPLETED,
      name: 'Completed jobs',
      data: [],
      color: '#17db5f',
    },
  ],

  options: {
    chart: {
      type: 'bar',
      width: '100%',
      height: 'auto',

      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['transparent'],
    },
    grid: {
      show: true,
      borderColor: '#ccc',
      strokeDashArray: 2,
    },
    xaxis: {
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      labels: {
        show: true,
        align: 'right',
        minWidth: 0,
        maxWidth: 160,
        style: {
          colors: ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#510bdd'],
        },
      },
    },
    yaxis: {
      labels: {
        show: true,
        align: 'right',
        minWidth: 0,
        maxWidth: 160,
        style: {
          colors: ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#510bdd'],
        },
      },
    },

    tooltip: {
      y: {
        formatter: function (val) {
          return val + ' job(s)'
        },
      },
    },
  },
}

export const eRevenueChart = {
  series: [
    {
      name: 'Revenue',
      data: [],
      color: '#fff',
    },
  ],

  options: {
    chart: {
      type: 'bar',
      width: '100%',
      height: 'auto',

      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['transparent'],
    },
    grid: {
      show: true,
      borderColor: '#ccc',
      strokeDashArray: 2,
    },
    xaxis: {
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      labels: {
        show: true,
        align: 'right',
        minWidth: 0,
        maxWidth: 160,
        style: {
          colors: ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#510bdd'],
        },
      },
    },
    yaxis: {
      labels: {
        show: true,
        align: 'right',
        minWidth: 0,
        maxWidth: 160,
        style: {
          colors: ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#510bdd'],
        },
      },
    },

    tooltip: {
      y: {
        formatter: function (val) {
          return currencyFormatter(`${val}`)
        },
      },
    },
  },
}
export default eChart
