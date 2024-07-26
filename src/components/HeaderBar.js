import React from 'react';
import { Layout, Image, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';

import logo from '../images/logo.png'


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

    return (
        <Header style={headerStyle}>
            <div id='logoHeader' style={{display: 'flex', alignItems: 'center', justifyContent: 'left', width: '30%'}}>
                <Space size={5}>
                    <div style={{display: 'flex', alignItems: 'center'}}><Image height={60} style={{display: 'flex', alignItems: 'center'}}  src={logo} /></div>
                    <div style={{display: 'flex', alignItems: 'center', fontSize: 20}}>管理控制台</div>
                </Space>
            </div>
            <div id='loginHeader' style={{display: 'flex', alignItems: 'center', justifyContent: 'right', width: '20%'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <UserOutlined style={{fontSize: '20px'}} />
                </div>
                <div>&nbsp;&nbsp;</div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    登录用户：广夏（<a onClick={doLogout}>登出</a>）
                </div>
            </div>
        </Header>
    )
};

export default HeaderBar;

