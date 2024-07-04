import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import axios from 'axios';

import '../css/common.css';
import { TEAMACHINE_HOST_URL, genGetUrlByParams } from '../js/common.js';

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
    const [orgStrucTree, setOrgStrucTree] = useState([]);
    useEffect(() => {
        let url = genGetUrlByParams(TEAMACHINE_HOST_URL, '/orgstruc/listbydepth', {
            tenantCode: 'tenant_001'
        });
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setOrgStrucTree(prev => {
                    let orgStrucTreeTmp = [];
                    orgStrucTreeTmp.push(convertOrgNode(response.data.model));
                    return orgStrucTreeTmp;
                })
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

    const convertOrgNode = (orgNode) => {
        let childrenTmp = [];
        if (orgNode.childOrgNameList != undefined && orgNode.childOrgNameList != null) {
            orgNode.childOrgNameList.forEach(item => {
                childrenTmp.push(convertOrgNode(item));
            })
        }

        let treeNode = {
            key: orgNode.orgName,
            parentKey: orgNode.parentOrgName,
            isEditable: false,
            children: childrenTmp
        };
        return treeNode;
    }
 
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
                <EditableTree orgStrucTree={orgStrucTree} />
            </div>
        </Modal>
    );
};
 
export default OrgStrucViewModal;