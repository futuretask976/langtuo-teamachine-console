import React, { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, Flex, Input, Layout, Modal, Radio, Select, Space, Steps, Switch, Table, Tabs, Col, Row, message, theme } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import CleanRuleStepTabPane from './CleanRuleStepTabPane'

import '../../css/common.css';

const { Content } = Layout;
const { TextArea } = Input;

const CleanRuleNewModal = (props) => {
    const initialCleanSteps = [
        {
          label: '步骤1',
          children: <CleanRuleStepTabPane />,
          key: '1',
          closable: false,
        }
    ];

    const initialUnCleanMaterials = [
        {
            label: '牛奶',
            key: 1,
        },
        {
            label: '茶汤',
            key: 2,
        },
        {
            label: '咖啡',
            key: 3,
        }
    ]

    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [activeCleanStepKey, setActiveCleanStepKey] = useState(initialCleanSteps[0].key);
    const [cleanSteps, setCleanSteps] = useState(initialCleanSteps);
    const [unCleanMaterials, setUnCleanMaterials] = useState(initialUnCleanMaterials);
    const newTabIndex = useRef(0);

    const handleOk = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOpen(false);
        }, 3000);
    };

    const handleCancel = () => {
        props.onClose();
        setOpen(false);
    };

    const onCleanStepChange = (newActiveCleanStepKey) => {
        setActiveCleanStepKey(newActiveCleanStepKey);
    };

    const add = () => {
        const newActiveCleanStepKey = `newTab${newTabIndex.current++}`;
        const newCleanStepPanes = [...cleanSteps];
        newCleanStepPanes.push({
            label: '步骤'+ (newTabIndex.current + 1),
            children: <CleanRuleStepTabPane />,
            key: newActiveCleanStepKey,
        });
        setCleanSteps(newCleanStepPanes);
        setActiveCleanStepKey(newActiveCleanStepKey);
    };

    const remove = (targetKey) => {
        let newActiveCleanStepKey = activeCleanStepKey;
        let lastIndex = -1;
        cleanSteps.forEach((item, i) => {
            if (item.key === targetKey) {
                lastIndex = i - 1;
            }
        });
    
        const newCleanStepPanes = cleanSteps.filter((item) => item.key !== targetKey);
        if (newCleanStepPanes.length && newActiveCleanStepKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveCleanStepKey = newCleanStepPanes[lastIndex].key;
            } else {
                newActiveCleanStepKey = newCleanStepPanes[0].key;
            }
        }
        setCleanSteps(newCleanStepPanes);
        setActiveCleanStepKey(newActiveCleanStepKey);
    };

    const onCleanStepEdit = (targetKey, action) => {
        if (action === 'add') {
            add();
        } else {
            remove(targetKey);
        }
    };

    const onChange = () => {

    }
 
    return (
        <Modal
            centered
            open={open}
            title={props.modalTitle}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1000}
            footer={[
            ]}
        >
            <div class="flex-col-cont" style={{height: 450, width: '100%'}}>
                <div class="flex-row-cont" style={{height: '9%', width: '100%'}}>
                    <div class="flex-row-cont" style={{justifyContent: 'flex-end', width: '15%'}}>规则编号：</div>
                    <div style={{width: '30%'}}><Input placeholder="规则编号" /></div>
                    <div class="flex-row-cont" style={{justifyContent: 'flex-end', width: '15%'}}>规则名称：</div>
                    <div style={{width: '30%'}}><Input placeholder="规则名称" /></div>
                    <div style={{width: '10%'}}>&nbsp;</div>
                </div>
                <div class="flex-row-cont" style={{height: '9%', width: '100%'}}>
                    <div class="flex-row-cont" style={{justifyContent: 'flex-end', width: '15%'}}>是否提前提醒：</div>
                    <div style={{width: '30%'}}><Switch defaultChecked size="small" onChange={onChange} /></div>
                    <div class="flex-row-cont" style={{justifyContent: 'flex-end', width: '15%'}}>是否分批清洗：</div>
                    <div style={{width: '30%'}}><Switch defaultChecked size="small" onChange={onChange} /></div>
                    <div style={{width: '10%'}}>&nbsp;</div>
                </div>
                <div class="flex-row-cont" style={{height: '9%', width: '100%'}}>
                    <div class="flex-row-cont" style={{justifyContent: 'flex-end', width: '15%'}}>不清洗的物料：</div>
                    <div style={{width: '30%'}}><Select style={{width: '100%'}} onChange={onChange} options={unCleanMaterials} placeholder="请选择"/></div>
                    <div style={{width: '55%'}}>&nbsp;</div>
                </div>
                <div class="flex-row-cont" style={{height: '3%', width: '100%'}}>
                    &nbsp;
                </div>
                <div style={{height: '70%', width: '100%'}}>
                    <Tabs type="editable-card" onChange={onCleanStepChange} activeKey={activeCleanStepKey} onEdit={onCleanStepEdit} items={cleanSteps} style={{height: 450, width: '100%'}} />
                </div>
            </div>
        </Modal>
    );
};
 
export default CleanRuleNewModal;