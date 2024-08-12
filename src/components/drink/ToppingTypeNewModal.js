import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Space, Col, Row } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { isBlankStr, genGetUrlBySegs, genPostUrl, getRespModel, getTenantCode, getJwtToken, handleRespError, isRespSuccess } from '../../js/common.js';

const { TextArea } = Input;

const ToppingTypeNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl('/drinkset/topping/type/put');
        axios.put(url, {
            toppingTypeCode: toppingTypeCode,
            toppingTypeName: toppingTypeName,
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
    const [toppingTypeCode, setToppingTypeCode] = useState(isBlankStr(props.toppingTypeCode4Edit) ? '' : props.toppingTypeCode4Edit);
    const [toppingTypeName, setToppingTypeName] = useState('');
    const [comment, setComment] = useState('');
    const fetchToppingType4Edit = () => {
        if (isBlankStr(props.toppingTypeCode4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/drinkset/topping/type/{segment}/{segment}/get', [getTenantCode(), props.toppingTypeCode4Edit]);
        axios.get(url, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setToppingTypeCode(model.toppingTypeCode);
            setToppingTypeName(model.toppingTypeName);
            setComment(model.comment);
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    useEffect(() => {
        fetchToppingType4Edit();
    }, [props.toppingTypeCode4Edit]);
 
    return (
        <Modal
            centered
            open={open}
            title="新建物料类型"
            onOk={onClickOK}
            onCancel={onClickCancel}
            width={450}
            style={{border: '0px solid red'}}
            footer={[
                <Button key="back" onClick={onClickCancel}>取消</Button>,
                <Button key="submit" type="primary" loading={loading} onClick={onClickOK}>
                    提交
                </Button>,
            ]}
        >
            <div style={{height: 250, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>物料类型编码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="物料类型编码" value={toppingTypeCode} onChange={(e) => setToppingTypeCode(e.target.value)} disabled={isBlankStr(props.toppingTypeCode4Edit) ? false : true} style={{width: '90%'}} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>物料类型名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="物料类型名称" value={toppingTypeName} onChange={(e) => setToppingTypeName(e.target.value)} style={{width: '90%'}} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-end', height: '100%'}}>
                                <span>备注：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <TextArea rows={5} placeholder="备注" maxLength={200} value={comment} onChange={(e) => setComment(e.target.value)} style={{width: '90%'}} />
                            </div>
                        </Col>
                    </Row>
                </Space>
            </div>
        </Modal>
    );
};
 
export default ToppingTypeNewModal;