import React, { useEffect, useState } from 'react';
import { Button, Select, Space } from 'antd';

import '../../css/common.css';
import { getTenantCode, isArray } from '../../js/common';
import { get } from '../../js/request.js';

const TeaNewModalSpecPane = (props) => {
    // 数据定义
    const [specList4Select, setSpecList4Select] = useState();
    const [specRuleList, setSpecRuleList] = useState(() => {
        if (isArray(props.specRuleList4Edit)) {
            return props.specRuleList4Edit;
        }
        return [];
    });
    

    // 动作定义
    const fetchSpecList4Select = () => {
        get('/drinkset/spec/list', {
            tenantCode: getTenantCode()
        }).then(respData => {
            setSpecList4Select((prev => {
                let tmp = [];
                if (isArray(respData.model)) {
                    respData.model.forEach(item => {
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
                    });
                }
                return tmp;
            }));
        });
    }
    useEffect(() => {
        fetchSpecList4Select();
    }, []);

    // 表格定义
    const onChangeSpec = (selectedList) => {
        setSpecRuleList(prev => {
            let specRuleListTmp = [];
            specList4Select.forEach(spec => {
                selectedList.forEach(selectedSpecCode => {
                    if (spec.specCode == selectedSpecCode) {
                        let specItemRuleList = [];
                        spec.specItemList.forEach(specItem => {
                            specItemRuleList.push({
                                specCode: selectedSpecCode,
                                specItemCode: specItem.specItemCode,
                                specItemName: specItem.specItemName,
                                outerSpecItemCode: specItem.outerSpecItemCode
                            });
                        });
                        specRuleListTmp.push({
                            specCode: spec.specCode,
                            specName: spec.specName,
                            state: spec.state,
                            specItemRuleList: specItemRuleList
                        });
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
        <div className="flex-col-cont" style={{justifyContent: 'flex-start', height: '100%', width: '100%'}}>
            <div className="flex-row-cont" style={{height: '15%', width: '98%', border: '0px solid green'}}>
                <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%', width: '10%'}}>
                    可选规格：
                </div>
                <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%', width: '90%'}}>
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
            <div className="flex-col-cont" style={{justifyContent: 'flex-start', height: '85%', width: '98%', overflow: 'auto'}}>
                <Space direction="vertical" size="small" style={{width: '100%'}}>
                    {specRuleList.map((specRule) => (
                        <div className="flex-col-cont" style={{height: 75, width: '100%', background: '#FFFFFF', borderRadius: 5}}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: 30, width: '100%', color: 'black'}}>
                                <span>{specRule.specName}：</span>
                            </div>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: 45, width: '100%'}}>
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