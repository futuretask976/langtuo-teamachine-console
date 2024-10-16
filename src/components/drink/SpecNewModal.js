import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Space, Table, Col, Row } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { getTenantCode, isEmptyArray, isBlankStr, isValidCode, isValidComment, isValidName, isArray } from '../../js/common.js';
import { get, put } from '../../js/request.js';

import SpecItemNewModal from '../../components/drink/SpecItemNewModal'

const { TextArea } = Input;

const SpecNewModal = (props) => {
    // 对话框定义
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidCode(specCode, true)) {
            alert(applyLang('msgSpecCodeInvalid'));
            return;
        }
        if (!isValidName(specName, true)) {
            alert(applyLang('msgSpecNameInvalid'));
            return;
        }
        if (!isValidComment(comment, false)) {
            alert(applyLang('msgCommentInvalid'));
            return;
        }
        if (isEmptyArray(specItemList)) {
            alert(applyLang('msgSpecItemListEmpty'));
            return;
        }

        setLoading(true);
        put('/drinkset/spec/put', {
            tenantCode: getTenantCode(),
            comment: comment,
            specCode: specCode,
            specName: specName,
            specItemList: specItemList,
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
    const putNew = props.specCode4Edit == undefined ? true : false;
    const [specCode, setSpecCode] = useState();
    const [specName, setSpecName] = useState();
    const [comment, setComment] = useState();
    const [specItemList, setSpecItemList] = useState();

    // 初始化定义
    const fetchSpec4Edit = () => {
        if (isBlankStr(props.specCode4Edit)) {
            return;
        }

        get('/drinkset/spec/get', {
            tenantCode: getTenantCode(),
            specCode: props.specCode4Edit
        }).then(respData => {
            let model = respData.model;
            setSpecCode(model.specCode);
            setSpecName(model.specName);
            setComment(model.comment);
            setSpecItemList(prev => {
                let tmp = [];
                if (isArray(model.specItemList)) {
                    model.specItemList.forEach(item => {
                        tmp.push({
                            key: item.id,
                            specItemCode: item.specItemCode,
                            specItemName: item.specItemName,
                            outerSpecItemCode: item.outerSpecItemCode,
                            actions: ['edit', 'delete']
                        });
                    });
                }
                return tmp;
            });
        });
    }
    useEffect(() => {
        fetchSpec4Edit();
    }, []);

    // 子规格定义
    const [specItemCode4Edit, setSpecItemCode4Edit] = useState('');
    const [specItemName4Edit, setSpecItemName4Edit] = useState('');
    const [outerSpecItemCode4Edit, setOuterSpecItemCode4Edit] = useState('');
    const [openSpecItemModalNew, setOpenSpecItemModalNew] = useState(false);
    const onOpenSpecItemNewModal = (specItemCode4Edit, specItemName4Edit, outerSpecItemCode4Edit) => {
        setSpecItemCode4Edit(specItemCode4Edit);
        setSpecItemName4Edit(specItemName4Edit);
        setOuterSpecItemCode4Edit(outerSpecItemCode4Edit);
        setOpenSpecItemModalNew(true);
    };
    const onCloseNewSubModal = () => {
        setOpenSpecItemModalNew(false);
        setSpecItemCode4Edit('');
        setSpecItemName4Edit('');
        setOuterSpecItemCode4Edit('');
    }
    const specItemCols = [
        {
            title: applyLang('labelSpecItemCode'),
            dataIndex: 'specItemCode',
            key: 'specItemCode',
            width: '25%',
            render: (text) => <a>{text}</a>
        },
        {
            title: applyLang('labelOuterSpecItemCode'),
            dataIndex: 'outerSpecItemCode',
            key: 'outerSpecItemCode',
            width: '25%'
        },
        {
            title: applyLang('labelSpecItemName'),
            dataIndex: 'specItemName',
            key: 'specItemName',
            width: '30%'
        },
        {
            title: applyLang('labelOpe'),
            key: 'actions',
            width: '20%',
            render: (_, { specItemCode, specItemName, outerSpecItemCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action === 'edit') {
                        return (
                            <a key={action + '_' + specItemCode} onClick={(e) => onOpenSpecItemNewModal(specItemCode, specItemName, outerSpecItemCode)}>{applyLang('labelOpeEdit')}</a>
                        );
                    }
                    if (action === 'delete') {
                        return (
                            <a key={action + '_' + specItemCode} onClick={(e) => onClickDeleteSpecItem(e, specItemCode)}>{applyLang('labelOpeDel')}</a>
                        );
                    }
                })}
                </Space>
            ),
        },
    ];
    const onClickDeleteSpecItem = (e, specItemCode) => {
        setSpecItemList(prev => {
            let tmp = [];
            prev.forEach(item => {
                if (item.specItemCode != specItemCode) {
                    tmp.push(item);
                }
            });
            return tmp;
        });
    }
    const onClickSubmitSpecItem = (specItemCode, specItemName, outerSpecItemCode) => {
        setSpecItemList(prev => {
            let tmp = [];
            let matched = false;
            if (isArray(prev)) {
                prev.forEach(item => {
                    if (item.specItemCode == specItemCode) {
                        matched = true;
                        tmp.push({
                            key: specItemCode,
                            specItemCode: specItemCode,
                            specItemName: specItemName,
                            outerSpecItemCode: outerSpecItemCode,
                            actions: ['edit', 'delete']
                        });
                    } else {
                        tmp.push(item);
                    }
                });
            }
            if (!matched) {
                tmp.push({
                    key: specItemCode,
                    specItemCode: specItemCode,
                    specItemName: specItemName,
                    outerSpecItemCode: outerSpecItemCode,
                    actions: ['edit', 'delete']
                });
            }
            return tmp;
        });
        setOpenSpecItemModalNew(false);
    }
 
    return (
        <>
            <Modal
                centered
                confirmLoading={loading}
                open={open}
                onOk={onClickOK}
                onCancel={onClickCancel}
                title={applyLang('labelNewOrEdit')}
                width={850}
            >
                <div style={{height: 475, width: '100%'}}>
                    <Space direction='vertical' size={20} style={{width: '100%'}}>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptSpecCode')}</span></Space>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={21}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                    <Input placeholder={applyLang('labelSpecCode')} allowClear disabled={isBlankStr(props.specCode4Edit) ? false : true} value={specCode} onChange={(e) => setSpecCode(e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptSpecName')}</span></Space>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={21}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                    <Input placeholder={applyLang('labelSpecName')} allowClear value={specName} onChange={(e) => setSpecName(e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                        <Row style={{height: 220, width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptSpecItemList')}</span></Space>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={21}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Table
                                    columns={specItemCols} 
                                    dataSource={specItemList}
                                    pagination={false}
                                    rowKey={record=>record.specItemCode}
                                    scroll={{ y: 170 }}
                                    size='small'
                                    style={{width: '100%'}} />
                                </div>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                &nbsp;
                            </Col>
                            <Col className="gutter-row" span={21}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                    <Button onClick={(e) => onOpenSpecItemNewModal('', '', '')} type='primary'>{applyLang('labelAddSpecItem')}</Button>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptComment')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={21}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                    <TextArea rows={3} placeholder={applyLang('labelComment')} maxLength={200} value={comment} onChange={(e) => setComment(e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                    </Space>
                </div>
            </Modal>

            {openSpecItemModalNew && (
                <SpecItemNewModal onClose={onCloseNewSubModal} specItemCode4Edit={specItemCode4Edit} specItemName4Edit={specItemName4Edit} outerSpecItemCode4Edit={outerSpecItemCode4Edit} onClickSubmitSpecItem={onClickSubmitSpecItem}/>
            )}
        </>
    );
};
 
export default SpecNewModal;