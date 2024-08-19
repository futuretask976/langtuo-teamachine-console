import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Space, Col, Row } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { isBlankStr, genGetUrlBySegs, genPostUrl, getJwtToken, getRespModel, getTenantCode, handleRespError, isRespSuccess } from '../../js/common.js';

const { TextArea } = Input;

const ShopGroupNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl('/shopset/shop/group/put');
        axios.put(url, {
            shopGroupCode: shopGroupCode,
            shopGroupName: shopGroupName,
            comment: comment,
            tenantCode: getTenantCode()
        }, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            if (isRespSuccess(response)) {
                alert("here is success")
            } else {
                alert("here is wrong")
            }
        })
        .catch(error => {
            handleRespError(error);
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

        let url = genGetUrlBySegs('/shopset/shop/group/{segment}/{segment}/get', [getTenantCode(), props.shopGroupCode4Edit]);
        axios.get(url, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setShopGroupCode(model.shopGroupCode);
            setShopGroupName(model.shopGroupName);
            setComment(model.comment);
        })
        .catch(error => {
            handleRespError(error);
        });
    }, [props.shopGroupCode4Edit]);
 
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
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>店铺组编码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <Input placeholder="店铺组编码" value={shopGroupCode} onChange={(e) => setShopGroupCode(e.target.value)}/>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>店铺组名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <Input placeholder="店铺组名称" value={shopGroupName} onChange={(e) => setShopGroupName(e.target.value)}/>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>备注：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <TextArea rows={5} placeholder="备注" maxLength={200} value={comment} onChange={(e) => setComment(e.target.value)}/>
                        </Col>
                    </Row>
                </Space>
            </div>
        </Modal>
    );
};
 
export default ShopGroupNewModal;