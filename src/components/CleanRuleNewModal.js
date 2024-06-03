import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Flex, Input, Layout, Modal, Radio, Select, Space, Steps, Table, Tabs, Col, Row, message, theme } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../css/common.css';

const { Content } = Layout;
const { TextArea } = Input;

const CleanRuleNewModal = (props, onClose) => {
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);

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
            <div class="flex-col-cont" style={{height: 450, width: '100%', border: '1px solid red'}}>
                aaaa
            </div>
        </Modal>
    );
};
 
export default CleanRuleNewModal;