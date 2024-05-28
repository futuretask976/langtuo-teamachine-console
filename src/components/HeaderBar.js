import React from 'react';
import { Layout, Image } from 'antd';
import axios from 'axios';

import loginHeader from '../images/login.png'
import logo from '../images/logo512.png'


const deleteCookie = (name) => {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

const doLogout = () => {
    alert('要注销啦');
    axios.get('/gxsp3demo/logout', {
        withCredentials: true // 这会让axios在请求中携带cookies
    })
        .then(response => {
            console.log('response: ', response);
            console.log('response.data: ', response.data);
            console.log('response.data.logoutSuccess: ', response.data.logoutSuccess);
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
        backgroundColor: '#ffffff',
        color: '#575757',
        height: 150,
        paddingInline: 0,
        border: '0px solid green',
    };

    return (
        <Header style={headerStyle}>
            <div id='logoHeader' style={{width: '10%', border: '0px solid yellow'}}>
                <Image height={120} src={logo} />
            </div>
            <div id='titleHeader' style={{width: '65%', border: '0px solid yellow'}}>
                <span style={{fontSize: 50}}>发布检查报表</span>
            </div>
            <div id='loginHeader' style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20%', border: '0px solid yellow'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: 100, border: '0px solid pink'}}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', border: '0px solid pink', height: '100%'}}>
                        <Image height={70}  src={loginHeader} />
                    </div>
                </div>
                <div>&nbsp;</div>
                <div style={{display: 'flex', flexDirection: 'column', height: 80, border: '0px solid green'}}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', height: '33%', padding: 2}}>登录用户：广夏</div>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', height: '33%', padding: 2}}>用户角色：管理员</div>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', height: '33%', padding: 2, border: '0px solid black'}}><a onClick={doLogout}>登出</a></div>
                </div>
            </div>
        </Header>
    )
};

export default HeaderBar;

