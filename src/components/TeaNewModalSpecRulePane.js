import React, { useEffect, useState } from 'react';
import { InputNumber, Select, Space, Table } from 'antd';
import axios from 'axios';

import '../css/common.css';
import { genGetUrlByParams, isArray } from '../js/common';

const TeaNewModalSpecRulePane = (props) => {
    // 变量初始化
    const [selectedSpecList, setSelectedSpecList] = useState([]);
    const [teaSKUList, setTeaSKUList] = useState([]);
    const [selectedToppingList, setSelectedToppingList] = useState([]);
    const [teaToppingAdjustRelList, setTeaToppingAdjustRelList] = useState([]);
    const [actStepList, setActStepList] = useState(isArray(props.actStepList) ? props.actStepList : [
        {
            stepIdx: 1,
            toppingRelList: [
                {
                    toppingCode: 123,
                    toppingName: '芒果酱',
                    measureUnit: 0
                },
                {
                    toppingCode: 456,
                    toppingName: '草莓酱',
                    measureUnit: 1
                },
                {
                    toppingCode: 789,
                    toppingName: '西瓜酱',
                    measureUnit: 0
                }
            ]
        }
    ]);

    // 赋值初始化
    const fetchSpecList = () => {
        let url = genGetUrlByParams('/drinkset/spec/list', {
            tenantCode: 'tenant_001'
        });
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setSelectedSpecList((prev => {
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
    const fetchToppingList = () => {
        let url = genGetUrlByParams('/drinkset/topping/list', {
            tenantCode: 'tenant_001'
        });
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setSelectedToppingList((prev => {
                    let tmp = [];
                    response.data.model.forEach(item => {
                        let toppingTmp = {
                            key: item.toppingCode,
                            toppingName: item.toppingName,
                            toppingCode: item.toppingCode
                        };
                        tmp.push(toppingTmp);
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
    const doGenTeaSKUList = (specSubLists, index, combo, resultList) => {
        if (combo == null || combo == undefined) {
            combo = [];
        }
        if (index == specSubLists.length) {
            let specSubListTmp = [];
            let skuCode = '';
            let skuName = '';
            combo.forEach(f => {
                specSubListTmp.push(f);
                skuCode = skuCode + '-' + f.specSubCode;
                skuName = skuName + '-' + f.specSubName;
            })
            resultList.push({
                teaSKUCode: skuCode.slice(1),
                teaSKUName: skuName.slice(1),
                specSubList: specSubListTmp,
                backgroundColor: 'white'
            });
            return;
        }

        let list = specSubLists[index];
        list.forEach(s => {
            combo.push(s);
            doGenTeaSKUList(specSubLists, index + 1, combo, resultList);
            combo.pop();
        });
    }
    const genTeaSKUList = () => {
        let specSubLists = [];
        selectedSpecList.forEach(selected => {
            specSubLists.push(selected.specSubList);
        });
        let teaSKUListTmp = [];
        doGenTeaSKUList(specSubLists, 0, null, teaSKUListTmp);
        setTeaSKUList(prev => {
            return teaSKUListTmp;
        });
    }
    useEffect(() => {
        genTeaSKUList();
    }, [selectedSpecList]);
    useEffect(() => {
    }, [teaSKUList]);

    // TeaSKU 操作
    const onClickTeaSKU = (e, teaSKUCode) => {
        setTeaSKUList(prev => {
            let tmp = [];
            teaSKUList.forEach(item => {
                if (item.teaSKUCode == teaSKUCode) {
                    item.backgroundColor = '#145CFE';
                    item.textColor = 'white'
                } else {
                    item.backgroundColor = 'white';
                    item.textColor = '#818181';
                }
                tmp.push(item);
            });
            return tmp;
        })
        
    }

    // 标准配方相关
    const [commonToppingTableData, setCommonToppingTableData] = useState([
        {
            key: '1',
            step: '1',
            materialName: '牛奶',
            actualWeight: 20,
            actions: ['编辑', '删除']
        },
        {
            key: '2',
            step: '1',
            materialName: '绿茶',
            actualWeight: 30,
            actions: ['编辑', '删除']
        }
    ]);
    const toppingAdjustCols = [
        {
            title: '步骤',
            dataIndex: 'stepIdx',
            key: 'stepIdx',
        },
        {
            title: '物料',
            dataIndex: 'toppingName',
            key: 'toppingName',
        },
        {
            title: '修改',
            dataIndex: 'adjustMethod',
            key: 'adjustMethod',
            render: (_, {}) => (
                <Select
                    size="small"
                    style={{width: '100%'}}
                    options={[
                        {
                            label: '增加',
                            value: 'add'
                        },
                        {
                            label: '减少',
                            value: 'reduce'
                        }
                    ]}
                />
            ),
        },
        {
            title: '百分比/固定值',
            dataIndex: 'adjustUnit',
            key: 'adjustUnit',
            render: (_, { }) => (
                <Select
                    size="small"
                    style={{width: '100%'}}
                    options={[
                        {
                            label: '固定值',
                            value: 'fix'
                        },
                        {
                            label: '百分比',
                            value: 'per'
                        }
                    ]}
                />
            ),
        },
        {
            title: '数值',
            dataIndex: 'adjustAmount',
            key: 'adjustAmount',
            render: (_, { keepTempe }) => (
                <InputNumber min={1} max={10000} defaultValue={0} onChange={onAdjustNumChange} size="small" />
            ),
        },
        {
            title: '实际用量',
            dataIndex: 'actualAmount',
            key: 'actualAmount'
        },
        {
            title: '操作',
            dataIndex: 'actions',
            key: 'actions',
            render: (_, { actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    return (
                        <a>{action}</a>
                    );
                })}
                </Space>
            ),
        }
    ]
    const onAdjustNumChange = (e) => {
    }

    return (
        <div class="flex-col-cont" style={{height: 340, width: '100%'}}>
            <div class="flex-row-cont" style={{justifyContent: 'flex-start', height: '10%', width: '100%'}}>
                <span style={{color: 'black', fontWeight: 'bold'}}>搭配规则：</span>
            </div>
            <div class="flex-row-cont" style={{justifyContent: 'flex-start', height: '90%', width: '100%'}}>
                <div style={{height: '100%', width: '29%', overflowY: 'auto'}}>
                    <Space direction='vertical' size='small' style={{height: '100%', width: '100%'}}>
                        {teaSKUList.map(teaSKU => {
                            return (
                                <div style={{height: 50, width: '99%', borderRadius: 5, backgroundColor: teaSKU.backgroundColor, color: teaSKU.textColor}} onClick={(e) => onClickTeaSKU(e, teaSKU.teaSKUCode)}>
                                    <span class="flex-row-cont" style={{height: '100%', lineHeight: 1.5, overflowWrap: 'break-word'}}>
                                        {teaSKU.teaSKUName}
                                    </span>
                                </div>
                            )
                        })}
                    </Space>
                </div>
                <div style={{height: '100%', width: '2%'}}>&nbsp;</div>
                <div class="flex-col-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-start', height: '100%', width: '69%'}}>
                    <Table columns={toppingAdjustCols} dataSource={commonToppingTableData} size='small' style={{width: '100%'}} />
                </div>
            </div>
        </div>
    );
};

export default TeaNewModalSpecRulePane;