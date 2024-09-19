import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"; 
import { Button, Image, Input, Select, Space } from 'antd';
import axios from 'axios';
import md5 from 'js-md5';

import '../css/common.css';
import { isValidCode, putLoginName, putJwtToken, putTenantCode, isBlankObj } from '../js/common';
import { get, post } from '../js/request.js';
import logo from '../images/logo2.png'

function LoginPage() {
    // 路由组件
    const navigate = useNavigate();

    // 数据初始化
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [tenantCode, setTenantCode] = useState('');
    const [tenantList4Select, setTenantList4Select] = useState([]);

    // 初始化动作相关
    const fetchTenantList4Select = () => {
        get('/userset/tenant/list', {
        }).then(resp => {
            let tenantList = Array.from(resp.model);
            setTenantList4Select((prev => {
                let tmp = [];
                tenantList.forEach(item => {
                    tmp.push({
                        label: item.tenantName,
                        value: item.tenantCode
                    });
                })
                return tmp;
            }));
        });
    }
    const onClickTest = () => {
        // axios.put('http://localhost:8080/teamachinebackend/deviceset/machine/activate', {
        //     deployCode: 'Rb1x0DQCYieDRrcrApmv', 
        //     machineCode: '20240904000004', 
        //     elecBoardCode: '647dd18c5733f815', 
        //     screenCode: '647dd18c5733f815'
        // }, {
        //     headers: {
        //         'Tenant-Code': 'tenant_001',
        //         'Machine-Code': '202408140011',
        //         'Deploy-Code': 'Rb1x0DQCYieDRrcrApmv'
        //     }
        // })
        // .then(response => {
        //     console.log('$$$$$ response=', response)
        // })
        // .catch(error => {
        //     console.log('$$$$$ error=', error)
        // });

        axios.get('http://localhost:8080/teamachinebackend/drinkset/spec/list?tenantCode=tenant_001', {
            headers: {
                'Tenant-Code': 'tenant_001',
                'Machine-Code': 'machine_333',
                'Deploy-Code': '30rqiy'
            }
        })
        .then(response => {
            console.log('$$$$$ response=', response)
        })
        .catch(error => {
            console.log('$$$$$ error=', error)
        });
    }
    useEffect(() => {
        fetchTenantList4Select();
    }, []);

    const onClickLogin = () => {
        if (!isValidCode(userName, true)) {
            alert('用户名不符合规则');
            return;
        }
        if (!isValidCode(password, true)) {
            alert('密码不符合规则');
            return;
        }

        let postData = 'username=' + userName + "&password=" + md5(password) + "&tenantCode=" + tenantCode;
        post('/login-processing', postData)
        .then(respData => {
            if (!isBlankObj(respData)) {
                let model = respData.model;
                putTenantCode(tenantCode);
                putJwtToken(model.jwtToken);
                putLoginName(model.loginName);
                navigate('/index');
            } 
        });
    };

    return (
        <div className="flex-col-cont" style={{alignItems: 'center', justifyContent: 'center', height: 600, width: '100%'}}>
            <div className="flex-row-cont" style={{height: 60, width: '30%', background: '#353535', color: 'white', border: '1px solid #353535'}}>
                <Image className='flex-row-cont' src={logo} height={25} />
            </div>
            <div className="flex-col-cont" style={{height: 225, width: '30%', border: '1px solid #353535'}}>
                <Space direction='vertical' size={20} style={{width: '90%'}}>
                    <div className="flex-row-cont">
                        <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'flex-end', width: '25%'}}>
                            <Space size='small'><span style={{color: 'red'}}>*</span><span>用户名：</span></Space>
                        </div>
                        <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'flex-start', width: '75%'}}>
                            <Input placeholder='用户名' onChange={(e) => setUserName(e.target.value)} style={{width: '100%'}}/>
                        </div>
                    </div>
                    <div className="flex-row-cont">
                        <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'flex-end', width: '25%'}}>
                            <Space size='small'><span style={{color: 'red'}}>*</span><span>密码：</span></Space>
                        </div>
                        <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'flex-start', width: '75%'}}>
                            <Input.Password placeholder='密码' onChange={(e) => setPassword(e.target.value)} style={{width: '100%'}}/>
                        </div>
                    </div>
                    <div className="flex-row-cont">
                        <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'flex-end', width: '25%'}}>
                            <Space size='small'><span style={{color: 'red'}}>*</span><span>商户：</span></Space>
                        </div>
                        <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'flex-start', width: '75%'}}>
                            <Select
                                value={tenantCode}
                                style={{width: '100%'}}
                                onChange={(e) => setTenantCode(e)}
                                options={tenantList4Select}
                            />
                        </div>
                    </div>
                    <div className="flex-row-cont">
                        <Space>
                            <Button type="primary" onClick={onClickLogin}>
                                登录
                            </Button>
                            <Button type="primary" onClick={onClickTest}>
                                临时测试用（请不要点击）
                            </Button>
                        </Space>
                    </div>
                </Space>
                {/* <div className="flex-col-cont" style={{height: 200, width: '30%', border: '1px solid red'}}>
                    <Form name="loginForm" initialValues={{remember: true}} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
                        <Form.Item label="用户名" name="username" rules={[{required: true, message: '请输入你的用户名'}]} className="flex-row-cont" style={{width: '100%', border: '1px solid green'}}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="密&nbsp;&nbsp;&nbsp;&nbsp;码" name="password" rules={[{required: true, message: 'Please input your password!'}]} className="flex-row-cont" style={{width: '100%', border: '1px solid red'}}>
                            <Input.Password />
                        </Form.Item>
                        <Form.Item className="flex-row-cont" style={{width: '100%', border: '1px solid green'}}>
                            <Button type="primary" htmlType="submit">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div> */}
            </div>
        </div>
    )
};

export default LoginPage;
