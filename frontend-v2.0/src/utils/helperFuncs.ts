import { RcFile } from 'antd/es/upload'
import { format, formatDistanceToNowStrict } from 'date-fns'
import { Http } from 'src/api/http'

export const filterDuplicates = (originalArr: any[], arrToConcat: any[]) => {
  return arrToConcat.filter((a: { id: any }) => !originalArr.find((o: { id: any }) => o.id === a.id))
}

export const formatDateAgo = (date: string | number | Date) => {
  return formatDistanceToNowStrict(new Date(date))
}

export const formatDayTime = (date: string | number | Date) => {
  try {
    return format(new Date(date), "MMM d', ' yy 'at' H':'mm")
  } catch (error) {
    return null
  }
}

export const formatDay = (date: any) => {
  try {
    return format(new Date(date), "MMM d', 'yyyy'")
  } catch (error) {
    return 'None'
  }
}

export const getErrorMsg = (err: { graphQLErrors: { message: any }[]; message: any }) => {
  if (err.graphQLErrors[0]?.message) {
    return err.graphQLErrors[0].message
  } else {
    return err?.message
  }
}

export function pickName(o: { name: string | null; name_vi: string | null } | null, lang: string) {
  if (lang?.includes('en')) {
    return o?.name || ''
  } else {
    return o?.name_vi || ''
  }
}

export function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

export function currencyFormatter(money: any, currency: string = 'VND') {
  const currenor = new Intl.NumberFormat('it-IT', { style: 'currency', currency: currency })
  const validMoney = currency === 'VND' && money < 5000 ? money * 1000 : money
  return `${currenor.format(validMoney)}`
}

export const fetchPresignedUrl = async (url: any, file: any) => {
  try {
    const uploadConfig = (await Http.get(url))?.data
    // const sigedUrl = `https://api.cloudinary.com/v1_1/${uploadConfig?.cloudName}/image/upload?api_key=${uploadConfig?.apiKey}&timestamp=${uploadConfig?.timestamp}&signature=${uploadConfig?.signature}`
    const sigedUrl = `https://api.cloudinary.com/v1_1/${uploadConfig?.cloudName}/upload`
    const formData = new FormData()
    formData.append('file', file)
    formData.append('signature', uploadConfig?.signature)
    formData.append('timestamp', uploadConfig?.timestamp)
    formData.append('api_key', uploadConfig?.apiKey)
    const fileTranform = await fetch(sigedUrl, {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(result => {
        console.log(result)
        return result
      })
      .catch(error => {
        console.error('Error:', error)
      })

    return fileTranform?.secure_url
  } catch (error) {
    console.error(error)
    return null
  }
}

// const widget = window.cloudinary.createUploadWidget(
//   {
//     cloudName: uploadConfig?.cloudName,
//     // uploadSignature: uploadConfig?.signature,
//     // apiKey: uploadConfig?.apiKey,
//     uploaadPreset: "unsigned-preset",
//     resourceType: type,
//   },
//   (error, result) => {
//     if (!error && result && result.event === "success") {
//       console.log("Done! Here is the image info: ", result.info);
//     } else if (error) {
//       console.log(error);
//     }
//   }
// );
// widget.open();

export const fetchAllToCL = async (files: any, useOriginFile = true) => {
  const url = 'data/preSignCLUrl'
  const requests = files.map(async (file: any) => {
    if (typeof file === 'string') return file
    let fileBase64 = null
    if (!useOriginFile) {
      fileBase64 = await getBase64(file.originFileObj as RcFile).catch(err => console.error(err))
    }

    return await fetchPresignedUrl(url, useOriginFile ? file : fileBase64).then(result => result)
  })

  return Promise.all(requests)
}

export function timeAgo(datetime, t) {
  // Chuyển đổi thời gian datetime thành đối tượng Date
  const date = new Date(datetime).getTime()

  // Lấy thời gian hiện tại
  const now = new Date().getTime()

  // Tính khoảng cách thời gian
  const timeDiff = now - date

  // Chuyển khoảng cách thời gian thành giây
  const seconds = Math.floor(timeDiff / 1000)

  if (seconds < 60) {
    return seconds + t(seconds === 1 ? ' second ago' : ' seconds ago')
  }

  const minutes = Math.floor(seconds / 60)

  if (minutes < 60) {
    return minutes + t(minutes === 1 ? ' minute ago' : ' minutes ago')
  }

  const hours = Math.floor(minutes / 60)

  if (hours < 24) {
    return hours + t(hours === 1 ? ' hour ago' : ' hours ago')
  }

  const days = Math.floor(hours / 24)

  if (days < 30) {
    return days + t(days === 1 ? ' day ago' : ' days ago')
  }

  const months = Math.floor(days / 30)

  if (months < 12) {
    return months + t(months === 1 ? ' month ago' : ' months ago')
  }

  const years = Math.floor(months / 12)

  return years + t(years === 1 ? ' year ago' : ' years ago')
}

export const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })

export const getStatusColor = status => {
  switch (status) {
    case 'pending':
      return 'grey'
    case 'open':
      return '#52c41a'
    case 'inProgress':
      return 'blue'
    case 'completed':
      return 'darkgreen'
    case 'rejected':
      return '#c94043'
    case 'accepted':
      return '#09de57'
    case 'closed':
      return 'darkseagreen'
    case 'cancelled':
      return 'brown'
    case 'late':
      return '#751b13'
    case 'paid':
      return 'green'
    case 'archive':
      return '#8f6e27'
    default:
      return 'black'
  }
}
