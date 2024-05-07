import React, { useEffect, useState } from 'react'
import { Select, Space } from 'antd'
import { useSubscription } from 'src/libs/global-state-hook'
import { locationStore } from 'src/Store/commom.store'

const LocationPicker = ({ handleChange, reset = false, data }: any) => {
  const [locations, setLocations] = useState([])
  const locationData = useSubscription(locationStore).state

  const [selected, setSelected] = useState<any>([])

  useEffect(() => {
    if (data) {
      setSelected(locationData?.filter(l => data?.includes(l.code)).map(l => l.code))
    }
  }, []) 

  useEffect(() => {
    if (reset) {
      setSelected([])
    }
  }, [reset])

  useEffect(() => {
    setLocations(
      locationData.map((loc: any) => {
        return {
          label: loc.name,
          value: loc.code,
        }
      })
    )
  }, [locationData])

  return (
    <Space style={{ width: '100%' }} direction="vertical">
      <Select
        mode="multiple"
        value={selected}
        allowClear
        maxLength={7}
        style={{ width: '100%' }}
        placeholder="Please select"
        defaultValue={[]}
        onChange={e => {
          handleChange(e)
          setSelected(e)
        }}
        options={locations}
      />
    </Space>
  )
}
export default LocationPicker
