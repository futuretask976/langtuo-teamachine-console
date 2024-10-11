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
            alert('店铺组编码不符合规则');
            return;
        }
        if (!isValidName(shopGroupName, true)) {
            alert('店铺组名称不符合规则');
            return;
        }
        if (!isValidName(orgName, true)) {
            alert('组织架构不符合规则');
            return;
        }
        if (!isValidComment(comment, false)) {
            alert('备注不符合规则');
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
    const putNew = props.shopGroupCode4Edit == undefined ? true : false;
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
            if (respData == undefined) {
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
            if (respData == undefined) {
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
            style={{border: '0px solid red'}}
            title={applyLang('labelNewOrEdit')}
            width={500}
        >
            <div style={{height: 300, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptShopGroupCode')}</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <Input placeholder={applyLang('labelShopGroupCode')} disabled={!isBlankStr(props.shopGroupCode4Edit)} value={shopGroupCode} onChange={(e) => setShopGroupCode(e.target.value)}/>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptShopGroupName')}</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <Input placeholder={applyLang('labelShopGroupName')} value={shopGroupName} onChange={(e) => setShopGroupName(e.target.value)}/>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptOrgName')}</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <Select
                                value={orgName}
                                style={{width: '100%'}}
                                onChange={(e) => setOrgName(e)}
                                options={orgList4Select}
                            />
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-end', height: '100%'}}>
                                <span>{applyLang('promptComment')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <TextArea rows={5} placeholder={applyLang('labelComment')} maxLength={200} value={comment} onChange={(e) => setComment(e.target.value)}/>
                        </Col>
                    </Row>
                </Space>
            </div>
        </Modal>
    );
};
 
export default ShopGroupNewModal;