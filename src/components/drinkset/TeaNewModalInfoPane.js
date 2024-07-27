import React, { useEffect, useState } from 'react';
import { Input, Select, Switch } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { isBlankObj, isBlankStr, genGetUrlByParams } from '../../js/common.js';

const { TextArea } = Input;

const TeaNewModalInfoPane = (props) => {
    // 状态变量初始化相关
    const [teaCode, setTeaCode] = useState(() => {
        if (isBlankObj(props.tea4Edit)) {
            return '';
        }
        if (isBlankObj(props.tea4Edit.teaCode)) {
            return '';
        }
        return props.tea4Edit.teaCode;
    });
    const [teaName, setTeaName] = useState(() => {
        if (isBlankObj(props.tea4Edit)) {
            return '';
        }
        if (isBlankObj(props.tea4Edit.teaName)) {
            return '';
        }
        return props.tea4Edit.teaName;
    });
    const [outerTeaCode, setOuterTeaCode] = useState(() => {
        if (isBlankObj(props.tea4Edit)) {
            return '';
        }
        if (isBlankObj(props.tea4Edit.outerTeaCode)) {
            return '';
        }
        return props.tea4Edit.outerTeaCode;
    });
    const [teaTypeCode, setTeaTypeCode] = useState(() => {
        if (isBlankObj(props.tea4Edit)) {
            return '';
        }
        if (isBlankObj(props.tea4Edit.teaTypeCode)) {
            return '';
        }
        return props.tea4Edit.teaTypeCode;
    });
    const [state, setState] = useState(() => {
        if (isBlankObj(props.tea4Edit)) {
            return '';
        }
        if (isBlankObj(props.tea4Edit.state)) {
            return '';
        }
        return props.tea4Edit.state;
    });
    const [comment, setComment] = useState(() => {
        if (isBlankObj(props.tea4Edit)) {
            return '';
        }
        if (isBlankObj(props.tea4Edit.comment)) {
            return '';
        }
        return props.tea4Edit.comment;
    });
    const [teaTypeList4Select, setTeaTypeList4Select] = useState(() => {
        let url = genGetUrlByParams('/drinkset/tea/type/list', {
            tenantCode: 'tenant_001'
        });
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setTeaTypeList4Select((prev => {
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
    });

    // 输入相关
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
                    <Input placeholder="茶品编码" onChange={(e) => setTeaCode(e.target.value)} value={teaCode}/>
                </div>
                <div style={{height: '100%', width: '10%'}}></div>
                <div className="flex-row-cont" style={{height: '100%', width: '45%'}}>
                    <Input placeholder="茶品名称" onChange={(e) => setTeaName(e.target.value)} value={teaName}/>
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
                    <Input placeholder="外部茶品编码" onChange={(e) => setOuterTeaCode(e.target.value)} value={outerTeaCode}/>
                </div>
                <div style={{height: '100%', width: '10%'}}></div>
                <div className="flex-row-cont" style={{height: '100%', width: '45%'}}>
                    <Select
                        onChange={(e) => setTeaTypeCode(e)}
                        options={teaTypeList4Select}
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
                    <Switch checkedChildren="启用" unCheckedChildren="禁用" checked={state === 1 ? true : false} onChange={(e) => setState(e ? 1 : 0)} />
                </div>
            </div>

            <div className="flex-row-cont" style={{height: 35, width: '98%'}}>
                <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%', width: '100%'}}>
                    <span>备注：</span>
                </div>
            </div>
            <div className="flex-row-cont" style={{height: 70, width: '98%'}}>
                <div className="flex-row-cont" style={{height: '100%', width: '100%'}}>
                    <TextArea placeholder="备注" onChange={(e) => setComment(e.target.value)} maxLength={200} rows={2} value={comment}/>
                </div>
            </div>
        </div>
    );
};

export default TeaNewModalInfoPane;