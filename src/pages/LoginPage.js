import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"; 
import { Button, Image, Input, Select, Space } from 'antd';
import { Map, Marker, ZoomControl } from 'react-bmapgl';
import axios from 'axios';
import md5 from 'js-md5';

import '../css/common.css';
import { AppContext } from '../js/context'
import { getLang, isValidCode, putLoginName, putLang, putJwtToken, putTenantCode, isBlankObj } from '../js/common';
import { applyLang } from '../i18n/i18n';
import { get, post } from '../js/request.js';
import logo from '../images/logo2.png'

function LoginPage() {
    // 上下文定义
    const { refresh, setRefresh } = useContext(AppContext);

    // 路由组件
    const navigate = useNavigate();

    // 数据初始化
    const [userName, setUserName] = useState();
    const [password, setPassword] = useState();
    const [tenantCode, setTenantCode] = useState();
    const [tenantList4Select, setTenantList4Select] = useState([]);
    const [long, setLong] = useState();
    const [lati, setLati] = useState();

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
        //         'Machine-Code': '20240904000004',
        //         'Deploy-Code': 'u4m6xa'
        //     }
        // })
        // .then(response => {
        //     console.log('$$$$$ response=', response)
        // })
        // .catch(error => {
        //     console.log('$$$$$ error=', error)
        // });

        // axios.get('http://localhost:8080/teamachinebackend/menuset/menu/trigger?tenantCode=tenant_001&shopGroupCode=shopGroup_07&machineCode=20240904000004', {
        //     headers: {
        //         'Tenant-Code': 'tenant_001',
        //         'Machine-Code': '20240904000004',
        //         'Deploy-Code': 'u4m6xa'
        //     }
        // })
        // .then(response => {
        //     console.log('$$$$$ response=', response)
        // })
        // .catch(error => {
        //     console.log('$$$$$ error=', error)
        // });

        axios.get('http://localhost:8080/teamachinebackend/deviceset/android/app/list?limit=5', {
            headers: {
                'Tenant-Code': 'tenant_001',
                'Machine-Code': '20240904000004',
                'Deploy-Code': 'u4m6xa'
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
        findLoc();
    }, []);

    const onClickLogin = () => {
        if (!isValidCode(userName, true)) {
            alert(applyLang('msgLoginNameInvalid'));
            return;
        }
        if (!isValidCode(password, true)) {
            alert(applyLang('msgLoginPassInvalid'));
            return;
        }
        if (!isValidCode(tenantCode, true)) {
            alert(applyLang('msgTenantCodeInvalid'));
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

    const doChangeLang = (e) => {
        putLang(e);
        setRefresh(refresh + 1);
    }

    const findLoc = () => {
        console.log("$$$$$ loginPage|findLoc|entering");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const longitude = position.coords.longitude;
                    const latitude = position.coords.latitude;
                    console.log("$$$$$ loginPage|findLoc|succ|" + longitude + "|" + latitude);
                    setLong(longitude);
                    setLati(latitude);
                },
                (error) => {
                    console.log("$$$$$ loginPage|findLoc|error|", error);
                }
            );
        } else {
            console.log("$$$$$ loginPage|geolocation|notExist");
        }
    };

    return (
        <div className="flex-col-cont" style={{alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100%'}}>
                <div className="flex-row-cont" style={{height: 60, width: '35%', background: '#353535', color: 'white', border: '1px solid #353535'}}>
                    <Image className='flex-row-cont' src={logo} height={25} />
                </div>
                <div className="flex-col-cont" style={{height: 425, width: '35%', border: '1px solid #353535'}}>
                    <Space direction='vertical' size={20} style={{width: '90%'}}>
                        <div className="flex-row-cont" style={{alignItems: 'center'}}>
                            <div className="flex-row-cont full-height" style={{alignItems: 'center', justifyContent: 'flex-end', width: '30%'}}>
                                <span>{applyLang("promptLangSelect")}</span>
                            </div>
                            <div className="flex-row-cont full-height" style={{alignItems: 'center', justifyContent: 'flex-start', width: '70%'}}>
                                <Select
                                    onChange={(e) => doChangeLang(e)}
                                    options={[
                                        {
                                            label: '简体中文',
                                            value: 'zh_CN'
                                        },
                                        {
                                            label: 'English',
                                            value: 'en_US'
                                        }
                                    ]}
                                    style={{width: '100%'}}
                                    value={getLang()}
                                />
                            </div>
                        </div>
                        <div className="flex-row-cont">
                            <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'flex-end', width: '30%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptLoginName')}</span></Space>
                            </div>
                            <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'flex-start', width: '70%'}}>
                                <Input placeholder={applyLang('labelLoginName')} onChange={(e) => setUserName(e.target.value)} style={{width: '100%'}}/>
                            </div>
                        </div>
                        <div className="flex-row-cont">
                            <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'flex-end', width: '30%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptLoginPass')}</span></Space>
                            </div>
                            <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'flex-start', width: '70%'}}>
                                <Input.Password placeholder={applyLang('labelLoginPass')} onChange={(e) => setPassword(e.target.value)} style={{width: '100%'}}/>
                            </div>
                        </div>
                        <div className="flex-row-cont">
                            <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'flex-end', width: '30%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptTenant')}</span></Space>
                            </div>
                            <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'flex-start', width: '70%'}}>
                                <Select
                                    onChange={(e) => setTenantCode(e)}
                                    options={tenantList4Select}
                                    placeholder={applyLang('labelPleaseSelect')}
                                    style={{width: '100%'}}
                                    value={tenantCode}
                                />
                            </div>
                        </div>
                        <div className="flex-row-cont">
                            <Space>
                                <Button type="primary" onClick={onClickLogin}>
                                    {applyLang('labelLogin')}
                                </Button>
                                <Button type="primary" onClick={onClickTest}>
                                    临时测试用（请不要点击）
                                </Button>
                            </Space>
                        </div>
                        <div style={{height: 150, width: '100%', background: 'blue'}}>
                            <Map style={{height: '100%', width: '100%'}} center={{lng: long, lat: lati}} zoom="10">
                                <Marker position={{lng: long, lat: lati}} />
                                <ZoomControl />
                            </Map>
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
