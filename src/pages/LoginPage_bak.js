import React from 'react';
import { Button, Form, Input } from 'antd';
import axios from 'axios';

import '../css/common.css';
import { isBlankStr, genGetUrlByParams, genGetUrlBySegs, genPostUrl } from '../js/common.js';

const onFinish = (values) => {
    console.log('Success:', values);
    let postData = 'username=' + values.username + "&password=" + values.password;

    axios.post('/gxsp3demo/login-processing', postData, {
        withCredentials: true // 这会让axios在请求中携带cookies
    })
        .then(response => {
            console.log('response: ', response);
            console.log('response.data: ', response.data);
            console.log('response.data.loginSuccess: ', response.data.loginSuccess);
            if (response && response.data && response.data.loginSuccess === 'true') {
                console.log('prepare to locate');
                window.location.href='/gxadmin/index';
            } else {
                alert('登录有问题');
            }
        })
        .catch(error => {
            console.error('error: ', error);
            alert('登录失败');
        });
};

const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

function LoginPage() {
    return (
        <div className="flex-col-cont" style={{height: 600, width: '100%', border: '0px solid #353535'}}>
            <div className="flex-row-cont" style={{background: '#353535', height: 50, color: 'white', width: '30%', border: '1px solid #353535'}}>
                用户登录
            </div>
            <div className="flex-col-cont" style={{height: 200, width: '30%', border: '1px solid red'}}>
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
            </div>
        </div>
    )
};

export default LoginPage;
