import React, { useEffect, useState } from 'react';
import { Button, Select, Space } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { genGetUrlByParams, isArray } from '../../js/common';

const TeaNewModalSpecPane = (props) => {
    // 状态变量初始化相关
    const [specRuleList, setSpecRuleList] = useState(isArray(props.specRuleList4Edit) ? props.specRuleList4Edit : []);

    // 待选择数据初始化相关
    const [specList4Select, setSpecList4Select] = useState([]);

    // 赋值初始化相关
    const fetchSpecList4Select = () => {
        let url = genGetUrlByParams('/drinkset/spec/list', {
            tenantCode: 'tenant_001'
        });
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setSpecList4Select((prev => {
                    let tmp = [];
                    response.data.model.forEach(item => {
                        let specTmp = {
                            key: item.specCode,
                            specName: item.specName,
                            specCode: item.specCode,
                            label: item.specName,
                            value: item.specCode
                        };
                        let specItemListTmp = [];
                        if (isArray(item.specItemList)) {
                            item.specItemList.forEach(specItem => {
                                specItemListTmp.push({
                                    specItemCode: specItem.specItemCode,
                                    specItemName: specItem.specItemName,
                                    outerSpecItemCode: specItem.outerSpecItemCode
                                });
                            });
                        }
                        specTmp.specItemList = specItemListTmp;
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
        fetchSpecList4Select();
    }, []);

    // 表格操作相关
    const onChangeSpec = (e) => {
        setSpecRuleList(prev => {
            let specRuleListTmp = [];
            specList4Select.forEach(spec => {
                e.forEach(selectedSpecCode => {
                    if (spec.specCode == selectedSpecCode) {
                        let specRuleTmp = {...spec};
                        specRuleTmp.specItemRuleList = [...spec.specItemList];
                        specRuleListTmp.push(specRuleTmp);
                    }
                });
            });
            return specRuleListTmp;
        });
    }
    const convertToSelectedSpecCode = () => {
        let tmp = [];
        specRuleList.forEach(specRule => {
            tmp.push(specRule.specCode);
        });
        return tmp;
    }
    const onClickSpecItem = (specCode, selectedSpecItemCode) => {
        setSpecRuleList(prev => {
            let tmp = [...prev];
            tmp.forEach(specRule => {
                if (specRule.specCode == specCode) {
                    specRule.specItemRuleList.forEach(specItemRule => {
                        if (specItemRule.specItemCode == selectedSpecItemCode) {
                            console.log("$$$$$ selectedSpecItemCode=" + selectedSpecItemCode + ", specItemRule.selected="+ specItemRule.selected)
                            specItemRule.selected = (specItemRule.selected == 1 ? 0 : 1);
                        }
                    })
                }
            });
            return tmp;
        });
    }
    useEffect(() => {
        props.updateSpecRuleList(specRuleList);
    }, [specRuleList]);

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
                        value={convertToSelectedSpecCode()}
                        style={{width: '100%'}}
                        onChange={onChangeSpec}
                        options={specList4Select}
                    />
                </div>
            </div>
            <div class="flex-col-cont" style={{justifyContent: 'flex-start', height: '85%', width: '98%', overflow: 'auto'}}>
                <Space direction="vertical" size="small" style={{width: '100%'}}>
                    {specRuleList.map((specRule) => (
                        <div class="flex-col-cont" style={{height: 75, width: '100%', background: '#FFFFFF', borderRadius: 5}}>
                            <div class="flex-row-cont" style={{justifyContent: 'flex-start', height: 30, width: '100%', color: 'black'}}>
                                <span>{specRule.specName}：</span>
                            </div>
                            <div class="flex-row-cont" style={{justifyContent: 'flex-start', height: 45, width: '100%'}}>
                                <Space size="small">
                                    {specRule.specItemRuleList.map((specItemRule) => (
                                        <Button onClick={(e) => onClickSpecItem(specRule.specCode, specItemRule.specItemCode)} size='middle' style={{ backgroundColor: 1 == specItemRule.selected ? '#145CFE' : 'white', color: 1 == specItemRule.selected ? 'white' : 'black' }}>{specItemRule.specItemName}</Button>
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