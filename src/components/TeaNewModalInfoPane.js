import React, { useEffect, useState } from 'react';
import { Input, Select, Switch } from 'antd';
import axios from 'axios';

import '../css/common.css';
import { isBlankObj, isBlankStr, genGetUrlByParams } from '../js/common.js';

const { TextArea } = Input;

const TeaNewModalInfoPane = (props) => {
    // console.log('$$$$$ TeaNewModalInfoPane#entering props.teaCode4Edit=' + props.teaCode4Edit);
    // console.log('$$$$$ TeaNewModalInfoPane#entering props.teaName4Edit=' + props.teaName4Edit);
    // console.log('$$$$$ TeaNewModalInfoPane#entering props.outerTeaCode4Edit=' + props.outerTeaCode4Edit);
    // console.log('$$$$$ TeaNewModalInfoPane#entering props.teaTypeCode4Edit=' + props.teaTypeCode4Edit);

    // 状态变量初始化相关
    const [teaCode, setTeaCode] = useState(isBlankStr(props.teaCode4Edit) ? '' : props.teaCode4Edit);
    const [teaName, setTeaName] = useState(isBlankStr(props.teaName4Edit) ? '' : props.teaName4Edit);
    const [outerTeaCode, setOuterTeaCode] = useState(isBlankStr(props.outerTeaCode4Edit) ? '' : props.outerTeaCode4Edit);
    const [teaTypeCode, setTeaTypeCode] = useState(isBlankStr(props.teaTypeCode4Edit) ? '' : props.teaTypeCode4Edit);
    const [state, setState] = useState(isBlankObj(props.state4Edit) ? 0 : props.state4Edit);
    const [comment, setComment] = useState(isBlankStr(props.comment4Edit) ? '' : props.comment4Edit);

    // 待选择数据初始化相关
    const [teaTypeList, setTeaTypeList] = useState([]);

    // 赋值初始化相关
    const fetchTeaTypeList = () => {
        let url = genGetUrlByParams('/drinkset/tea/type/list', {
            tenantCode: 'tenant_001'
        });
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setTeaTypeList((prev => {
                    let teaTypeListTmp = [];
                    response.data.model.forEach(item => {
                        teaTypeListTmp.push({
                            key: item.teaTypeCode,
                            label: item.teaTypeName,
                            value: item.teaTypeCode
                        });
                    })
                    return teaTypeListTmp;
                }));
            }
        })
        .catch(error => {
            // console.error('error: ', error);
            // console.error('error.response: ', error.response);
            // console.error('error.response.status: ', error.response.status);
            if (error && error.response && error.response.status === 401) {
                // window.location.href="/gxadmin/login";
            }
        });
    }
    useEffect(() => {
        fetchTeaTypeList();
    }, []);

    // 输入相关
    const onChangeTeaCode = (e) => {
        setTeaCode(e.target.value);
    }
    const onChangeTeaName = (e) => {
        setTeaName(e.target.value);
    }
    const onChangeOuterTeaCode = (e) => {
        setOuterTeaCode(e.target.value);
    }
    const onChangeState = (e) => {
        setState(e ? 1 : 0);
    }
    const onChangeTeaTypeCode = (e) => {
        setTeaTypeCode(e);
    }
    const onChangeComment = (e) => {
        setComment(e.target.value);
    }
    useEffect(() => {
        props.updateInfo(teaCode, teaName, outerTeaCode, teaTypeCode, state, comment);
    }, [teaCode, teaName, outerTeaCode, teaTypeCode, state, comment]);

    return (
        <div className="flex-col-cont" style={{justifyContent: 'flex-start', height: '100%', width: '100%'}}>
            <div className="flex-row-cont" style={{height: 35, width: '98%'}}>
                <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%', width: '45%'}}>
                    <span>茶品编码：</span>
                </div>
                <div style={{height: '100%', width: '10%'}}></div>
                <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%', width: '45%'}}>
                    <span>茶品名称：</span>
                </div>
            </div>
            <div className="flex-row-cont" style={{height: 35, width: '98%'}}>
                <div className="flex-row-cont" style={{height: '100%', width: '45%'}}>
                    <Input placeholder="茶品编码" onChange={onChangeTeaCode} value={teaCode}/>
                </div>
                <div style={{height: '100%', width: '10%'}}></div>
                <div className="flex-row-cont" style={{height: '100%', width: '45%'}}>
                    <Input placeholder="茶品名称" onChange={onChangeTeaName} value={teaName}/>
                </div>
            </div>

            <div className="flex-row-cont" style={{height: 35, width: '98%'}}>
                <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%', width: '45%'}}>
                    <span>外部茶品编码：</span>
                </div>
                <div style={{height: '100%', width: '10%'}}></div>
                <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%', width: '45%'}}>
                    <span>茶品类型：</span>
                </div>
            </div>
            <div className="flex-row-cont" style={{height: 35, width: '98%'}}>
                <div className="flex-row-cont" style={{height: '100%', width: '45%'}}>
                    <Input placeholder="外部茶品编码" onChange={onChangeOuterTeaCode} value={outerTeaCode}/>
                </div>
                <div style={{height: '100%', width: '10%'}}></div>
                <div className="flex-row-cont" style={{height: '100%', width: '45%'}}>
                    <Select
                        onChange={onChangeTeaTypeCode}
                        options={teaTypeList}
                        style={{width: '100%'}}
                        value={teaTypeCode}
                    />
                </div>
            </div>

            <div className="flex-row-cont" style={{height: 35, width: '98%'}}>
                <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%', width: '100%'}}>
                    <span>茶品状态：</span>
                </div>
            </div>
            <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: 35, width: '98%'}}>
                <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%', width: '98%'}}>
                    <Switch checkedChildren="启用" unCheckedChildren="禁用" checked={state === 1 ? true : false} onChange={onChangeState} />
                </div>
            </div>

            <div className="flex-row-cont" style={{height: 35, width: '98%'}}>
                <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%', width: '100%'}}>
                    <span>备注：</span>
                </div>
            </div>
            <div className="flex-row-cont" style={{height: 70, width: '98%'}}>
                <div className="flex-row-cont" style={{height: '100%', width: '100%'}}>
                    <TextArea placeholder="备注" onChange={onChangeComment} maxLength={200} rows={2} value={comment}/>
                </div>
            </div>
        </div>
    );
};

export default TeaNewModalInfoPane;