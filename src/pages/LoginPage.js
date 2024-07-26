import React, { useEffect, useState } from 'react';
import { Button, Image, Input, Space } from 'antd';
import axios from 'axios';

import '../css/common.css';
import { genGetUrl, getRespModel, handleErrorResp } from '../js/common.js';
import logo60 from '../images/logo60.png'

function LoginPage() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const onClickLogin = () => {
        let postData = 'username=' + userName + "&password=" + password;
        axios.post(genGetUrl('/login-processing'), postData, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            let model = getRespModel(response);
            localStorage.setItem('jwtToken', model.jwtToken);
            window.location.href='/console/index';
        })
        .catch(error => {
            handleErrorResp(error);
        });
    };

    useEffect(() => {
        alert('$$$$$ jwtToken=' + localStorage.getItem('jwtToken'));
    }, []);

    return (
        <div className="flex-col-cont" style={{alignItems: 'center', justifyContent: 'center', height: 600, width: '100%'}}>
            <div className="flex-row-cont" style={{height: 60, width: '30%', background: '#353535', color: 'white', border: '1px solid #353535'}}>
                <Image className='flex-row-cont' src={logo60} />
            </div>
            <div className="flex-col-cont" style={{height: 175, width: '30%', border: '1px solid #353535'}}>
                <Space direction='vertical' size={20} style={{width: '90%'}}>
                    <div className="flex-row-cont">
                        <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'flex-end', width: '20%'}}><span>用户名：</span></div>
                        <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'flex-start', width: '80%'}}>
                            <Input placeholder='用户名' onChange={(e) => setUserName(e.target.value)} style={{width: '100%'}}/>
                        </div>
                    </div>
                    <div className="flex-row-cont">
                        <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'flex-end', width: '20%'}}><span>密码：</span></div>
                        <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'flex-start', width: '80%'}}>
                            <Input.Password placeholder='密码' onChange={(e) => setPassword(e.target.value)} style={{width: '100%'}}/>
                        </div>
                    </div>
                    <div className="flex-row-cont">
                        <Button type="primary" onClick={onClickLogin}>
                            登录
                        </Button>
                    </div>
                </Space>
            </div>
        </div>
    )
};

export default LoginPage;
