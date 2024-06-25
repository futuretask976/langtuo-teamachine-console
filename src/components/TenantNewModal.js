import React, { useEffect, useState } from 'react';
import { Button, Input, InputNumber, Layout, Modal, Switch, Col, Row } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import axios from 'axios';

import '../css/common.css';

const { Content } = Layout;
const { TextArea } = Input;

const TenantNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = 'http://localhost:8080/teamachine/tenant/put';
        axios.put(url, {
            withCredentials: true, // 这会让axios在请求中携带cookies
            tenantCode: tenantCode,
            tenantName: tenantName,
            contactPerson: contactPerson,
            contactPhone: contactPhone,
            imgLink: "https://pic.com",
            comment: comment,
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
    const [tenantCode, setTenantCode] = useState(props.tenantCode4Edit === undefined || props.tenantCode4Edit === null ? '' : props.tenantCode4Edit);
    const [tenantName, setTenantName] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [imgLink, setImgLink] = useState('');
    const [comment, setComment] = useState('');
    useEffect(() => {
        if (props.tenantCode4Edit === undefined || props.tenantCode4Edit === null || props.tenantCode4Edit === '') {
            return;
        }

        let url = 'http://localhost:8080/teamachine/tenant/' + props.tenantCode4Edit + '/get';
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setTenantCode(response.data.model.tenantCode);
                setTenantName(response.data.model.tenantName);
                setContactPerson(response.data.model.contactPerson);
                setContactPhone(response.data.model.contactPhone);
                setImgLink(response.data.model.imgLink);
                setComment(response.data.model.comment);
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
    }, [props.tenantCode4Edit]);

    // 输入相关
    const onChangeTenantCode = (e) => {
        setTenantCode(e.target.value);
    }
    const onChangeTenantName = (e) => {
        setTenantName(e.target.value);
    }
    const onChangeContactPerson = (e) => {
        setContactPerson(e.target.value);
    }
    const onChangeContactPhone = (e) => {
        setContactPhone(e.target.value);
    }
    const onChangeImgLink = (e) => {
        setImgLink(e.target.value);
    }
    const onChangeComment = (e) => {
        setComment(e.target.value);
    }
 
    return (
        <Modal
            centered
            open={open}
            title="新建租户"
            onOk={onClickOK}
            onCancel={onClickCancel}
            width={500}
            style={{border: '0px solid red'}}
            footer={[
                <Button key="back" onClick={onClickCancel}>取消</Button>,
                <Button key="submit" type="primary" loading={loading} onClick={onClickOK}>
                    提交
                </Button>,
            ]}
        >
            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', height: 410, width: '100%'}}>
                <div style={{height: 410, width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={10}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
                                <span>商户编码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                <Input placeholder="商户编码" value={tenantCode} onChange={onChangeTenantCode} disabled={props.tenantCode4Edit === undefined || props.tenantCode4Edit === null || props.tenantCode4Edit === '' ? false : true} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{height: 20, width: '100%'}}>
                        <Col className="gutter-row" span={22}>
                            &nbsp;
                        </Col>
                    </Row> 
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={10}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
                                <span>商户名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                <Input placeholder="商户名称" value={tenantName} onChange={onChangeTenantName} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{height: 20, width: '100%'}}>
                        <Col className="gutter-row" span={22}>
                            &nbsp;
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={10}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
                                <span>联系人名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                <Input placeholder="联系人名称" value={contactPerson} onChange={onChangeContactPerson} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{height: 20, width: '100%'}}>
                        <Col className="gutter-row" span={22}>
                            &nbsp;
                        </Col>
                    </Row> 
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={10}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
                                <span>联系人电话：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                <Input placeholder="联系人电话" value={contactPhone} onChange={onChangeContactPhone} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{height: 20, width: '100%'}}>
                        <Col className="gutter-row" span={22}>
                            &nbsp;
                        </Col>
                    </Row> 
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={10}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
                                <span>商户超级管理员登录名：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                <Input placeholder="商户超级管理员登录名" />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{height: 20, width: '100%'}}>
                        <Col className="gutter-row" span={22}>
                            &nbsp;
                        </Col>
                    </Row> 
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={10}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
                                <span>商户超级管理员登录密码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                <Input placeholder="商户超级管理员登录密码" />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{height: 20, width: '100%'}}>
                        <Col className="gutter-row" span={22}>
                            &nbsp;
                        </Col>
                    </Row> 
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={10}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
                                <span>备注：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                <TextArea rows={4} placeholder="备注" maxLength={200} value={comment} onChange={onChangeComment} />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </Modal>
    );
};
 
export default TenantNewModal;