import React, { useEffect, useState } from 'react';
import { Button, Select, Space, Table } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { isArray, genGetUrlByParams, handleRespError, getRespModel, getTenantCode, getJwtToken } from '../../js/common.js';

const TeaNewModalActStepPane = (props) => {
    // 状态变量初始化相关
    const [actStepList, setActStepList] = useState(() => {
        if (isArray(props.actStepList4Edit)) {
            return props.actStepList4Edit;
        }
        return [];
    });
    const [stepIndex, setStepIndex] = useState(() => {
        let stepIndex = 0;
        if(isArray(props.actStepList4Edit)) {
            stepIndex = props.actStepList4Edit.length;
        }
        return stepIndex + 1;
    });
    const [toppingList4Select, setToppingList4Select] = useState([]);
    const fetchToppingList4Select = () => {
        let url = genGetUrlByParams('/drinkset/topping/list', {
            tenantCode: getTenantCode()
        });
        axios.get(url, {
            // withCredentials: true, // 这会让axios在请求中携带cookies
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setToppingList4Select((prev => {
                let toppingList4SelectTmp = [];
                model.forEach(item => {
                    let toppingTmp = {...item};
                    toppingTmp.key = item.toppingCode;
                    toppingTmp.label = item.toppingName;
                    toppingTmp.value = item.toppingCode;
                    toppingList4SelectTmp.push(toppingTmp);
                })
                return toppingList4SelectTmp;
            }));
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    useEffect(() => {
        fetchToppingList4Select();
    }, []);

    // 物料表格展示相关
    const actStepListCols = [
        {
            title: '步骤',
            dataIndex: 'stepIndex',
            key: 'stepIndex',
            width: '10%'
        },
        {
            title: '物料',
            dataIndex: 'toppingList4Select',
            key: 'toppingList4Select',
            width: '90%',
            render: (_, {stepIndex, toppingBaseRuleList}) => (
                <Select
                    placeholder="请选择"
                    mode="multiple"
                    onChange={(e) => onChangeToppingCodeList(e, stepIndex)}
                    options={toppingList4Select}
                    size="middle"
                    style={{width: '100%'}}
                    value={convertToSelectedToppingCodeList(toppingBaseRuleList)}
                />
            ),
        }
    ];
    const convertToSelectedToppingCodeList = (toppingBaseRuleList) => {
        let tmp = [];
        if (!isArray(toppingBaseRuleList)) {
            return tmp;
        }
        toppingBaseRuleList.forEach(item => {
            tmp.push(item.toppingCode);
        })
        return tmp;
    }

    // 输入相关
    const onClickAddStep = (e) => {
        setActStepList((prev => {
            let tmp = [];
            prev.forEach((actStep) => (
                tmp.push(actStep)
            ));
            tmp.push({
                stepIndex: stepIndex,
                toppingBaseRuleList: []
            });
            setStepIndex(stepIndex + 1);
            return tmp;
        }));
    }
    const onClickDeleteStep = (e) => {
        setActStepList((prev => {
            let tmp = [];
            prev.forEach((actStep) => {
                tmp.push(actStep)
            });
            tmp.pop();
            setStepIndex(stepIndex - 1);
            return tmp;
        }));
    }
    const onChangeToppingCodeList = (selecedList, stepIndex) => {
        setActStepList((prev => {
            let tmp = [];
            prev.forEach((actStep) => {
                if (actStep.stepIndex == stepIndex) {
                    let toppingBaseRuleList = [];
                    selecedList.forEach(toppingCode => {
                        let toppingTmp = findToppingByCode(toppingCode);
                        toppingBaseRuleList.push(toppingTmp);
                    })
                    actStep.toppingBaseRuleList = toppingBaseRuleList;
                    tmp.push(actStep)
                } else {
                    tmp.push(actStep)
                }
            });
            return tmp;
        }));
    }
    const findToppingByCode = (toppingCode) => {
        let found = {};
        toppingList4Select.forEach(item => {
            if (item.toppingCode == toppingCode) {
                found.toppingCode = item.toppingCode;
                found.toppingName = item.toppingName;
                found.measureUnit = item.measureUnit;
                found.state = item.state;
            }
        });
        return found;
    }
    useEffect(() => {
        props.updateActStepList(actStepList);
    }, [actStepList]);

    return (
        <div className="flex-col-cont" style={{height: '100%', width: '100%'}}>
            <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: '15%', width: '98%'}}>
                <Space>
                    <Button key="addStep" onClick={onClickAddStep} type="primary" style={{height: 35, width: 100}}>新增步骤</Button>
                    <Button key="reduceStep" onClick={onClickDeleteStep} type="primary" style={{height: 35, width: 100}}>删减步骤</Button>
                </Space>
            </div>
            <div className="flex-row-cont" style={{alignItems: 'flex-start', height: '85%', width: '98%'}}>
                <Table 
                    columns={actStepListCols} 
                    dataSource={actStepList} 
                    pagination={false} 
                    scroll={{ y: 250 }} 
                    size='small' 
                    style={{height: '100%', width: '100%'}} 
                    rowKey='stepIndex'/>
            </div>
        </div>
    );
};

export default TeaNewModalActStepPane;