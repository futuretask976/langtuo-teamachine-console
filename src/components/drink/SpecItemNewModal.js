import React, { useState } from 'react';
import { Input, Modal, Space, Col, Row } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { isBlankStr, isValidCode, isValidName } from '../../js/common.js';

const SpecItemNewModal = (props) => {
    // 对话框相关
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidCode(specItemCode, true)) {
            alert(applyLang('msgSpecItemCodeInvalid'));
            return;
        }
        if (!isValidName(specItemName, true)) {
            alert(applyLang('msgSpecItemNameInvalid'));
            return;
        }
        if (!isValidCode(outerSpecItemCode, true)) {
            alert(applyLang('msgOuterSpecItemCodeInvalid'));
            return;
        }
        props.onClickSubmitSpecItem(specItemCode, specItemName, outerSpecItemCode);
    };
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据初始化相关
    const [specItemCode, setSpecItemCode] = useState(props.specItemCode4Edit);
    const [specItemName, setSpecItemName] = useState(props.specItemName4Edit);
    const [outerSpecItemCode, setOuterSpecItemCode] = useState(props.outerSpecItemCode4Edit);

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
            onOk={onClickOK}
            onCancel={onClickCancel}
            style={{border: '0px solid red'}}
            title={applyLang('labelNewOrEdit')}
            width={600}
        >
            <div style={{height: 200, width: '100%'}}>
                <Row style={{width: '100%'}}>
                    <Col className="gutter-row" span={6}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptSpecItemCode')}</span></Space>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder={applyLang('labelSpecItemCode')} disabled={isBlankStr(props.specItemCode4Edit) ? false : true} value={specItemCode} onChange={onChangeSpecItemCode}/>
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
                            <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptSpecItemName')}</span></Space>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder={applyLang('labelSpecItemName')} value={specItemName} onChange={onChangeSpecItemName}/>
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
                            <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptOuterSpecItemCode')}</span></Space>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder={applyLang('labelOuterSpecItemCode')} value={outerSpecItemCode} onChange={onChangeOuterSpecItemCode}/>
                        </div>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
};
 
export default SpecItemNewModal;