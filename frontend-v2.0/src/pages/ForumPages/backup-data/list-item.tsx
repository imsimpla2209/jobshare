import { DeleteOutlined } from '@ant-design/icons'
import { Button, Modal, message } from 'antd'
import { Http } from 'api/http'
import { format } from 'date-fns'
import { useState } from 'react'
import { dropBackupData } from 'src/api/admin-apis'
import styled from 'styled-components'

const SPLIT_BACKUP_VERSION = 'jobsicker-version-'

const ConfirmModal = ({ open, onClose, handleRestore }) => (
  <Modal
    open={open}
    title="Restore version history"
    cancelText={'Cancel'}
    cancelButtonProps={{ danger: true }}
    okText={'Restore'}
    onCancel={onClose}
    onOk={handleRestore}
  >
    <p>Are you sure to restore this version history?</p>
  </Modal>
)

export default function ListDBItem({
  db,
  setListDB,
  setLoadingRestore,
  loadingRestore,
  restoringVersion,
  setRestoringVersion,
}) {
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const formatTime = (time: string) => {
    if (!time) return ''
    return format(new Date(Number(time)), 'H:mm, MMM d, yyyy')
  }
  const handleDeleteDBVersionHistory = async () => {
    setLoading(true)
    await dropBackupData({ name: db.name })
      .then(res => {
        message.success(`Version history at ${formatTime(db.name.split(SPLIT_BACKUP_VERSION)?.[1])} deleted!`)
        setListDB(database => database.filter(item => item.name !== db.name))
      })
      .catch(error => {
        message.error('Failed to delete backup data!')
      })
      .finally(() => setLoading(false))
  }

  const handleRestoreVersionHistory = async () => {
    setRestoringVersion(db.name)
    setLoadingRestore(true)
    setOpenConfirmModal(false)
    await Http.post('/api/v1/backup/restore', { name: db.name })
      .then(res => {
        message.success(
          `Restore version history at ${formatTime(db.name.split(SPLIT_BACKUP_VERSION)?.[1])} successfully!`
        )
      })
      .catch(error => {
        message.error('Failed to restore data!')
      })
      .finally(() => {
        setLoadingRestore(false)
      })
  }

  return (
    <>
      <ListItem onClick={() => !loading && setOpenConfirmModal(true)}>
        <div style={{ justifyContent: 'space-between', alignItems: 'center' }} className="d-flex">
          <p> Version at {formatTime(db.name.split(SPLIT_BACKUP_VERSION)?.[1])}</p>
          <Button
            loading={loading || (loadingRestore && restoringVersion === db.name)}
            type="text"
            danger={!(loadingRestore && restoringVersion === db.name)}
            icon={<DeleteOutlined />}
            onClickCapture={e => {
              e.stopPropagation()
              handleDeleteDBVersionHistory()
            }}
          />
        </div>
      </ListItem>
      <ConfirmModal
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        handleRestore={handleRestoreVersionHistory}
      />
    </>
  )
}

const ListItem = styled.div`
  &:hover {
    background: #cecece77;
  }
  padding: 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
`
