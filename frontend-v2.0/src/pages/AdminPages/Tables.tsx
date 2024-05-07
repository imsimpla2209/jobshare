import { PlusCircleTwoTone, SearchOutlined } from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Drawer,
  Input,
  Modal,
  Radio,
  Row,
  Space,
  Statistic,
  Table,
  Typography
} from "antd";


// Images
import defaultAvate from 'assets/img/icon-user.svg';
import { useEffect, useState } from "react";
import AddUser from "src/Components/AdminComponents/Modal/AddUser";
import UserInfo from "src/Components/AdminComponents/Modal/UserInfo";
import { getAllUsers } from "src/api/admin-apis";
import { getUsers } from "src/api/user-apis";
import { getOnlineUsers } from "src/api/user-apis";
import { EUserType } from "src/utils/enum";
import { randomDate } from "src/utils/helperFuncs";

const { Title } = Typography;

const columns = [
  {
    title: "User",
    dataIndex: "name",
    key: "name",
    width: "22%",
  },
  {
    title: "LOGIN AS",
    dataIndex: "function",
    key: "function",
  },

  {
    title: "STATUS",
    key: "status",
    dataIndex: "status",
  },

  {
    title: "PROFILE VERIFIED",
    key: "active",
    dataIndex: "active",
  },

  {
    title: "JOINT DATE",
    key: "JointDate",
    dataIndex: "JointDate",
  },
];

