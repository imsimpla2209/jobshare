import { Select, Space } from 'antd'
import { useEffect, useState } from 'react'
import { categoryStore } from 'src/Store/commom.store'
import { useSubscription } from 'src/libs/global-state-hook'

const CategoriesPicker = ({ handleChange, data, istakeValue = false, reset = false }: any) => {
  const { state: allCategories } = useSubscription(categoryStore)
  const categories = Object.values(allCategories || {}).map((cat: any) => {
    return {
      label: cat.name,
      value: cat._id,
    }
  })

  const [selected, setSelected] = useState(data || [])

  useEffect(() => {
    if (reset) {
      setSelected([])
    }
  }, [reset])

  return (
    <Space style={{ width: '100%' }} direction="vertical">
      <Select
        labelInValue={istakeValue}
        value={selected}
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        placeholder="Please select"
        defaultValue={[]}
        onChange={e => {
          setSelected(e.map(({ value }) => value))
          handleChange(e)
        }}
        options={categories}
      />
    </Space>
  )
}
export default CategoriesPicker
