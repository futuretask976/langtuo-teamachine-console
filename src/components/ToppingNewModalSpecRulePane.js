import React, { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, Flex, Input, InputNumber, Layout, Modal, Radio, Select, Space, Steps, Switch, Table, Tabs, Col, Row, message, theme } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../css/common.css';

const { Content } = Layout;
const { TextArea } = Input;

const ToppingNewModalSpecRulePane = (props) => {
    // 规格组合相关
    const onMatchRuleChange = (e) => {
        alert(e);
        console.log(e);
        e.target.style.background = 'red';
        e.target.style.color = 'white';
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
    const commonToppingTableColumns = [
        {
            title: '步骤',
            dataIndex: 'step',
            key: 'step',
        },
        {
            title: '物料',
            dataIndex: 'materialName',
            key: 'materialName',
        },
        {
            title: '修改',
            dataIndex: 'commonWeight',
            key: 'commonWeight',
            render: (_, { commonWeight }) => (
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
            dataIndex: 'adjustNum',
            key: 'adjustNum',
            render: (_, { keepTempe }) => (
                <InputNumber min={1} max={10000} defaultValue={0} onChange={onAdjustNumChange} size="small" />
            ),
        },
        {
            title: '实际用量',
            dataIndex: 'actualWeight',
            key: 'actualWeight'
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
                <div class="flex-col-cont" style={{height: '100%', width: '29%', border: '0px solid green'}}>
                    <Space direction='vertical' size='small'>
                        <div class="flex-row-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-start', height: 50, width: '99%', border: '1px dashed gray'}} onClick={onMatchRuleChange}>
                            <span class="flex-row-cont" style={{height: '100%', lineHeight: 1.5, overflowWrap: 'break-word'}}>
                                中杯-冷藏-普通糖-0卡糖-高温-高热-超导-低舔-加水果
                            </span>
                        </div>
                        <div class="flex-row-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-start', height: 50, width: '99%', border: '1px dashed gray'}} onClick={onMatchRuleChange}>
                            <span class="flex-row-cont" style={{height: '100%', lineHeight: 1.5, overflowWrap: 'break-word'}}>
                                中杯-冷藏-普通糖-0卡糖-高温-高热-超导-低舔-加水果
                            </span>
                        </div>
                        <div class="flex-row-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-start', height: 50, width: '99%', border: '1px dashed gray'}} onClick={onMatchRuleChange}>
                            <span class="flex-row-cont" style={{height: '100%', lineHeight: 1.5, overflowWrap: 'break-word'}}>
                                中杯-冷藏-普通糖-0卡糖-高温-高热-超导-低舔-加水果
                            </span>
                        </div>
                        <div class="flex-row-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-start', height: 50, width: '99%', border: '1px dashed gray'}} onClick={onMatchRuleChange}>
                            <span class="flex-row-cont" style={{height: '100%', lineHeight: 1.5, overflowWrap: 'break-word'}}>
                                中杯-冷藏-普通糖-0卡糖-高温-高热-超导-低舔-加水果
                            </span>
                        </div>
                        <div class="flex-row-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-start', height: 50, width: '99%', border: '1px dashed gray'}} onClick={onMatchRuleChange}>
                            <span class="flex-row-cont" style={{height: '100%', lineHeight: 1.5, overflowWrap: 'break-word'}}>
                                中杯-冷藏-普通糖-0卡糖-高温-高热-超导-低舔-加水果
                            </span>
                        </div>
                    </Space>
                </div>
                <div style={{height: '100%', width: '2%'}}>&nbsp;</div>
                <div class="flex-col-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-start', height: '100%', width: '69%', border: '0px solid green'}}>
                    <Table columns={commonToppingTableColumns} dataSource={commonToppingTableData} size='small' style={{width: '100%'}} />
                </div>
            </div>
        </div>
    );
};

export default ToppingNewModalSpecRulePane;