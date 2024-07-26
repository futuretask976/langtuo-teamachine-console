import React from 'react';
import { Dropdown, Layout, Image, Space } from 'antd';
import { DownOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';

import { genGetUrl, getRespModel, handleErrorResp } from '../js/common.js';
import logo60 from '../images/logo60.png'


const deleteCookie = (name) => {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

const doLogout = () => {
    axios.get(genGetUrl('/logout'), {
        withCredentials: true // 这会让axios在请求中携带cookies
    })
    .then(response => {
        let model = getRespModel(response);
        // 清除本地存储的认证信息，如token等
        localStorage.removeItem('jwtToken');
        deleteCookie('JSESSIONID');
        alert('登出成功，重定向到登录页面！');
        window.location.href='/console/login';
    })
    .catch(error => {
        handleErrorResp(error);
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

