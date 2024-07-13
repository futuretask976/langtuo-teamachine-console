import React, { useState } from 'react';
import { Button, Input, Modal, Col, Row } from 'antd';

import '../css/common.css';
import { isBlankStr } from '../js/common.js';

const SpecItemNewModal = (props) => {
    // 对话框相关
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        props.onClickSubmitSpecItem(specItemCode, specItemName, outerSpecItemCode);
    };
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据初始化相关
    const [specItemCode, setSpecItemCode] = useState(isBlankStr(props.specItemCode4Edit) ? '' : props.specItemCode4Edit);
    const [specItemName, setSpecItemName] = useState(isBlankStr(props.specItemName4Edit) ? '' : props.specItemName4Edit);
    const [outerSpecItemCode, setOuterSpecItemCode] = useState(isBlankStr(props.outerSpecItemCode4Edit) ? '' : props.outerSpecItemCode4Edit);

    // 输入相关
    const onChangeSpecItemCode = (e) => {
        setSpecItemCode(e.target.value);
    }
    const onChangeSpecItemName = (e) => {
        setSpecItemName(e.target.value);
    }
    const onChangeOuterSpecItemCode = (e) => {
        setOuterSpecItemCode(e.target.value);
    }
 
    return (
        <Modal
            centered
            open={open}
            title="新建规格项"
            onOk={onClickOK}
            onCancel={onClickCancel}
            width={500}
            style={{border: '0px solid red'}}
            footer={[
                <Button key="back" onClick={onClickCancel}>取消</Button>,
                <Button key="submit" type="primary" onClick={onClickOK}>
                    提交
                </Button>,
            ]}
        >
            <div style={{height: 200, width: '100%'}}>
                <Row style={{width: '100%'}}>
                    <Col className="gutter-row" span={6}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <span>规格项编码：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder="规格项编码" disabled={isBlankStr(props.specItemCode4Edit) ? false : true} value={specItemCode} onChange={onChangeSpecItemCode}/>
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
                            <span>规格项名称：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder="规格项名称" value={specItemName} onChange={onChangeSpecItemName}/>
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
                            <span>外部规格项名称：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder="外部规格项名称" value={outerSpecItemCode} onChange={onChangeOuterSpecItemCode}/>
                        </div>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
};
 
export default SpecItemNewModal;