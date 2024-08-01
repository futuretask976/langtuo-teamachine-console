import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Select, Space, Col, Row } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { genGetUrlByParams, genGetUrlBySegs, genPostUrl, getRespModel, isBlankStr, handleRespError, isRespSuccess, getJwtToken, getTenantCode } from '../../js/common.js';

const OrgNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl('/userset/org/put');
        axios.put(url, {
            tenantCode: getTenantCode(),
            extraInfo: {
                testA: 'valueA',
                testB: 'valueB'
            },
            orgName: orgName,
            parentOrgName: parentOrgName
        }, {
            // withCredentials: true, // 这会让axios在请求中携带cookies
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            if (isRespSuccess(response)) {
                alert("更新成功！")
            } else {
                alert("更新失败，请联系管理员！")
            }
        })
        .catch(error => {
            handleRespError(error);
        });

        setTimeout(() => {
            setLoading(false);
            props.onClose();
            setOpen(false);
        }, 1000);
    };
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据初始化相关
    const [orgName, setOrgName] = useState(isBlankStr(props.orgName4Edit) ? '' : props.orgName4Edit);
    const [parentOrgName, setParentOrgName] = useState('总公司');
    const [parentOrgNameOpts, setParentOrgNameOpts] = useState([]);

    // 初始化动作相关
    const fetchOrg4Edit = () => {
        if (isBlankStr(props.orgName4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/userset/org/{segment}/{segment}/get', [getTenantCode(), props.orgName4Edit]);
        axios.get(url, {
            // withCredentials: true, // 这会让axios在请求中携带cookies
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setOrgName(model.orgName);
            setParentOrgName(model.parentOrgName);
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    const fetchOrgList4Select = () => {
        let url = genGetUrlByParams('/userset/org/list', {tenantCode: getTenantCode()});
        axios.get(url, {
            // withCredentials: true, // 这会让axios在请求中携带cookies
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setParentOrgNameOpts(prev => {
                let tmpOpts = [];
                model.forEach(ite => {
                    tmpOpts.push({
                        label: ite.orgName,
                        value: ite.orgName
                    });
                });
                return tmpOpts;
            });
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    useEffect(() => {
        fetchOrg4Edit();
    }, [props.orgName4Edit]);
    useEffect(() => {
        fetchOrgList4Select();
    }, []);
 
    return (
        <Modal
            centered
            open={open}
            title="新建租户"
            onOk={onClickOK}
            onCancel={onClickCancel}
            width={400}
            style={{border: '0px solid red'}}
            footer={[
                <Button key="back" onClick={onClickCancel}>取消</Button>,
                <Button key="submit" type="primary" loading={loading} onClick={onClickOK}>
                    提交
                </Button>,
            ]}
        >
            <div style={{height: 100, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>组织名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <Input placeholder="组织名称" value={orgName} onChange={(e) => setOrgName(e.target.value)} disabled={isBlankStr(props.orgName4Edit) ? false : true}/>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>父组织名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <Select
                                style={{width: '100%'}}
                                value={parentOrgName}
                                onChange={(e) => setParentOrgName(e)}
                                options={parentOrgNameOpts}
                            />
                        </Col>
                    </Row>
                </Space>
            </div>
        </Modal>
    );
};
 
export default OrgNewModal;