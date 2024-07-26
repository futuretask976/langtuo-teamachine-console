import React from 'react';
import { Dropdown, Layout, Image, Space } from 'antd';
import { DownOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';

import logo60 from '../images/logo60.png'


const deleteCookie = (name) => {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

const doLogout = () => {
    axios.get('/gxsp3demo/logout', {
        withCredentials: true // 这会让axios在请求中携带cookies
    })
        .then(response => {
            // console.log('response: ', response);
            // console.log('response.data: ', response.data);
            // console.log('response.data.logoutSuccess: ', response.data.logoutSuccess);
            if (response && response.data && response.data.logoutSuccess == 'true') {
                console.log('prepare to locate');
                // 清除本地存储的认证信息，如token等
                localStorage.removeItem('JSESSIONID');
                deleteCookie('JSESSIONID');
                window.location.reload();
                // history.go(0);
            } else {
                alert('注销有问题');
            }
        })
        .catch(error => {
            console.error('error: ', error);
            alert('注销失败');
        });
}

const HeaderBar = () => {
    const { Header } = Layout;

    const headerStyle = {
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: '#353535',
        color: '#FFFFFF',
        height: 50,
        paddingInline: 0,
        border: '0px solid green',
    };

    const items = [
        {
            key: 'logout',
            label: (
                <a onClick={doLogout}>
                    登出
                </a>
            ),
        }
    ];

    return (
        <Header style={headerStyle}>
            <div className='flex-row-cont' style={{justifyContent: 'left', width: 300}}>
                <div className='flex-row-cont'>
                    <Image className='flex-row-cont' src={logo60} />
                </div>
            </div>
            <div className='flex-row-cont' style={{width: 175}}>
                <Space size={5}>
                    <div className='flex-row-cont'>
                        <UserOutlined style={{fontSize: '20px'}} />
                    </div>
                    <div className='flex-row-cont'>
                        <Dropdown menu={{items}}>
                            <Space>
                                登录用户：广夏
                                <DownOutlined />
                            </Space>
                        </Dropdown>
                    </div>
                </Space>
            </div>
        </Header>
    )
};

export default HeaderBar;

