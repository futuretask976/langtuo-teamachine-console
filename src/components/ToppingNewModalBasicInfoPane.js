import React, { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, Flex, Input, Layout, Modal, Radio, Select, Space, Steps, Switch, Table, Tabs, Col, Row, message, theme } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../css/common.css';

const { Content } = Layout;
const { TextArea } = Input;

const CleanRuleNewModalBasicInfoPane = (props) => {
    // 配方分类
    const toppingGroupData = [
        {
            value: 'GROUP_SELF_DEVELOP',
            label: '自研'
        },
        {
            value: 'GROUP_BUY',
            label: '外部采购'
        }
    ];
    const [toppingGroupVal, setToppingGroupVal] = useState();
    const onToppingGroupChange = (newToppingGroupVal) => {
        setToppingGroupVal(newToppingGroupVal);
    };

    // 配方状态
    const [toppingStatVal, setToppingStatVal] = useState(1);
    const onToppingStatChange = (e) => {
        setToppingStatVal(e.target.value);
    };

    return (
        <div class="flex-col-cont" style={{justifyContent: 'flex-start', height: '100%', width: '100%'}}>
            <div class="flex-row-cont" style={{height: 35, width: '98%'}}>
                <div class="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%', width: '45%'}}>
                    <span>配方编码：</span>
                </div>
                <div style={{height: '100%', width: '10%'}}></div>
                <div class="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%', width: '45%'}}>
                    <span>配方名称：</span>
                </div>
            </div>
            <div class="flex-row-cont" style={{height: 35, width: '98%'}}>
                <div class="flex-row-cont" style={{height: '100%', width: '45%'}}>
                    <Input placeholder="配方编码" />
                </div>
                <div style={{height: '100%', width: '10%'}}></div>
                <div class="flex-row-cont" style={{height: '100%', width: '45%'}}>
                    <Input placeholder="配方名称" />
                </div>
            </div>

            <div class="flex-row-cont" style={{height: 35, width: '98%'}}>
                <div class="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%', width: '45%'}}>
                    <span>外部配方编码：</span>
                </div>
                <div style={{height: '100%', width: '10%'}}></div>
                <div class="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%', width: '45%'}}>
                    <span>配方分类：</span>
                </div>
            </div>
            <div class="flex-row-cont" style={{height: 35, width: '98%'}}>
                <div class="flex-row-cont" style={{height: '100%', width: '45%'}}>
                    <Input placeholder="外部配方编码" />
                </div>
                <div style={{height: '100%', width: '10%'}}></div>
                <div class="flex-row-cont" style={{height: '100%', width: '45%'}}>
                    <Select
                        defaultValue={toppingGroupVal}
                        style={{width: '100%'}}
                        onChange={onToppingGroupChange}
                        options={toppingGroupData}
                    />
                </div>
            </div>

            <div class="flex-row-cont" style={{height: 35, width: '98%'}}>
                <div class="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%', width: '100%'}}>
                    <span>配方状态：</span>
                </div>
            </div>
            <div class="flex-row-cont" style={{justifyContent: 'flex-start', height: 35, width: '98%'}}>
                <div class="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%', width: '98%'}}>
                    <Radio.Group onChange={onToppingStatChange} value={toppingStatVal}>
                        <Radio value={1}>启用</Radio>
                        <Radio value={2}>禁用</Radio>
                    </Radio.Group>
                </div>
            </div>

            <div class="flex-row-cont" style={{height: 35, width: '98%'}}>
                <div class="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%', width: '100%'}}>
                    <span>备注：</span>
                </div>
            </div>
            <div class="flex-row-cont" style={{height: 70, width: '98%'}}>
                <div class="flex-row-cont" style={{height: '100%', width: '100%'}}>
                    <TextArea rows={2} placeholder="备注" maxLength={200} />
                </div>
            </div>
        </div>
    );
};

export default CleanRuleNewModalBasicInfoPane;