import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Select, TreeSelect, Col, Row } from 'antd';
import axios from 'axios';

import '../css/common.css';

const { TextArea } = Input;

const ShopNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = 'http://localhost:8080/teamachine/shop/put';
        axios.put(url, {
            withCredentials: true, // 这会让axios在请求中携带cookies
            shopCode: shopCode,
            shopName: shopName,
            shopGroupCode: shopGroupCode,
            comment: comment,
            tenantCode: 'tenant_001',
            extraInfo: {
                testA: 'valueA',
                testB: 'valueB'
            },
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
    const [shopCode, setShopCode] = useState(props.shopCode4Edit === undefined || props.shopCode4Edit === null ? '' : props.shopCode4Edit);
    const [shopName, setShopName] = useState('');
    const [shopGroupCode, setShopGroupCode] = useState('');
    const [shopGroupName, setShopGroupName] = useState('');
    const [comment, setComment] = useState('');
    useEffect(() => {
        if (props.shopCode4Edit === undefined || props.shopCode4Edit === null || props.shopCode4Edit === '') {
            return;
        }

        let url = 'http://localhost:8080/teamachine/shop/tenant_001/' + props.shopCode4Edit + '/get';
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setShopCode(response.data.model.shopCode);
                setShopName(response.data.model.shopName);
                setShopGroupCode(response.data.model.shopGroupCode);
                setShopGroupName(response.data.model.shopGroupName);
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
    }, [props.shopCode4Edit]);
    const [shopGroupList, setShopGroupList] = useState([]);
    useEffect(() => {
        let url4ShopGroup = 'http://localhost:8080/teamachine/shop/group/list?tenantCode=tenant_001';
        axios.get(url4ShopGroup, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setShopGroupList((prev => {
                    let shopGroupListTmp = [];
                    response.data.model.forEach(item => {
                        shopGroupListTmp.push({
                            label: item.shopGroupName,
                            value: item.shopGroupCode
                        });
                    })
                    return shopGroupListTmp;
                }));
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
    const onChangeShopCode = (e) => {
        setShopCode(e.target.value);
    }
    const onChangeShopName = (e) => {
        setShopName(e.target.value);
    }
    const onChangeShopGroupCode = (e) => {
        setShopGroupCode(e);
    }
    const onChangeComment = (e) => {
        setComment(e.target.value);
    }
 
    return (
        <Modal
            centered
            open={open}
            title="新建店铺"
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
            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', height: 360, width: '100%'}}>
                <div style={{height: 410, width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={8}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
                                <span>店铺编码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={14}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                <Input placeholder="店铺编码" value={shopCode} onChange={onChangeShopCode}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{height: 20, width: '100%'}}>
                        <Col className="gutter-row" span={22}>
                            &nbsp;
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={8}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
                                <span>店铺名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={14}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                <Input placeholder="店铺名称" value={shopName} onChange={onChangeShopName}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{height: 20, width: '100%'}}>
                        <Col className="gutter-row" span={22}>
                            &nbsp;
                        </Col>
                    </Row> 
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={8}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
                                <span>店铺组：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={14}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                <Select
                                    value={shopGroupCode}
                                    style={{width: '100%'}}
                                    onChange={onChangeShopGroupCode}
                                    options={shopGroupList}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{height: 20, width: '100%'}}>
                        <Col className="gutter-row" span={22}>
                            &nbsp;
                        </Col>
                    </Row> 
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={8}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
                                <span>备注：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={14}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                    <TextArea rows={5} placeholder="备注" maxLength={200} value={comment} onChange={onChangeComment}/>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </Modal>
    );
};
 
export default ShopNewModal;