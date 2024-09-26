import React, { useEffect, useState } from 'react';
import { Input, Modal, Space, Col, Row } from 'antd';

import '../../css/common.css';
import { isBlankStr, getTenantCode, isValidCode, isValidComment, isValidName } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const { TextArea } = Input;

const ToppingTypeNewModal = (props) => {
    // 对话框定义
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
        put('/drinkset/topping/type/put', {
            tenantCode: getTenantCode(),
            comment: comment,
            toppingTypeCode: toppingTypeCode,
            toppingTypeName: toppingTypeName,
            putNew: putNew
        }).then(respData => {
            if (respData.success) {
                alert("保存成功！");
                setLoading(false);
                props.onClose(true);
                setOpen(false);
            } else {
                alert('保存失败：' + respData.errorMsg);
                setLoading(false);
            }
        });
    };
    const onClickCancel = () => {
        props.onClose(false);
        setOpen(false);
    };

    // 数据定义
    const putNew = props.toppingTypeCode4Edit == undefined ? true : false;
    const [toppingTypeCode, setToppingTypeCode] = useState();
    const [toppingTypeName, setToppingTypeName] = useState();
    const [comment, setComment] = useState();

    // 初始化定义
    const fetchToppingType4Edit = () => {
        if (isBlankStr(props.toppingTypeCode4Edit)) {
            return;
        }

        get('/drinkset/topping/type/get', {
            tenantCode: getTenantCode(),
            toppingTypeCode: props.toppingTypeCode4Edit
        }).then(respData => {
            let model = respData.model;
            setToppingTypeCode(model.toppingTypeCode);
            setToppingTypeName(model.toppingTypeName);
            setComment(model.comment);
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