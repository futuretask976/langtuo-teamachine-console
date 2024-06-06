import React, { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, Flex, Input, Layout, Modal, Radio, Select, Space, Steps, Switch, Table, Tabs, Col, Row, message, theme } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import ToppingNewModalBasicInfoPane from './ToppingNewModalBasicInfoPane'
import ToppingNewModalActStepPane from './ToppingNewModalActStepPane'
import ToppingNewModalCommonPane from './ToppingNewModalCommonPane'
import ToppingNewModalSpecPane from './ToppingNewModalSpecPane'
import ToppingNewModalSpecRulePane from './ToppingNewModalSpecRulePane'

import '../css/common.css';

const { Content } = Layout;
const { TextArea } = Input;

const ToppingNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const { token } = theme.useToken();
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
    const contentStyle = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
        height: '100%',
        width: '100%'
    };

    // 步骤相关
    const [curStep, setCurStep] = useState(0);
    const steps = [
        {
            title: '基本信息',
            content: '这里是基本信息',
        },
        {
            title: '操作步骤',
            content: '这里是操作步骤',
        },
        {
            title: '标准配方',
            content: '这里是标准配方',
        },
        {
            title: '选项配置',
            content: '这里是选项配置',
        },
        {
            title: '变动规则',
            content: '这里是变动规则',
        },
    ];
    const nextStep = () => {
        setCurStep(curStep + 1);
    };
    const prevStep = () => {
        setCurStep(curStep - 1);
    };
 
    return (
        <Modal
            centered
            open={open}
            title="新建配方"
            onOk={handleOk}
            onCancel={handleCancel}
            width={1000}
            style={{border: '0px solid red'}}
            footer={[]}
        >
            <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', flexDirection: 'column', height: 450, width: '100%'}}>
                <Steps current={curStep} items={steps} />
                <div style={contentStyle}>
                    {curStep == 0 && (
                        <ToppingNewModalBasicInfoPane />
                    )}
                    {curStep == 1 && (
                        <ToppingNewModalActStepPane />
                    )}
                    {curStep == 2 && (
                        <ToppingNewModalCommonPane />
                    )}
                    {curStep == 3 && (
                        <ToppingNewModalSpecPane />
                    )}
                    {curStep == 4 && (
                        <ToppingNewModalSpecRulePane />
                    )}
                </div>
                <div style={{marginTop: 24}}>
                    {curStep > 0 && (
                        <Button style={{margin: '0 8px'}} onClick={() => prevStep()}>
                            上一步
                        </Button>
                    )}
                    {curStep < steps.length - 1 && (
                        <Button type="primary" onClick={() => nextStep()}>
                            下一步
                        </Button>
                    )}
                    {curStep === steps.length - 1 && (
                        <Button type="primary" onClick={() => message.success('操作完成！')}>
                            完成
                        </Button>
                    )}
                    <Button key="back" onClick={handleCancel} style={{margin: '0 8px'}}>取消</Button>
                    <Button key="submit" type="primary" loading={loading} onClick={handleOk} style={{margin: '0 8px'}}>
                        提交
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
 
export default ToppingNewModal;