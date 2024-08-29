import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Select, Space, Col, Row } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { genGetUrlByParams, genGetUrlBySegs, genPostUrl, getRespErrorMsg, getJwtToken, getTenantCode, getRespModel, handleRespError, isBlankStr, isRespSuccess, isValidCode, isValidComment, isValidName } from '../../js/common.js';

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
        let url = genPostUrl('/shopset/shop/put');
        axios.put(url, {
            shopCode: shopCode,
            shopName: shopName,
            shopGroupCode: shopGroupCode,
            comment: comment,
            tenantCode: getTenantCode()
        }, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            if (isRespSuccess(response)) {
                alert("保存成功");
            } else {
                alert('保存失败：' + getRespErrorMsg(response));
            }
        })
        .catch(error => {
            handleRespError(error);
        });

        setTimeout(() => {
            props.onClose();
            setLoading(false);
            setOpen(false);
        }, 1000);
    };
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据初始化相关
    const [shopCode, setShopCode] = useState(isBlankStr(props.shopCode4Edit) ? '' : props.shopCode4Edit);
    const [shopName, setShopName] = useState('');
    const [shopGroupCode, setShopGroupCode] = useState('');
    const [shopGroupName, setShopGroupName] = useState('');
    const [comment, setComment] = useState('');
    const [shopGroupList, setShopGroupList] = useState([]);

    // 初始化动作相关
    const fetchShop4Edit = () => {
        if (isBlankStr(props.shopCode4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/shopset/shop/{segment}/{segment}/get', [getTenantCode(), props.shopCode4Edit]);
        axios.get(url, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setShopCode(model.shopCode);
            setShopName(model.shopName);
            setShopGroupCode(model.shopGroupCode);
            setShopGroupName(model.shopGroupName);
            setComment(model.comment);
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    const fetchShopGroupList4Select = () => {
        let url = genGetUrlByParams('/shopset/shop/group/list', {
            tenantCode: getTenantCode()
        });
        axios.get(url, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setShopGroupList((prev => {
                let shopGroupListTmp = [];
                model.forEach(item => {
                    shopGroupListTmp.push({
                        label: item.shopGroupName,
                        value: item.shopGroupCode
                    });
                })
                return shopGroupListTmp;
            }));
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    useEffect(() => {
        fetchShopGroupList4Select();
    }, []);
    useEffect(() => {
        fetchShop4Edit();
    }, [props.shopCode4Edit]);
 
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
            <div style={{height: 300, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>店铺编码：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <Input placeholder="店铺编码" value={shopCode} onChange={(e) => setShopCode(e.target.value)}/>
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