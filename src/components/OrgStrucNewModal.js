import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Select, Col, Row } from 'antd';
import axios from 'axios';

import '../css/common.css';

const OrgStrucNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = 'http://localhost:8080/teamachine/orgstruc/put';
        axios.put(url, {
            withCredentials: true, // 这会让axios在请求中携带cookies
            tenantCode: 'tenant_001',
            orgName: orgName,
            parentOrgName: orgName,
            extraInfo: {
                testA: 'valueA',
                testB: 'valueB'
            }
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                alert("here is success")
            } else {
                alert("here is wrong")
            }
        })
        .catch(error => {
            alert("here is error")
            // console.error('error: ', error);
            // console.error('error.response: ', error.response);
            // console.error('error.response.status: ', error.response.status);
            if (error && error.response && error.response.status === 401) {
                // window.location.href="/gxadmin/login";
            }
        });

        setTimeout(() => {
            setLoading(false);
            props.onClose();
            setOpen(false);
        }, 3000);
    };
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据初始化相关
    const [orgName, setOrgName] = useState(props.orgName4Edit === undefined || props.orgName4Edit === null ? '' : props.orgName4Edit);
    useEffect(() => {
        if (props.orgName4Edit === undefined || props.orgName4Edit === null || props.orgName4Edit === '') {
            return;
        }

        let url = 'http://localhost:8080/teamachine/orgstruc/tenant_001/' + props.orgName4Edit + '/get';
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setOrgName(response.data.model.orgName);
                setParentOrgName(response.data.model.parentOrgName);
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
    }, [props.orgName4Edit]);

    const [parentOrgName, setParentOrgName] = useState('总公司');
    const [parentOrgNameOpts, setParentOrgNameOpts] = useState([]);
    useEffect(() => {
        let url = 'http://localhost:8080/teamachine/orgstruc/list?tenantCode=tenant_002';
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setParentOrgNameOpts(prev => {
                    let tmpOpts = [];

                    response.data.model.forEach(ite => {
                        tmpOpts.push({
                            label: ite.orgName,
                            value: ite.orgName
                        });
                    });
                    return tmpOpts;
                });
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

    // 输入相关
    const onChangeOrgName = (e) => {
        setOrgName(e.target.value);
    }
    const onChangeParentOrgName = (value) => {
        setParentOrgName(value);
    }
 
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
            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', height: 100, width: '100%'}}>
                <div style={{height: 410, width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
                                <span>组织名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                <Input placeholder="组织名称" value={orgName} onChange={onChangeOrgName} disabled={props.orgName4Edit === undefined || props.orgName4Edit === null || props.orgName4Edit === '' ? false : true} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{height: 15, width: '100%'}}>
                        <Col className="gutter-row" span={24}>
                            &nbsp;
                        </Col>
                    </Row> 
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
                                <span>父组织名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                <Select
                                    style={{
                                        width: '100%',
                                    }}
                                    value={parentOrgName}
                                    onChange={onChangeParentOrgName}
                                    options={parentOrgNameOpts}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </Modal>
    );
};
 
export default OrgStrucNewModal;