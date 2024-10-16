import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom"; 
import { Image } from 'antd';

import '../css/common.css';
import { deleteLoginName } from '../js/common';
import logo from '../images/logo2.png'

const LogoutPage = () => {
    // 路由组件
    const navigate = useNavigate();

    // 初始化动作相关
    useEffect(() => {
        deleteLoginName();
    }, []);

    const onClickReturnToLogin = () => {
        navigate('/login');
    }

    return (
        <div className="flex-col-cont" style={{alignItems: 'center', justifyContent: 'center', height: 600, width: '100%'}}>
            <div className="flex-row-cont" style={{height: 60, width: '30%', background: '#353535', color: 'white', border: '1px solid #353535'}}>
                <Image className='flex-row-cont' src={logo} height={25}/>
            </div>
            <div className="flex-col-cont" style={{height: 175, width: '30%', border: '1px solid #353535'}}>
                <span>登出成功！<a onClick={onClickReturnToLogin}>返回登录页</a></span>
            </div>
        </div>
    )
};

export default LogoutPage;
