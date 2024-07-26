import React, { useState } from 'react';
import { Button, Form, Image, Input, Space } from 'antd';
import axios from 'axios';

import '../css/common.css';
import { isBlankStr, genGetUrlByParams, genGetUrlBySegs, genPostUrl } from '../js/common.js';
import logo60 from '../images/logo60.png'

function LoginPage(props) {
    return (
        <div className="flex-col-cont" style={{alignItems: 'center', justifyContent: 'center', height: 600, width: '100%'}}>
            <div className="flex-row-cont" style={{height: 60, width: '30%', background: '#353535', color: 'white', border: '1px solid #353535'}}>
                <Image className='flex-row-cont' src={logo60} />
            </div>
            <div className="flex-col-cont" style={{height: 175, width: '30%', border: '1px solid #353535'}}>
                <span>您的访问出现错误，请联系管理员处理！</span>
            </div>
        </div>
    )
};

export default LoginPage;
