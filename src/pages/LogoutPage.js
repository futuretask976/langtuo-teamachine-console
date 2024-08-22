import React, { useContext, useEffect } from 'react';
import { Image } from 'antd';

import '../css/common.css';
import { AuthContext } from '../js/context';
import logo from '../images/logo2.png'

const LogoutPage = () => {
    // 上下文初始化
    const {token, setToken} = useContext(AuthContext);

    // 初始化动作相关
    useEffect(() => {
        setToken(null);
    }, []);

    return (
        <div className="flex-col-cont" style={{alignItems: 'center', justifyContent: 'center', height: 600, width: '100%'}}>
            <div className="flex-row-cont" style={{height: 60, width: '30%', background: '#353535', color: 'white', border: '1px solid #353535'}}>
                <Image className='flex-row-cont' src={logo} height={25}/>
            </div>
            <div className="flex-col-cont" style={{height: 175, width: '30%', border: '1px solid #353535'}}>
                <span>登出成功！<a href='/console/login'>返回登录页</a></span>
            </div>
        </div>
    )
};

export default LogoutPage;
