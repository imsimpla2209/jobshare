import { BlueColorButton } from 'Components/CommonComponents/custom-style-elements/button'
import RubikLoader from 'Components/CommonComponents/loader/rubik-loader'
import { Card, List, Progress, Result, Space, Typography, message } from 'antd'
import { useEffect, useState } from 'react'
import { getBackupData, startBackupData } from 'src/api/admin-apis'
import { useSocket } from 'src/socket.io'
import ListDBItem from './list-item'
import { ESocketEvent } from 'src/utils/enum'

const { Text, Title } = Typography

let countSuccess = 0

export default function BackupDataManager() {
  const { appSocket } = useSocket()
  const [loading, setLoading] = useState(false)
  const [loadingListDB, setLoadingListDB] = useState(false)
  const [failToBackUp, setFailToBackUp] = useState(false)
  const [percents, setPercents] = useState(0)
  const [listDB, setListDB] = useState([])
  const [loadingRestore, setLoadingRestore] = useState(false)
  const [restoringVersion, setRestoringVersion] = useState('')

  const handlBbackupData = async () => {
    setFailToBackUp(false)
    setLoading(true)
    setPercents(0)
    await startBackupData()
      .catch(error => {
        message.error('Failed to backup data!')
        setLoading(false)
        setFailToBackUp(true)
      })
      .finally(() => countSuccess++)
  }

  const backupProcessing = data => {
    setPercents(Math.ceil((Number(data.progress) / Number(data.total)) * 100))
  }

  const getAllBackups = async () => {
    setLoadingListDB(true)
    await getBackupData()
      .then(res => setListDB(res.data.data))
      .catch(error => {
        message.error('Failed to get backup data!')
      })
      .finally(() => setLoadingListDB(false))
  }

  useEffect(() => {
    if (!loading) {
      getAllBackups()
    }
  }, [loading])

  useEffect(() => {
    appSocket.on(ESocketEvent.BACKUP_DATA, backupProcessing)
    return () => {
      appSocket.off(ESocketEvent.BACKUP_DATA, backupProcessing)
    }
  }, [backupProcessing])

  useEffect(() => {
    if (percents === 100) {
      setTimeout(() => {
        setLoading(false)
      }, 300)
    }
  }, [percents])

  return (
    <Space direction="vertical" style={{ padding: 20 }} className="w-100">
      <Space direction="horizontal" align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
        <Title style={{ margin: 0 }}>Backup data feature!</Title>
        {!loadingRestore && (
          <BlueColorButton loading={loading} onClick={handlBbackupData} disabled={loading}>
            Start backup data
          </BlueColorButton>
        )}
      </Space>
      {loadingRestore && (
        <>
          <RubikLoader />
          <Text>Restoring version history...</Text>
        </>
      )}

      {loading && (
        <>
          <RubikLoader />
          <Text>In progress...</Text>
          <Progress percent={percents} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
        </>
      )}
      {!loadingRestore && !loading && !failToBackUp && countSuccess > 0 && (
        <Space direction="vertical" style={{ paddingTop: 50, width: '100%', justifyContent: 'center' }} align="center">
          <Progress type="circle" percent={100} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
          <Title>Backup data successfull!</Title>
        </Space>
      )}
      {!loadingRestore && !loading && failToBackUp && countSuccess > 0 && (
        <Result status="error" title="Backup data failed" subTitle="Please trying to backup data again!" />
      )}
      <Card
        title="Version history"
        bordered={false}
        className="w-100"
        style={{ marginTop: 16 }}
        loading={loadingListDB}
      >
        <List
          dataSource={listDB}
          renderItem={(db, index) => (
            <ListDBItem
              db={db}
              key={index}
              setListDB={setListDB}
              setLoadingRestore={setLoadingRestore}
              loadingRestore={loadingRestore}
              restoringVersion={restoringVersion}
              setRestoringVersion={setRestoringVersion}
            />
          )}
        />
      </Card>
    </Space>
  )
}
