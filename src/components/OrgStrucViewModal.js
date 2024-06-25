import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import axios from 'axios';

import '../css/common.css';

import EditableTree from '../components/EditableTree'

const OrgStrucViewModal = (props) => {
    // 对话框相关
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setTimeout(() => {
            props.onClose();
            setOpen(false);
        }, 3000);
    };
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据初始化相关
    useEffect(() => {
        let url = 'http://localhost:8080/teamachine/orgstruc/list';
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                console.log("$$$$$ MachineModelNewModal#fetchMachineModelData pipelineList", response.data.model.pipelineList);
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
 
    return (
        <Modal
            centered
            open={open}
            title="查看组织架构"
            onOk={onClickOK}
            onCancel={onClickCancel}
            width={600}
            style={{border: '0px solid red'}}
            footer={[
                <Button key="back" onClick={onClickCancel}>关闭</Button>,
            ]}
        >
            <div className="flex-col-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-start', height: 400, width: '100%'}}>
                <EditableTree />
            </div>
        </Modal>
    );
};
 
export default OrgStrucViewModal;