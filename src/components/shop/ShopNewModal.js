import React, { useEffect, useState } from 'react';
import { Input, Modal, Select, Space, Col, Row } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { getTenantCode, isBlankStr, isValidCode, isValidComment, isValidName, isArray } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const { TextArea } = Input;

const ShopNewModal = (props) => {
    // 对话框定义
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidCode(shopCode, true)) {
            alert(applyLang('msgShopCodeInvalid'));
            return;
        }
        if (!isValidName(shopName, true)) {
            alert(applyLang('msgShopCodeInvalid'));
            return;
        }
        if (!isValidCode(shopGroupCode, true)) {
            alert(applyLang('msgShopGroupCodeInvalid'));
            return;
        }
        if (!isValidComment(comment, false)) {
            alert(applyLang('msgCommentInvalid'));
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
                alert(applyLang('msgPutSucceed'));
                setLoading(false);
                props.onClose(true);
                setOpen(false);
            } else {
                alert(applyLang('msgPutFailed') + resp.errorMsg);
                setLoading(false);
            }
        });
    };
    const onClickCancel = () => {
        props.onClose(false);
        setOpen(false);
    };

    // 数据定义
    const putNew = props.shopCode4Edit == undefined ? true : false;
    const [comment, setComment] = useState();
    const [shopCode, setShopCode] = useState();
    const [shopName, setShopName] = useState();
    const [shopGroupCode, setShopGroupCode] = useState();
    const [shopGroupList, setShopGroupList] = useState();

    // 初始化定义
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
            title={applyLang('labelNewOrEdit')}
            width={550}
        >
            <div style={{height: 300, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptShopCode')}</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <Input placeholder={applyLang('labelShopCode')} disabled={!isBlankStr(props.shopCode4Edit)} value={shopCode} onChange={(e) => setShopCode(e.target.value)}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptShopName')}</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <Input placeholder={applyLang('labelShopName')} value={shopName} onChange={(e) => setShopName(e.target.value)}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptShopGroup')}</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Select
                                    onChange={(e) => setShopGroupCode(e)}
                                    options={shopGroupList}
                                    placeholder={applyLang('labelPleaseSelect')}
                                    value={shopGroupCode}
                                    style={{width: '100%'}}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont full-height" style={{alignItems: 'flex-start', justifyContent: 'flex-end'}}>
                                <span>{applyLang('promptComment')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <TextArea rows={5} placeholder={applyLang('labelComment')} maxLength={200} value={comment} onChange={(e) => setComment(e.target.value)}/>
                        </Col>
                    </Row>
                </Space>
            </div>
        </Modal>
    );
};
 
export default ShopNewModal;