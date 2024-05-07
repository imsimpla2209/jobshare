import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Select, Slider, Space } from 'antd'
import { SliderMarks } from 'antd/es/slider'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { skillStore } from 'src/Store/commom.store'
import { getSkills } from 'src/api/job-apis'
import { useSubscription } from 'src/libs/global-state-hook'
import { SkillBody } from 'src/types/freelancer'
import { pickName } from 'src/utils/helperFuncs'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
}

const desc = ['Terrible', 'Bad', 'Normal', 'Good', 'Goat']

const marks: SliderMarks = {
  1: desc[0],
  2: desc[1],
  3: desc[2],
  4: desc[3],
  5: desc[4],
}

const SkillPicker = ({ handleChange, data }: any) => {
  const { i18n } = useTranslation(['main'])
  const [rates, setRates] = useState<SkillBody[]>(data || [])
  const { state } = useSubscription(skillStore)
  const skills = Object.values(state).map((skill: any) => {
    return {
      label: pickName(skill, i18n.language),
      value: skill._id,
    }
  })

  useEffect(() => {
    handleChange(rates)
  }, [rates])

  return (
    <Form.Item name="dynamic_form_item" style={{ maxWidth: '100%', width: '100%' }}>
      <Form.List
        initialValue={data}
        name="names"
        rules={[
          {
            validator: async (_, names) => {
              if (!names || names.length < 1) {
                return Promise.reject(new Error('At least 1 skill'))
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                {...formItemLayout}
                required={false}
                key={field.key}
                style={{
                  marginBottom: 12,
                }}
              >
                <Form.Item
                  {...field}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: 'Please input skill or delete this field.',
                    },
                  ]}
                  name={[field.name, 'skill']}
                  noStyle
                >
                  <Select
                    showSearch
                    style={{ width: 200, marginRight: 20 }}
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    onChange={v => {
                      const rate = rates
                      rates[index].skill = v
                      setRates(rate)
                    }}
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={skills}
                  />
                </Form.Item>
                <Slider
                  marks={marks}
                  step={5}
                  min={1}
                  max={5}
                  defaultValue={rates[index]?.level || 2}
                  onChange={s => {
                    const rate = rates
                    rates[index].level = s
                    setRates(rate)
                  }}
                  style={{ marginRight: 20 }}
                />
                {fields.length > 1 ? (
                  <MinusCircleOutlined
                    style={{ fontSize: 20, color: 'gray' }}
                    className="dynamic-delete-button"
                    onClick={() => {
                      const rate = rates
                      rate.splice(index, 1)
                      setRates(rate)
                      remove(field.name)
                    }}
                  />
                ) : null}
              </Form.Item>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => {
                  add()
                  setRates([...rates, { skill: '', level: 0 }])
                }}
                style={{ width: '60%' }}
                icon={<PlusOutlined />}
              >
                Add Skill
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form.Item>
  )
}

export const MultiSkillPicker = ({ handleChange, reset = false, istakeValue = false }: any) => {
  const [skills, setSkills] = useState<any[]>([])
  const [selected, setSelected] = useState<any[]>([])

  useEffect(() => {
    if (reset) {
      setSelected([])
    }
  }, [reset])

  const { i18n } = useTranslation(['main'])

  useEffect(() => {
    console.log(i18n.language)
    getSkills().then(res => {
      setSkills(
        res.data.map((skill: any) => {
          return {
            label: skill,
            value: skill._id,
          }
        })
      )
    })
  }, [])

  return (
    <Space style={{ width: '100%' }} direction="vertical">
      <Select
        labelInValue={istakeValue}
        mode="multiple"
        allowClear
        value={selected}
        style={{ width: '100%' }}
        placeholder="Please select"
        defaultValue={[]}
        onChange={e => {
          setSelected(e)
          handleChange(e)
        }}
        options={skills
          .map(item => ({ label: pickName(item.label, i18n.language), value: item.value }))
          .sort((a, b) => a.label.localeCompare(b.label))}
      />
    </Space>
  )
}

export default SkillPicker
