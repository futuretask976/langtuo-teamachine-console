import React, { useEffect, useState } from 'react';
import { Button, Select, Space } from 'antd';
import axios from 'axios';

import '../css/common.css';
import { genGetUrlByParams, isArray } from '../js/common';

const TeaNewModalSpecPane = (props) => {
    // 数据初始化
    const [specList, setSpecList] = useState([]);
    const [selectedSpecList, setSelectedSpecList] = useState([]);
    const fetchSpecList = () => {
        let url = genGetUrlByParams('/drinkset/spec/list', {
            tenantCode: 'tenant_001'
        });
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setSpecList((prev => {
                    let tmp = [];
                    response.data.model.forEach(item => {
                        let specTmp = {
                            key: item.specCode,
                            specName: item.specName,
                            specCode: item.specCode
                        };
                        let specSubListTmp = [];
                        if (isArray(item.specSubList)) {
                            item.specSubList.forEach(subItem => {
                                specSubListTmp.push({
                                    specSubCode: subItem.specSubCode,
                                    specSubName: subItem.specSubName
                                });
                            });
                        }
                        specTmp.specSubList = specSubListTmp;
                        tmp.push(specTmp);
                    })
                    return tmp;
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
        fetchSpecList();
    }, []);

    // 下拉框相关
    const [selectedSpecCodeList, setSelectedSpecCodeList] = useState([]);
    const onChangeSpec = (e) => {
        setSelectedSpecCodeList(prev => {
            return e;
        });

        setSelectedSpecList(prev => {
            let tmp = [];
            specList.forEach(spec => {
                e.forEach(selectedSpecCode => {
                    if (spec.specCode == selectedSpecCode) {
                        tmp.push(spec);
                    }
                });
            });
            return tmp;
        });
    }
    const convertToSpecOptionList = () => {
        let tmp = [];
        specList.forEach(item => {
            tmp.push({
                label: item.specName,
                value: item.specCode
            })
        });
        return tmp;
    }

    return (
        <div class="flex-col-cont" style={{justifyContent: 'flex-start', height: '100%', width: '100%'}}>
            <div class="flex-row-cont" style={{height: '15%', width: '98%', border: '0px solid green'}}>
                <div class="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%', width: '10%'}}>
                    可选规格：
                </div>
                <div class="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%', width: '90%'}}>
                    <Select
                        mode="multiple"
                        placeholder="请选择"
                        size="middle"
                        value={selectedSpecCodeList}
                        style={{width: '100%'}}
                        onChange={onChangeSpec}
                        options={convertToSpecOptionList()}
                    />
                </div>
            </div>
            <div class="flex-col-cont" style={{justifyContent: 'flex-start', height: '85%', width: '98%', overflow: 'auto'}}>
                <Space direction="vertical" size="small" style={{width: '100%'}}>
                    {selectedSpecList.map((spec) => (
                        <div class="flex-col-cont" style={{height: 75, width: '100%', background: '#FFFFFF', borderRadius: 5}}>
                            <div class="flex-row-cont" style={{justifyContent: 'flex-start', height: 30, width: '100%', color: 'black'}}>
                                <span>{spec.specName}：</span>
                            </div>
                            <div class="flex-row-cont" style={{justifyContent: 'flex-start', height: 45, width: '100%'}}>
                                <Space size="small">
                                    {spec.specSubList.map((specSub) => (
                                        <Button size='middle'>{specSub.specSubName}</Button>
                                    ))}
                                </Space>
                            </div>
                        </div>
                    ))}
                </Space>
            </div>
        </div>
    );
};

export default TeaNewModalSpecPane;