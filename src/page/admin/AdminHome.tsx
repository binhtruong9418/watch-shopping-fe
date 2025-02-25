import { InboxOutlined } from '@ant-design/icons';
import {Button, ConfigProvider, Layout, Menu} from 'antd';
import ProductTable from '../../compoments/admin/ProductTable';
import { useEffect, useState } from 'react';
import CategoryTable from '../../compoments/admin/CategoryTable';
import OrderTable from '../../compoments/admin/OrderTable';
import { HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Logo from "../../assets/img/logo.png";
import viVN from 'antd/lib/locale/vi_VN';
import {useMqtt} from "../../mqtt/MqttProvider.tsx";
import {toast} from "react-toastify";
import {useQueryClient} from "react-query";

const { Header, Content, Sider } = Layout;

const AdminHome = () => {
    const [tab, setTab] = useState('1')
    const userInfo = JSON.parse(localStorage.getItem('userInfo') as string);
    const jwtToken = localStorage.getItem('jwtToken');
    const {mqttClient, mqttStatus, subscribeToTopic, mqttData} = useMqtt();
    const queryClient = useQueryClient()
    useEffect(() => {
        if (!userInfo || !jwtToken) {
            window.location.href = '/'
        }
    }, [])

    useEffect(() => {
        if(mqttClient && mqttStatus === 'Connected') {
            const topic = '/new-order';
            const cancelTopic = '/cancel-order';
            subscribeToTopic([topic, cancelTopic]);
        }
    }, []);

    useEffect(() => {
        console.log('mqttData', mqttData.topic)
        if(mqttData.topic === '/new-order') {
            console.log('New order', mqttData.message.toString())

            const data = JSON.parse(mqttData.message.toString());
            console.log(data)

            toast.success('Có đơn hàng mới')

            queryClient.refetchQueries(['getAllOrder'])
        } else if(mqttData.topic === '/cancel-order') {
            console.log('Cancel order', mqttData.message.toString())

            const data = JSON.parse(mqttData.message.toString());
            console.log(data)

            toast.error('Có đơn hàng bị hủy')

            queryClient.refetchQueries(['getAllOrder'])
        }
    }, [mqttData]);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('jwtToken');
        window.location.href = '/'
    }
    return userInfo && jwtToken && (
        <ConfigProvider locale={viVN}>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    collapsible={true}
                >
                    <div className="logo my-3">
                        <a href="#"><img src={Logo} alt=""/></a>
                    </div>
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        onClick={(e) => setTab(e.key)}
                        items={[
                            {
                                icon: <InboxOutlined/>,
                                label: 'Quản lý sản phẩm',
                                key: '1',
                            },

                            {
                                icon: <InboxOutlined/>,
                                label: 'Quản lý danh mục',
                                key: '2',
                            },

                            {
                                icon: <InboxOutlined/>,
                                label: 'Quản lý đơn hàng',
                                key: '3',
                            }
                        ]}
                    />
                </Sider>
                <Layout>
                    <Header style={{padding: 20, background: '#fff'}}
                            className='d-flex justify-content-between align-items-center'>
                        <Link to='/'>
                            <HomeOutlined style={{ fontSize: 25, cursor: 'pointer' }} />
                        </Link>
                        <Button type="primary" danger onClick={handleLogout}>Logout</Button>
                    </Header>
                    <Content style={{ paddingTop: 50 }}>
                        {
                            tab === '1' &&
                            <div style={{ height: '100%', background: '#fff' }}>
                                <ProductTable />
                            </div>

                        }
                        {
                            tab === '2' &&
                            <div style={{ height: '100%', background: '#fff' }}>
                                <CategoryTable />
                            </div>

                        }
                        {
                            tab === '3' &&
                            <div style={{ height: '100%', background: '#fff' }}>
                                <OrderTable />
                            </div>
                        }
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default AdminHome;