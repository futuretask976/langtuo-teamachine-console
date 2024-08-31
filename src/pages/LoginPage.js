import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"; 
import { Button, Image, Input, Select, Space } from 'antd';
import axios from 'axios';
import md5 from 'js-md5';

import '../css/common.css';
import { genPostUrl, genGetUrl, getRespModel, handleRespError, putTenantCode, isValidCode } from '../js/common';
import { AuthContext } from '../js/context';
import logo from '../images/logo2.png'

function LoginPage() {
    const navigate = useNavigate();

    // 上下文初始化
    const { setToken } = useContext(AuthContext);

    // 数据初始化
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [tenantCode, setTenantCode] = useState('');
    const [tenantList4Select, setTenantList4Select] = useState([]);

    // 初始化动作相关
    const fetchTenantList4Select = () => {
        let url = genGetUrl('/userset/tenant/list');
        axios.get(url, {
            // withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            let model = getRespModel(response);
            setTenantList4Select((prev => {
                let tmp = [];
                model.forEach(item => {
                    tmp.push({
                        label: item.tenantName,
                        value: item.tenantCode
                    });
                })
                return tmp;
            }));
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    const onlyTest = () => {
        // let url = genGetUrlBySegs('/deviceset/model/{segment}/get', ['GX_TEAMACHINE_01']);
        // axios.get(url, {
        //     headers: {
        //         'Authorization': getJwtToken()
        //     }
        // })
        // .then(response => {
        //     let model = getRespModel(response);
        //     console.log('$$$$$ onlyTest modelList=', model);
        // })
        // .catch(error => {
        //     console.log('$$$$$ onlyTest error=', error);
        // });

        // let url2 = genGetUrlByParams('/drinkset/accuracy/list', {
        //     tenantCode: getTenantCode()
        // });
        // axios.get(url2, {
        //     headers: {
        //         'Authorization': getJwtToken()
        //     }
        // })
        // .then(response => {
        //     let model = getRespModel(response);
        //     console.log('$$$$$ onlyTest accuracyList=', model);
        // })
        // .catch(error => {
        //     console.log('$$$$$ onlyTest error=', error);
        // });

        // let url3 = genGetUrlByParams('/menuset/menu/trigger', {
        //     tenantCode: getTenantCode(),
        //     shopCode: 'shop_001',
        //     machineCode: '12345'
        // });
        // axios.get(url3, {
        //     headers: {
        //         'Authorization': getJwtToken()
        //     }
        // })
        // .then(response => {
        //     console.log('$$$$$ onlyTest response=', response);
        // })
        // .catch(error => {
        //     console.log('$$$$$ onlyTest error=', error);
        // });
    }
    useEffect(() => {
        fetchTenantList4Select();
        onlyTest();
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
        axios.post(genPostUrl('/login-processing'), postData, {
            // withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            let model = getRespModel(response);
            putTenantCode(tenantCode);
            setToken(model.jwtToken);
            navigate('/index');
        })
        .catch(error => {
            handleRespError(error);
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
                        <Button type="primary" onClick={onClickLogin}>
                            登录
                        </Button>
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
