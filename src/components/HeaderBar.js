import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom"; 
import { Dropdown, Layout, Image, Select, Space } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';

import { FramePageContext } from '../js/context'
import { deleteJwtToken, getLoginName } from '../js/common.js';
import { getLang } from '../i18n/i18n';
import { get } from '../js/request.js';
import logo from '../images/logo2.png'

const { Header } = Layout;

const HeaderBar = () => {
    // 上下文定义
    const { lang, setLang } = useContext(FramePageContext);

    // 重定向定义
    const navigate = useNavigate();

    // 数据定义
    const loginName = getLoginName();

    // 样式定义
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

    // 动作定义
    const doLogout = () => {
        get('/logout', {  
        }).then(resp => {
            if (resp.success) {
                deleteJwtToken();
                alert('登出成功，重定向到登录页面！');
                navigate('/login');
            }
        });
    }
    const doChangeLang = (e) => {
        setLang(e);
    }

    // 下拉菜单定义
    const items = [
        {
            key: 'logout',
            label: (
                <div className="flex-row-cont" style={{justifyContent: 'flex-end'}}><a onClick={doLogout}>{getLang(lang, "logout")}</a></div>
            ),
        }
    ];

    return (
        <Header style={headerStyle}>
            <div className='flex-row-cont' style={{width: 175, border: '0px solid green'}}>
                <Image className='flex-row-cont' src={logo} height={20}/>
            </div>
            <div className='flex-row-cont' style={{justifyContent: 'flex-end', width: 400}}>
                <span>{getLang(lang, "langSelect")}</span>
                <Select
                    onChange={(e) => doChangeLang(e)}
                    options={[
                        {
                            label: '中文',
                            value: 'zh'
                        },
                        {
                            label: 'English',
                            value: 'en'
                        }
                    ]}
                    size={'small'}
                    style={{width: 125}}
                    value={lang}
                />
                <div style={{width: 25}}>&nbsp;</div>
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

