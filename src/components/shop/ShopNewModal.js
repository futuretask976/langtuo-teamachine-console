import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Select, Space, Col, Row } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { genGetUrlByParams, genGetUrlBySegs, genPostUrl, getRespErrorMsg, getJwtToken, getTenantCode, getRespModel, handleRespError, isBlankStr, isRespSuccess, isValidCode, isValidComment, isValidName, isArray } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const { TextArea } = Input;

const ShopNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidCode(shopCode, true)) {
            alert('店铺编码不符合规则');
            return;
        }
        if (!isValidName(shopName, true)) {
            alert('店铺名称不符合规则');
            return;
        }
        if (!isValidCode(shopGroupCode, true)) {
            alert('店铺组编码不符合规则');
            return;
        }
        if (!isValidComment(comment, false)) {
            alert('备注不符合规则');
            return;
        }

        setLoading(true);
        put('/shopset/shop/put', {
            tenantCode: getTenantCode(),
            comment: comment,
            shopCode: shopCode,
            shopName: shopName,
            shopGroupCode: shopGroupCode,
            putNew: putNew
        }).then(resp => {
            if (resp.success) {
                alert("保存成功！");
            } else {
                alert('保存失败：' + resp.errorMsg);
            }
            setLoading(false);
            props.onClose();
            setOpen(false);
        });
    };
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据初始化相关
    const putNew = props.shopCode4Edit == undefined ? true : false;
    const [comment, setComment] = useState();
    const [shopCode, setShopCode] = useState();
    const [shopName, setShopName] = useState();
    const [shopGroupCode, setShopGroupCode] = useState();
    const [shopGroupList, setShopGroupList] = useState();

    // 初始化动作相关
    const fetchShop4Edit = () => {
        if (isBlankStr(props.shopCode4Edit)) {
            return;
        }

        get('/shopset/shop/get', {  
            tenantCode: getTenantCode(),
            shopCode: props.shopCode4Edit
        }).then(respData => {
            let model = respData.model;
            setShopCode(model.shopCode);
            setShopName(model.shopName);
            setShopGroupCode(model.shopGroupCode);
            setComment(model.comment);
        });
    }
    const fetchShopGroupList4Select = () => {
        get('/shopset/shop/group/list', {
            tenantCode: getTenantCode()
        }).then(resp => {
            setShopGroupList((prev => {
                let shopGroupListTmp = [];
                if (isArray(resp.model)) {
                    resp.model.forEach(item => {
                        shopGroupListTmp.push({
                            label: item.shopGroupName,
                            value: item.shopGroupCode
                        });
                    });
                }
                return shopGroupListTmp;
            }));
        });
    }
    useEffect(() => {
        fetchShopGroupList4Select();
        fetchShop4Edit();
    }, []);
 
    return (
        <Modal
            centered
            confirmLoading={loading}
            open={open}
            onCancel={onClickCancel}
            onOk={onClickOK}
            style={{border: '0px solid red'}}
            title="新建/编辑店铺"
            width={500}
        >
            <div style={{height: 300, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>店铺编码：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <Input placeholder="店铺编码" disabled={!isBlankStr(props.shopCode4Edit)} value={shopCode} onChange={(e) => setShopCode(e.target.value)}/>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>店铺名称：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <Input placeholder="店铺名称" value={shopName} onChange={(e) => setShopName(e.target.value)}/>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>店铺组：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Select
                                    value={shopGroupCode}
                                    style={{width: '100%'}}
                                    onChange={(e) => setShopGroupCode(e)}
                                    options={shopGroupList}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>备注：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <TextArea rows={5} placeholder="备注" maxLength={200} value={comment} onChange={(e) => setComment(e.target.value)}/>
                        </Col>
                    </Row>
                </Space>
            </div>
        </Modal>
    );
};
 
export default ShopNewModal;