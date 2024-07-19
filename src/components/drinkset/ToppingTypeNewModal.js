import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Switch, Col, Row } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { isBlankStr, genGetUrlBySegs, genPostUrl } from '../../js/common.js';

const { TextArea } = Input;

const ToppingTypeNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl('/drinkset/topping/type/put');
        axios.put(url, {
            withCredentials: true, // 这会让axios在请求中携带cookies
            toppingTypeCode: toppingTypeCode,
            toppingTypeName: toppingTypeName,
            state: state,
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
    const [toppingTypeCode, setToppingTypeCode] = useState(isBlankStr(props.toppingTypeCode4Edit) ? '' : props.toppingTypeCode4Edit);
    const [toppingTypeName, setToppingTypeName] = useState('');
    const [state, setState] = useState(1);
    const [comment, setComment] = useState('');
    useEffect(() => {
        if (isBlankStr(props.toppingTypeCode4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/drinkset/topping/type/{segment}/{segment}/get', ['tenant_001', props.toppingTypeCode4Edit]);
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setToppingTypeCode(response.data.model.toppingTypeCode);
                setToppingTypeName(response.data.model.toppingTypeName);
                setState(response.data.model.state);
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
    }, [props.toppingTypeCode4Edit]);

    // 输入相关
    const onChangeToppingTypeCode = (e) => {
        setToppingTypeCode(e.target.value);
    }
    const onChangeToppingTypeName = (e) => {
        setToppingTypeName(e.target.value);
    }
    const onChangeState = (e) => {
        setState(e == true ? 1 : 0);
    }
    const onChangeComment = (e) => {
        setComment(e.target.value);
    }
 
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
            <div style={{height: 300, width: '100%'}}>
                <Row style={{width: '100%'}}>
                    <Col className="gutter-row" span={6}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <span>物料类型编码：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder="物料类型编码" value={toppingTypeCode} onChange={onChangeToppingTypeCode} disabled={isBlankStr(props.toppingTypeCode4Edit) ? false : true} style={{width: '90%'}} />
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
                            <span>物料类型名称：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder="物料类型名称" value={toppingTypeName} onChange={onChangeToppingTypeName} style={{width: '90%'}} />
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
                            <span>状态：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Switch checkedChildren="启用" unCheckedChildren="禁用" checked={state === 1 ? true : false} onChange={onChangeState} />
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
                        <div className="flex-row-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-end', height: '100%'}}>
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
 
export default ToppingTypeNewModal;