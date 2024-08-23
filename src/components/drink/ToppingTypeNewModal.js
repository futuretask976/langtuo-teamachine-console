import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Space, Col, Row } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { isBlankStr, genGetUrlBySegs, genPostUrl, getRespModel, getTenantCode, getJwtToken, handleRespError, isRespSuccess, isValidCode, isValidComment, isValidName } from '../../js/common.js';

const { TextArea } = Input;

const ToppingTypeNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidCode(toppingTypeCode, true)) {
            alert('物料类型编码不符合规则');
            return;
        }
        if (!isValidName(toppingTypeName, true)) {
            alert('物料类型名称不符合规则');
            return;
        }
        if (!isValidComment(comment, false)) {
            alert('备注不符合规则');
            return;
        }

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
            confirmLoading={loading}
            open={open}
            onOk={onClickOK}
            onCancel={onClickCancel}
            title="新建物料类型"
            style={{border: '0px solid red'}}
            width={450}
        >
            <div style={{height: 250, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={7}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>物料类型编码：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={17}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="物料类型编码" value={toppingTypeCode} onChange={(e) => setToppingTypeCode(e.target.value)} disabled={isBlankStr(props.toppingTypeCode4Edit) ? false : true}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={7}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>物料类型名称：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={17}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="物料类型名称" value={toppingTypeName} onChange={(e) => setToppingTypeName(e.target.value)}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={7}>
                            <div className="flex-row-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-end', height: '100%'}}>
                                <span>备注：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={17}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <TextArea rows={5} placeholder="备注" maxLength={200} value={comment} onChange={(e) => setComment(e.target.value)}/>
                            </div>
                        </Col>
                    </Row>
                </Space>
            </div>
        </Modal>
    );
};
 
export default ToppingTypeNewModal;