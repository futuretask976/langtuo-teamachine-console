import React, { useEffect, useState } from 'react';
import { Button, Select, Space } from 'antd';

import '../../css/common.css';
import { getTenantCode, isArray } from '../../js/common';
import { get } from '../../js/request.js';

const TeaNewModalSpecPane = (props) => {
    // 数据定义
    const [specList4Select, setSpecList4Select] = useState();
    const [specRuleList, setSpecRuleList] = useState([]);

    // 动作定义
    const refreshSelected4SpecList = (specListTmp) => {
        let specRuleList4Edit = props.specRuleList4Edit;
        if (!isArray(specRuleList4Edit)) {
            return;
        }

        specListTmp.forEach(spec => {
            let selectedSpec = false;
            specRuleList4Edit.forEach(specRule4Edit => {
                if (spec.specCode == specRule4Edit.specCode) {
                    selectedSpec = true;
                }
            });
            spec.selected = selectedSpec;
        });
    }
    const fetchSpecList4Select = () => {
        get('/drinkset/spec/list', {
            tenantCode: getTenantCode()
        }).then(respData => {
            setSpecList4Select(prev => {
                let tmp = [];
                if (isArray(respData.model)) {
                    respData.model.forEach(spec => {
                        let specTmp = {
                            key: spec.specCode,
                            specName: spec.specName,
                            specCode: spec.specCode,
                            label: spec.specName,
                            value: spec.specCode,
                            selected: false
                        };
                        let specItemListTmp = [];
                        if (isArray(spec.specItemList)) {
                            spec.specItemList.forEach(specItem => {
                                specItemListTmp.push({
                                    specCode: spec.specCode,
                                    specName: spec.specName,
                                    specItemCode: specItem.specItemCode,
                                    specItemName: specItem.specItemName,
                                    outerSpecItemCode: specItem.outerSpecItemCode,
                                    selected: false
                                });
                            });
                        }
                        specTmp.specItemList = specItemListTmp;
                        tmp.push(specTmp);
                    });
                }

                refreshSelected4SpecList(tmp);
                refreshSpecRuleList(tmp);
                return tmp;
            });
        });
    }
    useEffect(() => {
        fetchSpecList4Select();
    }, []);

    // 表格定义
    const onChangeSpec = (selectedSpecCodeList) => {
        setSpecList4Select(prev => {
            let tmp = [...prev];
            tmp.forEach(spec => {
                let selectedSpec = false;
                selectedSpecCodeList.forEach(selectedSpecCode => {
                    if (spec.specCode == selectedSpecCode) {
                        selectedSpec = true;
                    }
                });
                spec.selected = selectedSpec;
            });

            refreshSpecRuleList(tmp);
            return tmp;
        });
    }
    const convertToSelectedSpecCode = () => {
        let tmp = [];
        specRuleList.forEach(specRule => {
            tmp.push(specRule.specCode);
        });
        return tmp;
    }
    const onClickSpecItem = (selectedSpecCode, selectedSpecItemCode) => {
        setSpecRuleList(prev => {
            let tmp = [...prev];
            tmp.forEach(specRule => {
                if (specRule.specCode == selectedSpecCode) {
                    specRule.specItemRuleList.forEach(specItemRule => {
                        if (specItemRule.specItemCode == selectedSpecItemCode) {
                            specItemRule.selected = specItemRule.selected ? false : true;
                        }
                    });
                }
            });
            return tmp;
        });
    }
    const refreshSpecRuleList = (specListTmp) => {
        setSpecRuleList(prev => {
            let tmp = [];
            specListTmp.forEach(spec => {
                if (spec.selected) {
                    let specRule = {
                        specCode: spec.specCode,
                        specName: spec.specName,
                        selected: true,
                        specItemRuleList: spec.specItemList
                    };
                    tmp.push(specRule);

                    let specRuleList4Edit = props.specRuleList4Edit;
                    if (isArray(specRuleList4Edit)) {
                        specRule.specItemRuleList.forEach(specItemRule => {
                            let selectedSpecItemRule = false;
                            specRuleList4Edit.forEach(specRule4Edit => {
                                specRule4Edit.specItemRuleList.forEach(specItemRule4Edit => {
                                    if (specItemRule.specItemCode == specItemRule4Edit.specItemCode) {
                                        selectedSpecItemRule = true;
                                    }
                                });
                            });
                            specItemRule.selected = selectedSpecItemRule;
                        })
                    }
                }
            });
            return tmp;
        });
    }
    const convertToSpecItemRuleList = () => {
        let tmp = [];
        specRuleList.forEach(specRule => {
            specRule.specItemRuleList.forEach(specItemRule => {
                if (specItemRule.selected) {
                    tmp.push(specItemRule);
                }
            });
        });
        return tmp;

    }
    const filterSpecRuleList = () => {
        let specRuleListTmp = [];
        specRuleList.forEach(specRule => {
            let specRuleTmp = {...specRule};
            specRuleTmp.specItemRuleList = specRuleTmp.specItemRuleList
                    .filter(specItemRule => specItemRule.selected);
            specRuleListTmp.push(specRuleTmp);
        });
        return specRuleListTmp;
    }
    useEffect(() => {
        props.updateSpecRuleList(filterSpecRuleList());
        props.updateSpecItemRuleList(convertToSpecItemRuleList());
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
                        <div key={specRule.specCode} className="flex-col-cont" style={{height: 75, width: '100%', background: '#FFFFFF', borderRadius: 5}}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: 30, width: '100%', color: 'black'}}>
                                <span>{specRule.specName}：</span>
                            </div>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: 45, width: '100%'}}>
                                <Space size="small">
                                    {specRule.specItemRuleList.map((specItemRule) => (
                                        <Button key={specItemRule.specItemCode} onClick={(e) => onClickSpecItem(specRule.specCode, specItemRule.specItemCode)} size='middle' style={{ backgroundColor: specItemRule.selected ? '#353535' : 'white', color: specItemRule.selected ? 'white' : 'black' }}>{specItemRule.specItemName}</Button>
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