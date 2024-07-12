import React, { useEffect, useState } from 'react';
import { Button, Select, Space, Table } from 'antd';
import axios from 'axios';

import '../css/common.css';
import { isArray, genGetUrlByParams } from '../js/common.js';

const TeaNewModalActStepPane = (props) => {
    // 状态变量初始化相关
    const [actStepList, setActStepList] = useState(isArray(props.actStepList4Edit) ? props.actStepList4Edit : []);
    const [stepIdx, setStepIdx] = useState(() => {
        let stepIdx = 0;
        if(isArray(props.actStepList)) {
            props.actStepList.forEach(item => {
                if (item.stepIdx > stepIdx) {
                    stepIdx = item.stepIdx;
                }
            });
        }
        return stepIdx + 1;
    });

    // 待选择数据初始化相关
    const [toppingList, setToppingList] = useState([]);

    // 赋值初始化相关
    const fetchToppingList = () => {
        let url = genGetUrlByParams('/drinkset/topping/list', {
            tenantCode: 'tenant_001'
        });
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setToppingList((prev => {
                    let toppingListTmp = [];
                    response.data.model.forEach(item => {
                        let toppingTmp = {...item};
                        toppingTmp.key = item.toppingCode;
                        toppingTmp.label = item.toppingName;
                        toppingTmp.value = item.toppingCode;
                        toppingListTmp.push(toppingTmp);
                    })
                    return toppingListTmp;
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
        fetchToppingList();
    }, []);

    // 物料表格展示相关
    const actStepListCols = [
        {
            title: '步骤',
            dataIndex: 'stepIdx',
            key: 'stepIdx',
            width: '10%'
        },
        {
            title: '物料',
            dataIndex: 'toppingList',
            key: 'toppingList',
            width: '90%',
            render: (_, {stepIdx, toppingRelList}) => (
                <Select
                    placeholder="请选择"
                    mode="multiple"
                    onChange={(e) => onChangeToppingCode(e, stepIdx)}
                    options={toppingList}
                    size="middle"
                    style={{width: '100%'}}
                    value={convertToppingRelList(toppingRelList)}
                />
            ),
        }
    ];
    const convertToppingRelList = (toppingRelList) => {
        let tmp = [];
        if (!isArray(toppingRelList)) {
            return tmp;
        }
        toppingRelList.forEach(item => {
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
                stepIdx: stepIdx,
                toppingRelList: []
            });
            setStepIdx(stepIdx + 1);
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
            setStepIdx(stepIdx - 1);
            return tmp;
        }));
    }
    const onChangeToppingCode = (e, stepIdx) => {
        setActStepList((prev => {
            let tmp = [];
            prev.forEach((actStep) => {
                if (actStep.stepIdx == stepIdx) {
                    let toppingRelList = [];
                    e.forEach(toppingCode => {
                        let toppingTmp = findToppingByCode(toppingCode);
                        toppingRelList.push(toppingTmp);
                    })
                    actStep.toppingRelList = toppingRelList;
                    tmp.push(actStep)
                } else {
                    tmp.push(actStep)
                }
            });
            return tmp;
        }));
    }
    const findToppingByCode = (toppingCode) => {
        let found = null;
        toppingList.forEach(item => {
            if (item.toppingCode == toppingCode) {
                found = item;
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
                    rowKey='stepIdx'/>
            </div>
        </div>
    );
};

export default TeaNewModalActStepPane;