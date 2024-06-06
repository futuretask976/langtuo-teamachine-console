import React, { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, Flex, Input, Layout, Modal, Radio, Select, Space, Steps, Switch, Table, Tabs, Col, Row, message, theme } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../css/common.css';

const { Content } = Layout;
const { TextArea } = Input;

const ToppingNewModalSpecPane = (props) => {
    // 规格相关
    const [toppingSpec, setToppingSpec] = useState([
        {
            value: '1',
            label: '杯型',
        },
        {
            value: '2',
            label: '温度',
        }
    ]);
    const [selectedToppingSpec, setSelectedToppingSpec] = useState([]);
    const onSelectedToppingSpecChange = () => {
    }

    // 子规格相关
    const [toppingSubSpec, setToppingSubSpec] = useState([
        {
            value: '1',
            label: '杯型',
            subSpecs: [
                {
                    value: '11',
                    label: '大杯',
                },
                {
                    value: '12',
                    label: '中杯',
                },
                {
                    value: '13',
                    label: '小杯',
                }
            ]
        },
        {
            value: '2',
            label: '温度',
            subSpecs: [
                {
                    value: '21',
                    label: '高温',
                },
                {
                    value: '22',
                    label: '中温',
                },
                {
                    value: '23',
                    label: '低温',
                }
            ]
        }
    ]);
    const onSelectedMaterialChange = (selectedMaterial) => {
    };

    return (
        <div class="flex-col-cont" style={{justifyContent: 'flex-start', height: 340, width: '100%', border: '0px solid red'}}>
            <div class="flex-row-cont" style={{height: 45, width: '98%', border: '0px solid green'}}>
                <div class="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%', width: '10%'}}>
                    可选规格：
                </div>
                <div class="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%', width: '90%'}}>
                    <Select
                        mode="multiple"
                        placeholder="请选择"
                        size="middle"
                        defaultValue={selectedToppingSpec}
                        style={{width: '100%'}}
                        onChange={onSelectedToppingSpecChange}
                        options={toppingSpec}
                    />
                </div>
            </div>
            <div class="flex-col-cont" style={{justifyContent: 'flex-start', height: 295, width: '98%', overflow: 'auto'}}>
                <Space direction="vertical" size="small" style={{width: '100%'}}>
                    {toppingSubSpec.map((spec) => (
                        <div class="flex-col-cont" style={{height: 85, width: '100%'}}>
                            <div class="flex-col-cont" style={{height: 75, width: '100%', background: '#E6F4FF', borderRadius: 5}}>
                                <div class="flex-row-cont" style={{justifyContent: 'flex-start', height: 30, width: '100%', color: 'black'}}>
                                    <span>{spec.label}：</span>
                                </div>
                                <div class="flex-row-cont" style={{justifyContent: 'flex-start', height: 45, width: '100%'}}>
                                    <Space size="small">
                                        {spec.subSpecs.map((subSpec) => (
                                            <Button size='middle'>{subSpec.label}</Button>
                                        ))}
                                    </Space>
                                </div>
                            </div>
                        </div>
                    ))}
                </Space>
            </div>
        </div>
    );
};

export default ToppingNewModalSpecPane;