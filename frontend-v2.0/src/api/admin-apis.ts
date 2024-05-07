import { Http, instance } from './http'

export const getBackupData = () => {
  return instance.get('admin/all-backup')
}

export const startBackupData = () => {
  return instance.get('admin/backup')
}

export const dropBackupData = data => {
  return instance.post('admin/drop', data)
}

export const getUserSignUpStats = (data: {
  startDate: Date
  endDate: Date
  timelineOption: 'weekly' | 'daily' | 'monthly'
}) => {
  return instance.post('admin/userStats', data)
}

export const getAllUsers = () => {
  return instance.get('admin/getUsers')
}

export const getSummarizeStats = () => {
  return instance.get('admin/summarizeStats')
}

export const getProjectStats = (data: {
  startDate: Date
  endDate: Date
  timelineOption: 'weekly' | 'daily' | 'monthly'
}) => {
  return instance.post('admin/jobStats', data)
}

export const getYearPaymentStats = () => {
  return instance.get('admin/yearPaymentStats')
}

export const changeActiveUser = (id: string) => {
  return instance.patch('admin/changeActiveUser' + `/${id}`)
}

export const getAppInfo = () => {
  return instance.get('admin/app-info')
}

export const updateAppInfo = data => {
  return instance.patch('admin/app-info', data)
}

export const verifyJob = (id: string) => {
  return instance.patch(`admin//verify-job/${id}`)
}
