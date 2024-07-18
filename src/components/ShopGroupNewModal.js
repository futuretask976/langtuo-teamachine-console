import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Col, Row } from 'antd';
import axios from 'axios';

import '../css/common.css';
import { isBlankStr, genGetUrlBySegs, genPostUrl } from '../js/common.js';

const { TextArea } = Input;

const ShopGroupNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl('/shopset/shop/group/put');
        axios.put(url, {
            withCredentials: true, // 这会让axios在请求中携带cookies
            shopGroupCode: shopGroupCode,
            shopGroupName: shopGroupName,
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
        }, 1000);
    };
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据初始化相关
    const [shopGroupCode, setShopGroupCode] = useState(isBlankStr(props.shopGroupCode4Edit) ? '' : props.shopGroupCode4Edit);
    const [shopGroupName, setShopGroupName] = useState('');
    const [comment, setComment] = useState('');
    useEffect(() => {
        if (isBlankStr(props.shopGroupCode4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/shopset/shop/group/{segment}/{segment}/get', ['tenant_001', props.shopGroupCode4Edit]);
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
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
    }, [props.shopGroupCode4Edit]);

    // 输入相关
    const onChangeShopGroupCode = (e) => {
        setShopGroupCode(e.target.value);
    }
    const onChangeShopGroupName = (e) => {
        setShopGroupName(e.target.value);
    }
    const onChangeComment = (e) => {
        setComment(e.target.value);
    }
 
    return (
        <Modal
            centered
            open={open}
            title="新建店铺组"
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
            <div style={{height: 225, width: '100%'}}>
                <Row style={{width: '100%'}}>
                    <Col className="gutter-row" span={6}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <span>店铺组编码：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder="店铺组编码" value={shopGroupCode} onChange={onChangeShopGroupCode} style={{width: '90%'}} />
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
                            <span>店铺组名称：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder="店铺组名称" value={shopGroupName} onChange={onChangeShopGroupName} style={{width: '90%'}} />
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
                            <TextArea rows={5} placeholder="备注" maxLength={200} value={comment} onChange={onChangeComment} style={{width: '90%'}} />
                        </div>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
};
 
export default ShopGroupNewModal;