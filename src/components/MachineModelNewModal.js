import React, { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, Flex, Input, Layout, Modal, Radio, Select, Space, Steps, Switch, Table, Tabs, Col, Row, message, theme } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../css/common.css';

const { Content } = Layout;
const { TextArea } = Input;

const MachineModelNewModal = (props) => {
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
            title="新建型号"
            onOk={handleOk}
            onCancel={handleCancel}
            width={1000}
            style={{border: '0px solid red'}}
            footer={[
                <Button key="back" onClick={handleCancel}>取消</Button>,
                <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                    提交
                </Button>,
            ]}
        >
            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', height: 410, width: '100%'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: 60, width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={2}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                <span>型号编码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                <Input placeholder="型号编码" />&nbsp;&nbsp;
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </Modal>
    );
};
 
export default MachineModelNewModal;