import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Col, Row } from 'antd';
import axios from 'axios';

import '../css/common.css';
import { isBlankStr, genGetUrlBySegs, genPostUrl } from '../js/common.js';

const { TextArea } = Input;

const TenantNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl('/tenant/put');
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
        }, 1000);
    };
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据初始化相关
    const [tenantCode, setTenantCode] = useState(isBlankStr(props.tenantCode4Edit) ? '' : props.tenantCode4Edit);
    const [tenantName, setTenantName] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [imgLink, setImgLink] = useState('');
    const [comment, setComment] = useState('');
    useEffect(() => {
        if (isBlankStr(props.tenantCode4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/tenant/{segment}/get', [props.tenantCode4Edit]);
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
            <div style={{height: 320, width: '100%'}}>
                <Row style={{width: '100%'}}>
                    <Col className="gutter-row" span={6}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <span>商户编码：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder="商户编码" value={tenantCode} onChange={onChangeTenantCode} disabled={isBlankStr(props.tenantCode4Edit) ? false : true} style={{width: '90%'}} />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col className="gutter-row" span={24}>
                        &nbsp;
                    </Col>
                </Row> 
                <Row>
                    <Col className="gutter-row" span={6}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <span>商户名称：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder="商户名称" value={tenantName} onChange={onChangeTenantName} style={{width: '90%'}} />
                        </div>
                    </Col>
                </Row>
                <Row style={{height: 20, width: '100%'}}>
                    <Col className="gutter-row" span={24}>
                        &nbsp;
                    </Col>
                </Row>
                <Row style={{width: '100%'}}>
                    <Col className="gutter-row" span={6}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <span>联系人名称：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder="联系人名称" value={contactPerson} onChange={onChangeContactPerson} style={{width: '90%'}} />
                        </div>
                    </Col>
                </Row>
                <Row style={{height: 20, width: '100%'}}>
                    <Col className="gutter-row" span={24}>
                        &nbsp;
                    </Col>
                </Row> 
                <Row style={{width: '100%'}}>
                    <Col className="gutter-row" span={6}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <span>联系人电话：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder="联系人电话" value={contactPhone} onChange={onChangeContactPhone} style={{width: '90%'}} />
                        </div>
                    </Col>
                </Row>
                <Row style={{height: 20, width: '100%'}}>
                    <Col className="gutter-row" span={24}>
                        &nbsp;
                    </Col>
                </Row> 
                <Row style={{width: '100%'}}>
                    <Col className="gutter-row" span={6}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <span>备注：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <TextArea rows={4} placeholder="备注" maxLength={200} value={comment} onChange={onChangeComment} style={{width: '90%'}} />
                        </div>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
};
 
export default TenantNewModal;