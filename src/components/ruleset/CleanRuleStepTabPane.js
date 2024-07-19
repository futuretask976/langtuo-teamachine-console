import React, { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, Flex, Input, InputNumber , Layout, Modal, Radio, Select, Space, Steps, Switch, Table, Tabs, Col, Row, message, theme } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';

const { Content } = Layout;
const { TextArea } = Input;

const CleanRuleStepTabPane = (props) => {
    const [cleanType, setCleanType] = useState("soak");

    const onCleanTypeChange = (e) => {
        setCleanType(e.target.value);
    }

    const onChange = () => {
    }
 
    return (
        <div class="flex-col-cont" style={{height: '100%', width: '100%'}}>
            <div class="flex-row-cont" style={{height: 42, width: '100%'}}>
                <div class="flex-row-cont" style={{justifyContent: 'flex-end', width: '15%'}}>清洗方式：</div>
                <div style={{justifyContent: 'flex-start', width: '30%'}}>
                    <Radio.Group onChange={onCleanTypeChange} value={cleanType}>
                        <Radio value={'wash'}>冲洗</Radio>
                        <Radio value={'soak'}>浸泡</Radio>
                    </Radio.Group>
                </div>
                <div class="flex-row-cont" style={{justifyContent: 'flex-end', width: '15%'}}>是否需要再次确认：</div>
                <div class="flex-row-cont" style={{justifyContent: 'flex-start', width: '30%'}}><Switch defaultChecked size="small" onChange={onChange} /></div>
                <div class="flex-row-cont" style={{width: '10%'}}>&nbsp;</div>
            </div>
            {cleanType == 'wash' && 
                <div class="flex-row-cont" style={{height: 42, width: '100%'}}>
                    <div class="flex-row-cont" style={{justifyContent: 'flex-end', width: '15%'}}>冲洗时间：</div>
                    <div class="flex-row-cont" style={{justifyContent: 'flex-start', width: '75%'}}><InputNumber min={1} max={10} defaultValue={3} onChange={onChange} />分钟</div>
                    <div class="flex-row-cont" style={{width: '10%'}}>&nbsp;</div>
                </div>
            }
            {cleanType == 'soak' && 
                <div class="flex-row-cont" style={{height: 42, width: '100%'}}>
                    <div class="flex-row-cont" style={{justifyContent: 'flex-end', width: '15%'}}>浸泡时间：</div>
                    <div class="flex-row-cont" style={{justifyContent: 'flex-start', width: '75%'}}><InputNumber min={1} max={10} defaultValue={3} onChange={onChange} />分钟 设备每隔<InputNumber min={1} max={10} defaultValue={3} onChange={onChange} />分钟 冲洗<InputNumber min={1} max={10} defaultValue={3} onChange={onChange} />秒</div>
                    <div class="flex-row-cont" style={{width: '10%'}}>&nbsp;</div>
                </div>
            }
            <div class="flex-row-cont" style={{height: 42, width: '100%'}}>
                <div class="flex-row-cont" style={{justifyContent: 'flex-end', width: '15%'}}>清洗提示标题：</div>
                <div class="flex-row-cont" style={{width: '75%'}}><Input placeholder="清洗提示标题" /></div>
                <div class="flex-row-cont" style={{width: '10%'}}>&nbsp;</div>
            </div>
            <div class="flex-row-cont" style={{height: 84, width: '100%'}}>
                <div class="flex-row-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-end', height: '100%', width: '15%'}}>清洗提示内容：</div>
                <div class="flex-row-cont" style={{width: '75%'}}><TextArea rows={3} placeholder="清洗提示内容" maxLength={200} /></div>
                <div class="flex-row-cont" style={{width: '10%'}}>&nbsp;</div>
            </div>
        </div>
    );
};
 
export default CleanRuleStepTabPane;