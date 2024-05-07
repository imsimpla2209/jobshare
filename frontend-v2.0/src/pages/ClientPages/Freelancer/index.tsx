import { FrownOutlined, SmileOutlined } from '@ant-design/icons'
import { Card, ConfigProvider, Input, Radio, Row, Slider } from 'antd'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CategoriesPicker from 'src/Components/SharedComponents/CategoriesPicker'
import LocationPicker from 'src/Components/SharedComponents/LocationPicker'
import { MultiSkillPicker } from 'src/Components/SharedComponents/SkillPicker'
import { filterFreelancersBody } from 'src/types/freelancer'
import './Freelancer.css'
import FreelancerListCards from './freelancer-list'

export default function FreelancerList({ saved = false }) {
  const { t } = useTranslation(['main'])
  const [filterOption, setfilterOption] = useState<filterFreelancersBody>({})
  const [refresh, onRefresh] = useState<boolean>(false)
  const [value, setValue] = useState({ from: 0, to: 5 })
  const mid = Number((5 / 2).toFixed(5))
  const preColorCls = value.from >= mid ? '' : 'icon-wrapper-active'
  const nextColorCls = value.to >= mid ? 'icon-wrapper-active' : ''
  const [searchKey, setSearchKey] = useState('')

  const onSkillsChange = (c: any) => {
    const skills = c?.map((cc, ix) => cc.value)
    setfilterOption({ ...filterOption, skills })
  }

  const onLocationChange = (l: any) => {
    setfilterOption({ ...filterOption, currentLocations: l })
  }

  const onPayTypeChange = (l: any) => {
    setfilterOption({ ...filterOption, preferJobType: l })
  }

  const handleEarnedAmountFrom = (from: any = -1) => {
    setfilterOption({ ...filterOption, earned: { from, to: filterOption?.earned?.to } })
  }

  const handleEarnedAmountTo = (to: any = -1) => {
    setfilterOption({ ...filterOption, earned: { to, from: filterOption?.earned?.from } })
  }

  const onAvailabilityChange = (c: any) => {
    const v = c?.target?.value
    v === undefined && delete filterOption.available

    setfilterOption({ ...filterOption, available: v })
  }

  const handleFilterRating = val => {
    setValue({ from: val[0], to: val[1] })
    setfilterOption({ ...filterOption, rating: { from: val[0], to: val[1] } })
  }
  const removeFilterOptions = useCallback(() => {
    setfilterOption({})
    onRefresh(true)
    setTimeout(() => onRefresh(false), 2000)
  }, [filterOption])

  return (
    <Row style={{ display: 'grid', gridTemplateColumns: '300px 1fr' }}>
      <div style={{ padding: 16 }}>
        <div style={{ display: 'grid', gap: 16 }}>
          <Card>
            <h6 className=" display-inline-block  fw-bold">{t('Skills')}</h6>
            <MultiSkillPicker reset={refresh} handleChange={onSkillsChange} istakeValue={true}></MultiSkillPicker>
          </Card>

          <Card>
            <h6 className="display-inline-block fw-bold">{t('Freelancer Location')}</h6>
            <div className="input-group rounded-3">
              <LocationPicker reset={refresh} handleChange={onLocationChange}></LocationPicker>
            </div>
          </Card>

          <Card>
            <h6 className=" display-inline-block fw-bold">{t('Prefer job type')}</h6>
            <CategoriesPicker handleChange={onPayTypeChange} />
          </Card>

          <Card>
            <h6 className=" display-inline-block fw-bold">{t('Rating')}</h6>
            <div style={{ display: 'flex', gap: 8 }}>
              <FrownOutlined className={preColorCls} />
              <Slider
                style={{ flex: 1 }}
                max={5}
                min={0}
                range={true}
                defaultValue={[0, 5]}
                onChange={handleFilterRating}
                value={[value.from, value.to]}
              />
              <SmileOutlined className={nextColorCls} />
            </div>
          </Card>

          <Card>
            <h6 className="display-inline-block fw-bold">Availability</h6>
            <Radio.Group onChange={onAvailabilityChange} value={filterOption?.available}>
              <Radio style={{ display: 'block' }} value={undefined}>
                {t('All')}
              </Radio>
              <Radio style={{ display: 'block' }} value={true}>
                {t('Available')}
              </Radio>
              <Radio style={{ display: 'block' }} value={false}>
                {t('Unavailable')}
              </Radio>
            </Radio.Group>
          </Card>
        </div>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ marginBottom: 20 }}>
          <ConfigProvider
            theme={{
              components: {
                Select: {
                  optionFontSize: 16,
                  optionSelectedBg: '#a2eaf2',
                  optionLineHeight: 0.7,
                },
              },
            }}
          >
            <Input
              onInput={e => setSearchKey((e.target as any).value)}
              size="large"
              placeholder={t('Search freelancers by name')}
              value={searchKey}
            />
          </ConfigProvider>
        </div>
        <FreelancerListCards filterOption={filterOption} saved={saved} searchKey={searchKey} />
      </div>
    </Row>
  )
}
