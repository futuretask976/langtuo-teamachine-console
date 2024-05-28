import React from 'react';
import { Button, Form, Input } from 'antd';
import axios from 'axios';

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
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: 600, width: '100%', border: '0px solid gray'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'gray', height: 30, color: 'white', width: '30%', border: '1px solid gray'}}>
                用户登录
            </div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: 205, width: '30%', border: '1px solid gray'}}>
                <Form name="loginForm" initialValues={{remember: true}} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
                    <Form.Item label="用户名" style={{width: 300}} name="username" rules={[{required: true, message: '请输入你的用户名'}]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="密&nbsp;&nbsp;&nbsp;&nbsp;码" style={{width: 300}} name="password" rules={[{required: true, message: 'Please input your password!'}]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item style={{width: 300, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
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
