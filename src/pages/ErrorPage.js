import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Image } from 'antd';

import '../css/common.css';
import logo from '../images/logo2.png'

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function LoginPage() {
    const queryParams = useQuery();
    const [msg, setMsg] = useState('');

    useEffect(() => {
        // 假设我们要获取名为 'param' 的查询参数
        const msg = queryParams.get('msg');
        setMsg(msg || '');
    }, [queryParams]);

    return (
        <div className="flex-col-cont" style={{alignItems: 'center', justifyContent: 'center', height: 600, width: '100%'}}>
            <div className="flex-row-cont" style={{height: 60, width: '30%', background: '#353535', color: 'white', border: '1px solid #353535'}}>
                <Image className='flex-row-cont' src={logo} height={25}/>
            </div>
            <div className="flex-col-cont" style={{height: 175, width: '30%', border: '1px solid #353535'}}>
                <div>
                    <span>错误消息：</span><span>{msg}</span>
                </div>
            </div>
        </div>
    )
};

export default LoginPage;
