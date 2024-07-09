import React, { useState } from 'react';
import { Button, Input, Modal, Col, Row } from 'antd';

import '../css/common.css';
import { isBlankStr } from '../js/common.js';

const SpecSubNewModal = (props) => {
    console.log('$$$$$ SpecSubNewModal#entering props.specSubCode4Edit=', props.specSubCode4Edit);
    // 对话框相关
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        props.onClickSubmitSpecSub(specSubCode, specSubName, outerSpecSubCode);
    };
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据初始化相关
    const [specSubCode, setSpecSubCode] = useState(isBlankStr(props.specSubCode4Edit) ? '' : props.specSubCode4Edit);
    const [specSubName, setSpecSubName] = useState(isBlankStr(props.specSubName4Edit) ? '' : props.specSubName4Edit);
    const [outerSpecSubCode, setOuterSpecSubCode] = useState(isBlankStr(props.outerSpecSubCode4Edit) ? '' : props.outerSpecSubCode4Edit);

    // 输入相关
    const onChangeSpecSubCode = (e) => {
        setSpecSubCode(e.target.value);
    }
    const onChangeSpecSubName = (e) => {
        setSpecSubName(e.target.value);
    }
    const onChangeOuterSpecSubCode = (e) => {
        setOuterSpecSubCode(e.target.value);
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
                            <span>子项编码：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder="子项编码" disabled={isBlankStr(props.specSubCode4Edit) ? false : true} value={specSubCode} onChange={onChangeSpecSubCode}/>
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
                            <span>子项名称：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder="子项名称" value={specSubName} onChange={onChangeSpecSubName}/>
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
                            <span>外部子项名称：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder="外部子项名称" value={outerSpecSubCode} onChange={onChangeOuterSpecSubCode}/>
                        </div>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
};
 
export default SpecSubNewModal;