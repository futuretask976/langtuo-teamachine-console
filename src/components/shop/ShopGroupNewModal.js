import React, { useEffect, useState } from 'react';
import { Input, Modal, Select, Space, Col, Row } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { isBlankStr, getTenantCode, isValidCode, isValidComment, isValidName, isArray } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const { TextArea } = Input;

const ShopGroupNewModal = (props) => {
    // 对话框定义
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidCode(shopGroupCode, true)) {
            alert(applyLang('msgShopGroupCodeInvalid'));
            return;
        }
        if (!isValidName(shopGroupName, true)) {
            alert(applyLang('msgShopGroupNameInvalid'));
            return;
        }
        if (!isValidName(orgName, true)) {
            alert(applyLang('msgOrgNameInvalid'));
            return;
        }
        if (!isValidComment(comment, false)) {
            alert(applyLang('msgCommentInvalid'));
            return;
        }

        setLoading(true);
        put('/shopset/shop/group/put', {
            tenantCode: getTenantCode(),
            comment: comment,
            shopGroupCode: shopGroupCode,
            shopGroupName: shopGroupName,
            orgName: orgName,
            putNew: putNew
        }).then(respData => {
            if (respData.success) {
                alert(applyLang('msgPutSucceed'));
                setLoading(false);
                props.onClose(true);
                setOpen(false);
            } else {
                alert(applyLang('msgPutFailed') + respData.errorMsg);
                setLoading(false);
            }
        });
    };
    const onClickCancel = () => {
        props.onClose(false);
        setOpen(false);
    };

    // 数据定义
    const putNew = props.shopGroupCode4Edit === undefined ? true : false;
    const [comment, setComment] = useState();
    const [shopGroupCode, setShopGroupCode] = useState();
    const [shopGroupName, setShopGroupName] = useState();
    const [orgName, setOrgName] = useState();
    const [orgList4Select, setOrgList4Select] = useState();

    // 初始化定义
    const fetchShopGroup4Edit = () => {
        if (isBlankStr(props.shopGroupCode4Edit)) {
            return;
        }

        get('/shopset/shop/group/get', {  
            tenantCode: getTenantCode(),
            shopGroupCode: props.shopGroupCode4Edit
        }).then(respData => {
            if (respData === undefined) {
                return;
            }
            let model = respData.model;
            setShopGroupCode(model.shopGroupCode);
            setShopGroupName(model.shopGroupName);
            setOrgName(model.orgName);
            setComment(model.comment);
        });
    }
    const fetchOrgList4Select = () => {
        get('/userset/org/list', {  
            tenantCode: getTenantCode()
        }).then(respData => {
            if (respData === undefined) {
                return;
            }
            let model = respData.model;
            setOrgList4Select(prev => {
                let tmp = [];
                if (isArray(model)) {
                    model.forEach(org => {
                        tmp.push({
                            label: org.orgName,
                            value: org.orgName
                        });
                    });
                }
                return tmp;
            });
        });
    }
    useEffect(() => {
        fetchShopGroup4Edit();
        fetchOrgList4Select();
    }, []);
 
    return (
        <Modal
            centered
            confirmLoading={loading}
            open={open}
            onOk={onClickOK}
            onCancel={onClickCancel}
            title={applyLang('labelNewOrEdit')}
            width={550}
        >
            <div style={{height: 300, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={7}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptShopGroupCode')}</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={17}>
                            <Input placeholder={applyLang('labelShopGroupCode')} disabled={!isBlankStr(props.shopGroupCode4Edit)} value={shopGroupCode} onChange={(e) => setShopGroupCode(e.target.value)}/>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={7}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptShopGroupName')}</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={17}>
                            <Input placeholder={applyLang('labelShopGroupName')} value={shopGroupName} onChange={(e) => setShopGroupName(e.target.value)}/>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={7}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptOrg')}</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={17}>
                            <Select
                                onChange={(e) => setOrgName(e)}
                                options={orgList4Select}
                                placeholder={applyLang('labelPleaseSelect')}
                                value={orgName}
                                style={{width: '100%'}}
                            />
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={7}>
                            <div className="flex-row-cont full-height" style={{alignItems: 'flex-start', justifyContent: 'flex-end'}}>
                                <span>{applyLang('promptComment')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={17}>
                            <TextArea rows={5} placeholder={applyLang('labelComment')} maxLength={200} value={comment} onChange={(e) => setComment(e.target.value)}/>
                        </Col>
                    </Row>
                </Space>
            </div>
        </Modal>
    );
};
 
export default ShopGroupNewModal;