function Tables() {

  const [users, setUsers] = useState<any>({})
  const [onlineUsers, setOnlineUsers] = useState<any>([])
  const [seletecUser, setSelectedUser] = useState<any>({ user: {}, type: '' })
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchClient, setSearchClient] = useState('')
  const [searchFreelancers, setSearchFreelancers] = useState('')
  const [openAddModal, setOpenAddModal] = useState(false)
  const [clients, setClients] = useState<any>([])
  const [freelancers, setFreelancers] = useState<any>([])
  const [refresh, setRefresh] = useState<any>(false)
  const [admins, setAdmins] = useState<any>([])

  useEffect(() => {
    getAllUsers().then((res) => {
      setUsers(res.data)
      setClients(res.data?.clients)
      setFreelancers(res.data?.freelancers)
    }).finally(() => {
      setLoading(false)
    })

    getUsers({ role: 'admin' }).then((res) => {
      setAdmins(res.data?.results)
    })

  }, [refresh])

  useEffect(() => {
    getOnlineUsers().then((res) => {
      setOnlineUsers(res.data)
    })
  }, [])

  const onRefresh = () => {
    setRefresh(!refresh)
  }

  const openUserDetailModal = (user, type) => {
    setSelectedUser({ user, type })
    setOpenModal(true)
  }

  const handleSearch = e => {
    setSearchClient(e.target.value)
  }

  const handleSearchFreelancers = e => {
    setSearchFreelancers(e.target.value)
  }

  const onChangeClientFilter = e => {
    setFilter(e.target.value)
    switch (e.target.value) {
      case 'online': return setClients(users?.clients?.filter(u => onlineUsers?.includes(u?.user?.id)))
      case 'verified': return setClients(users?.clients?.filter(u => u?.paymentVerified))
      case 'notVerified': return setClients(users?.clients?.filter(u => !u?.paymentVerified))
      case 'inactive': return setClients(users?.clients?.filter(u => !u?.user?.isActive))
      case 'pending': return setClients(users?.clients?.filter(u => !u?.paymentVerified))
      default: return setClients(users?.clients)
    }
  }

  const onChangeFreelancerFilter = e => {
    setFilter(e.target.value)
    console.log(e.target.value)
    switch (e.target.value) {
      case 'online': return setFreelancers(users?.freelancers?.filter(u => onlineUsers?.includes(u?.user?.id)))
      case 'verified': return setFreelancers(users?.freelancers?.filter(u => u?.isProfileVerified))
      case 'notVerified': return setFreelancers(users?.freelancers?.filter(u => !u?.isProfileVerified))
      case 'inactive': return setFreelancers(users?.freelancers?.filter(u => !u?.user?.isActive))
      case 'pending': return setFreelancers(users?.freelancers?.filter(u => !u?.isSubmitProfile))
      default: return setFreelancers(users?.freelancers)
    }
  }

  const getUsersData = (users, type) => {
    return users?.filter(u => {
      if (type === EUserType.CLIENT) {
        return !searchClient || u?.user.name.toLowerCase().includes(searchClient.trim().toLowerCase())
      } else if (type === EUserType.FREELANCER) {
        return !searchFreelancers || u?.user.name.toLowerCase().includes(searchFreelancers.trim().toLowerCase())
      }
      return users
    })?.map((user, ix) => ({
      key: ix,
      name: (
        <>
          <Avatar.Group>
            <Avatar
              className="shape-avatar"
              shape="square"
              size={40}
              src={user?.user?.avatar || defaultAvate}
            ></Avatar>
            <div className="avatar-info">
              <Title level={5}>{user?.user.name}</Title>
              <p>{user?.user?.email || 'No Email'}</p>
              <p>{user?.user?.phone || 'No phone'}</p>

            </div>
          </Avatar.Group>{" "}
        </>
      ),
      function: (
        <div className="author-info">
          <Title level={5} style={{ textTransform: 'capitalize' }}>{user?.user?.lastLoginAs}</Title>
          <p style={{ textTransform: 'capitalize' }}>{user?.user?.role}</p>
        </div>
      ),

      status: (
        <div>
          <Badge count={onlineUsers?.includes(user?.user?.id) ? "Online" : "Offline"} className="tag-primary"
            style={{ backgroundColor: onlineUsers?.includes(user?.user?.id) ? "#52c41a" : "grey" }}
          >
          </Badge>
          <Badge count={user?.user?.isActive ? "Active" : "Inactive"} className="tag-primary"
            style={{ backgroundColor: user?.user?.isActive ? "#2E6421" : "#f5222d" }}
          >
          </Badge>
        </div>
      ),
      active: (
        <Badge count={(user?.user?.lastLoginAs === EUserType.FREELANCER ? user?.isProfileVerified : user?.paymentVerified) ? "Verified" : "Not Yet"} className="tag-primary"
          style={{ backgroundColor: (user?.user?.lastLoginAs === EUserType.FREELANCER ? user?.isProfileVerified : user?.paymentVerified) ? "blue" : "darkseagreen" }}
        >
        </Badge>
      ),
      JointDate: (
        <div className="ant-employed">
          <span>{user?.user?.createdAt
            ? new Date(`${user?.user?.createdAt}`).toLocaleString()
            : randomDate(new Date(2022, 0, 1), new Date()).toLocaleString()}</span>
          <Button type="primary" shape="round" onClick={() => openUserDetailModal(user, type)}>Detail</Button>
        </div>
      ),

    }))
  };

  const getAdminData = (users, type) => {
    return users?.map((user, ix) => ({
      key: ix,
      name: (
        <>
          <Avatar.Group>
            <Avatar
              className="shape-avatar"
              shape="square"
              size={40}
              src={user?.avatar || defaultAvate}
            ></Avatar>
            <div className="avatar-info">
              <Title level={5}>{user?.name}</Title>
              <p>{user?.email || 'No Email'}</p>
              <p>{user?.phone || 'No phone'}</p>

            </div>
          </Avatar.Group>{" "}
        </>
      ),
      function: (
        <div className="author-info">
          <Title level={5} style={{ textTransform: 'capitalize' }}>{user?.lastLoginAs}</Title>
          <p style={{ textTransform: 'capitalize' }}>{user?.role}</p>
        </div>
      ),

      status: (
        <div>
          <Badge count={onlineUsers?.includes(user?.id) ? "Online" : "Offline"} className="tag-primary"
            style={{ backgroundColor: onlineUsers?.includes(user?.id) ? "#52c41a" : "grey" }}
          >
          </Badge>
          <Badge count={user?.isActive ? "Active" : "Inactive"} className="tag-primary"
            style={{ backgroundColor: user?.isActive ? "#2E6421" : "#f5222d" }}
          >
          </Badge>
        </div>
      ),
      active: (
        <Badge count={(user?.lastLoginAs === EUserType.FREELANCER ? user?.isProfileVerified : user?.paymentVerified) ? "Verified" : "Not Yet"} className="tag-primary"
          style={{ backgroundColor: (user?.lastLoginAs === EUserType.FREELANCER ? user?.isProfileVerified : user?.paymentVerified) ? "blue" : "darkseagreen" }}
        >
        </Badge>
      ),
      JointDate: (
        <div className="ant-employed">
          <span>{user?.createdAt
            ? new Date(`${user?.createdAt}`).toLocaleString()
            : randomDate(new Date(2022, 0, 1), new Date()).toLocaleString()}</span>
          <Button type="primary" shape="round" onClick={() => openUserDetailModal(user, type)}>Detail</Button>
        </div>
      ),

    }))
  };

  return (
    <div className="tabled">
      <Row gutter={16} style={{ margin: 10 }}>
        <Col span={6}>
          <Statistic title="Online Users" value={onlineUsers?.length} />
        </Col>
        <Col span={6}>
          <Statistic title="Total Users" value={users?.clients?.length + users?.freelancers?.length} />
        </Col>
        <Col span={6}>
          <Statistic title="Inactive Users" value={users?.clients?.filter(x => !x?.user?.isActive)?.length + users?.freelancers?.filter(x => !x?.user?.isActive)?.length} />
        </Col>
        <Col span={6}>
          <Statistic title="Not Verified Profile" value={users?.clients?.filter(x => !x?.paymentVerified)?.length + users?.freelancers?.filter(x => !x?.user?.isProfileVerified)?.length} />
        </Col>
        <Button
          icon={<PlusCircleTwoTone twoToneColor={'#861cff'} />}
          type="primary"
          onClick={() => setOpenAddModal(true)}
        >
          Add User
        </Button>
      </Row>
      <Row gutter={[24, 0]}>
        <Col xs="24" xl={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title="Client List"
            extra={
              <Space>
                <Input
                  className="header-search"
                  placeholder="Search here"
                  prefix={<SearchOutlined />}
                  value={searchClient}
                  onInput={handleSearch}
                />
                <Radio.Group onChange={onChangeClientFilter} value={filter}>
                  <Radio.Button value="all">All</Radio.Button>
                  <Radio.Button value="online">Online</Radio.Button>
                  <Radio.Button value="verified">Verified</Radio.Button>
                  <Radio.Button value="notVerified">Not Verified</Radio.Button>
                  <Radio.Button value="inactive">Inactive</Radio.Button>
                  <Radio.Button value="pending">Pending Profile</Radio.Button>
                </Radio.Group>

              </Space>
            }
          >
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={getUsersData(clients, EUserType.CLIENT)}
                pagination={{}}
                className="ant-border-space"
                loading={loading}
              />
            </div>
          </Card>
          <Modal
            open={openModal}
            title="User Details"
            onCancel={() => {
              setOpenModal(false)
              setSelectedUser({})
            }}
            width={1250}
            footer={[
              <Button key="back" onClick={() => {
                setOpenModal(false)
                setSelectedUser({})
              }}>
                Notify
              </Button>,
              <Button key="submit" type="primary" >
                Direct Message
              </Button>,
              <Button
                key="link"
                href="https://google.com"
                type="primary"
              >
                Verify Profile
              </Button>,
            ]}
          >
            <UserInfo user={seletecUser.user} type={seletecUser.type} />
          </Modal>
        </Col>
      </Row>

      <Row gutter={[24, 0]}>
        <Col xs="24" xl={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title="Freelancers List"
            extra={
              <Space>
                <Input
                  className="header-search"
                  placeholder="Search here"
                  prefix={<SearchOutlined />}
                  value={searchFreelancers}
                  onInput={handleSearchFreelancers}
                />
                <Radio.Group onChange={onChangeFreelancerFilter} value={filter}>
                  <Radio.Button value="all">All</Radio.Button>
                  <Radio.Button value="online">Online</Radio.Button>
                  <Radio.Button value="verified">Verified</Radio.Button>
                  <Radio.Button value="notVerified">Not Verified</Radio.Button>
                  <Radio.Button value="inactive">Inactive</Radio.Button>
                  <Radio.Button value="pending">Pending Profile</Radio.Button>
                </Radio.Group>

              </Space>
            }
          >
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={getUsersData(freelancers, EUserType.FREELANCER)}
                pagination={{}}
                className="ant-border-space"
                loading={loading}
              />
            </div>
          </Card>
          <Modal
            open={openModal}
            title="User Details"
            onCancel={() => {
              setOpenModal(false)
              setSelectedUser({})
            }}
            width={1250}
            footer={[

            ]}
          >
            <UserInfo user={seletecUser.user} type={seletecUser.type} />
          </Modal>
        </Col>
      </Row>

      <Row gutter={[24, 0]}>
        <Col xs="24" xl={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title="Admins List"
            extra={
              <></>
            }
          >
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={getAdminData(admins, EUserType.ADMIN)}
                pagination={{}}
                className="ant-border-space"
                loading={loading}
              />
            </div>
          </Card>
          <Modal
            open={openModal}
            title="Admin Account Interactions"
            onCancel={() => {
              setOpenModal(false)
              setSelectedUser({})
            }}
            width={1250}

            footer={[

            ]}
            style={{
              height: '200px'
            }}
          >
            <div className="p-4">
              <UserInfo user={seletecUser.user} type={seletecUser.type} />
            </div>
          </Modal>
        </Col>
      </Row >
      <Modal
        open={openAddModal}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        onCancel={() => {
          setOpenAddModal(false)
        }}
        footer={[

        ]}
      >
        <Space>
          <AddUser onRefresh={onRefresh} />
        </Space>
      </Modal>
    </div >
  );
}

export default Tables;
