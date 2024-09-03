import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"; 
import { Dropdown, Layout, Image, Space } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';

import { deleteJwtToken, genGetUrl, getJwtToken, getLoginName, handleRespError, isRespSuccess } from '../js/common.js';
import logo from '../images/logo2.png'

const HeaderBar = () => {
    const navigate = useNavigate();
    const { Header } = Layout;

    const loginName = getLoginName();

    const headerStyle = {
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: '#353535',
        color: '#FFFFFF',
        height: 50,
        paddingInline: 0,
        border: '0px solid green'
    };

    const doLogout = () => {
        axios.get(genGetUrl('/logout'), {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            if (isRespSuccess(response)) {
                deleteJwtToken();
                alert('登出成功，重定向到登录页面！');
                navigate('/login');
            }
        })
        .catch(error => {
            handleRespError(error);
        });
    }

    const items = [
        {
            key: 'logout',
            label: (
                <div className="flex-row-cont" style={{justifyContent: 'flex-end'}}><a onClick={doLogout}>注销登录</a></div>
            ),
        }
    ];

    return (
        <Header style={headerStyle}>
            <div className='flex-row-cont' style={{width: 175, border: '0px solid green'}}>
                <Image className='flex-row-cont' src={logo} height={20}/>
            </div>
            <div className='flex-row-cont' style={{justifyContent: 'flex-end', width: 325}}>
                <Space className='flex-row-cont' size={5}>
                    <UserOutlined style={{fontSize: '20px'}} />
                    <Dropdown menu={{items}}>
                        <Space>
                            {loginName}
                            <DownOutlined />
                        </Space>
                    </Dropdown>
                    <span>&nbsp;</span>
                </Space>
            </div>
        </Header>
    )
};

export default HeaderBar;

