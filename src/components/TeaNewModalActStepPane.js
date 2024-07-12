import React, { useEffect, useState } from 'react';
import { Button, Select, Space, Table } from 'antd';
import axios from 'axios';

import '../css/common.css';
import { genGetUrlByParams } from '../js/common.js';

const TeaNewModalActStepPane = (props) => {
    // 数据初始化相关
    const [toppingList, setToppingList] = useState([]);
    useEffect(() => {
        let url = genGetUrlByParams('/drinkset/topping/list', {
            tenantCode: 'tenant_001'
        });
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setToppingList((prev => {
                    let teaTypeListTmp = [];
                    response.data.model.forEach(item => {
                        teaTypeListTmp.push({
                            key: item.toppingCode,
                            label: item.toppingName,
                            value: item.toppingCode
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
    }, []);

    // 步骤表格
    const actStepCols = [
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
            render: (_, {stepIdx}) => (
                <Select
                    placeholder="请选择"
                    onChange={(e) => onChangeToppingCode(e, stepIdx)}
                    options={toppingList}
                    mode="multiple"
                    size="middle"
                    style={{width: '100%'}}
                    
                />
            ),
        }
    ];

    // 表格操作相关
    const [actStepList, setActStepList] = useState([]);
    const [stepIdx, setStepIdx] = useState(1);
    const onClickAddStep = (e) => {
        setActStepList((prev => {
            let tmp = [];
            prev.forEach((actStep, idx) => (
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
            prev.forEach((actStep, idx) => {
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
            prev.forEach((actStep, idx) => {
                if (actStep.stepIdx == stepIdx) {
                    e.forEach(item => {
                        actStep.toppingRelList.push({
                            toppingCode: item
                        });
                    })
                    tmp.push(actStep)
                } else {
                    tmp.push(actStep)
                }
            });
            return tmp;
        }));
    }

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
                    columns={actStepCols} 
                    dataSource={actStepList} 
                    pagination={false} 
                    scroll={{ y: 250 }} 
                    size='small' 
                    style={{height: '100%', width: '100%'}} 
                    rowKey='id'/>
            </div>
        </div>
    );
};

export default TeaNewModalActStepPane;