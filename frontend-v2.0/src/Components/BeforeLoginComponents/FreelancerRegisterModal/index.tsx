import { Button, Col, Drawer, Form, Input, Row, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { BlueColorButton } from 'src/Components/CommonComponents/custom-style-elements/button';
import CategoriesPicker from 'src/Components/SharedComponents/CategoriesPicker';
import LocationPicker from 'src/Components/SharedComponents/LocationPicker';
import SkillPicker from 'src/Components/SharedComponents/SkillPicker';

const FreelancerRegisterModal = ({ isOpen, onClose, setWorkInfo, workInfo }: any) => {

  const { t } = useTranslation(['main'])

  const onChangeLocation = (locs: string[]) => {
    setWorkInfo({ ...workInfo, currentLocations: locs})
  }

  const onChangeSkills = (skills: any[]) => {
    setWorkInfo({ ...workInfo, skills })
  }

  const onChangeCats = (cats: string[]) => {
    console.log(cats)
    setWorkInfo({ ...workInfo, preferJobType: cats})
  }

  const onChangeIntro = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWorkInfo({ ...workInfo, intro: e.target.value})
  };

  return (
    <Drawer
      title={t('Let enter freelancer info')}
      width={800}
      onClose={onClose}
      open={isOpen}
      style={{zIndex: 2000}}
      bodyStyle={{ paddingBottom: 80,  }}
      footer={
        <Space>
          <Button onClick={onClose}>{t('Skip')}</Button>
          <BlueColorButton onClick={onClose} type="primary">
            {t('Continue')}
          </BlueColorButton>
        </Space>
      }
    >
      <Form layout="vertical" hideRequiredMark>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="owner"
              label={t('My Category')}
              rules={[{ required: true, message: 'Please select an owner' }]}
            >
              <CategoriesPicker handleChange={onChangeCats}/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="location"
              label={t("Location")}
              rules={[{ required: true, message: 'Please choose the type' }]}
            >
              <LocationPicker handleChange={onChangeLocation}></LocationPicker>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="skills"
              label={t('Skills')}
              rules={[{ required: true, message: 'Please choose the skills' }]}
            >
              <SkillPicker handleChange={onChangeSkills} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="description"
              label={t('Description')}
            >
              <Input.TextArea onChange={onChangeIntro} rows={4} placeholder={t("A good description includes:")} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default FreelancerRegisterModal;