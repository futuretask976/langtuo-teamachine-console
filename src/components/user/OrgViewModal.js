import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';

import '../../css/common.css';
import { getTenantCode, isBlankObj, isArray } from '../../js/common.js';
import { get } from '../../js/request.js';

import EditableTree from '../../components/EditableTree'

const OrgViewModal = (props) => {
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
        get('/userset/org/listbydepth', {  
            tenantCode: getTenantCode()
        }).then(resp => {
            let model = resp.model;
            if (!isBlankObj(model)) {
                setOrgStrucTree(prev => {
                    let orgStrucTreeTmp = [];
                    orgStrucTreeTmp.push(convertOrgNode(model));
                    return orgStrucTreeTmp;
                })
            }
        });
    }, []);

    const convertOrgNode = (orgNode) => {
        let childrenTmp = [];
        if (!isBlankObj(orgNode) && isArray(orgNode.children)) {
            orgNode.children.forEach(item => {
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
 
export default OrgViewModal;