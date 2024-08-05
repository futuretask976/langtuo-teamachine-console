import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Space, Switch, Table, Col, Row } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { isBlankStr, genGetUrlBySegs, genPostUrl, getTenantCode, handleRespError, getJwtToken, getRespModel, isRespSuccess } from '../../js/common.js';

import SpecItemNewModal from '../../components/drink/SpecItemNewModal'

const { TextArea } = Input;

const SpecNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl('/drink/spec/put');
        axios.put(url, {
            tenantCode: getTenantCode(),
            comment: comment,
            specCode: specCode,
            specName: specName,
            state: state,
            specItemList: specItemList
        }, {
            // withCredentials: true // 这会让axios在请求中携带cookies
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
    const [specCode, setSpecCode] = useState(isBlankStr(props.specCode4Edit) ? '' : props.specCode4Edit);
    const [specName, setSpecName] = useState('');
    const [state, setState] = useState(0);
    const [comment, setComment] = useState('');
    const [specItemList, setSpecItemList] = useState([]);
    const fetchSpec4Edit = () => {
        if (isBlankStr(props.specCode4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/drink/spec/{segment}/{segment}/get', [getTenantCode(), props.specCode4Edit]);
        axios.get(url, {
            // withCredentials: true // 这会让axios在请求中携带cookies
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setSpecCode(model.specCode);
            setSpecName(model.specName);
            setState(model.state);
            setComment(model.comment);
            setSpecItemList(prev => {
                let tmp = [];
                model.specItemList.forEach(item => {
                    tmp.push({
                        key: item.id,
                        specItemCode: item.specItemCode,
                        specItemName: item.specItemName,
                        outerSpecItemCode: item.outerSpecItemCode,
                        actions: ['edit', 'delete']
                    });
                });
                return tmp;
            });
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    useEffect(() => {
        fetchSpec4Edit();
    }, [props.specCode4Edit]);

    // 输入相关
    const onChangeSpecCode = (e) => {
        setSpecCode(e.target.value);
    }
    const onChangeSpecName = (e) => {
        setSpecName(e.target.value);
    }
    const onChangeState = (e) => {
        setState(e ? 1 : 0);
    }
    const onChangeComment = (e) => {
        setComment(e.target.value);
    }

    // 子规格相关
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
            title: '规格项编码',
            dataIndex: 'specItemCode',
            key: 'specItemCode',
            width: '25%',
            render: (text) => <a>{text}</a>
        },
        {
            title: '外部编码',
            dataIndex: 'outerSpecItemCode',
            key: 'outerSpecItemCode',
            width: '25%'
        },
        {
            title: '规格项名称',
            dataIndex: 'specItemName',
            key: 'specItemName',
            width: '30%'
        },
        {
            title: '操作',
            key: 'actions',
            width: '20%',
            render: (_, { specItemCode, specItemName, outerSpecItemCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a id={action + '_' + specItemCode} onClick={(e) => onOpenSpecItemNewModal(specItemCode, specItemName, outerSpecItemCode)}>编辑</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a id={action + '_' + specItemCode} onClick={(e) => onClickDeleteSpecItem(e, specItemCode)}>删除</a>
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
                open={open}
                title="新建规格"
                onOk={onClickOK}
                onCancel={onClickCancel}
                width={800}
                style={{border: '0px solid red'}}
                footer={[
                    <Button key="back" onClick={onClickCancel}>取消</Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={onClickOK}>
                        提交
                    </Button>,
                ]}
            >
                <div style={{height: 500, width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={3}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>规格编码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={21}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="规格编码" disabled={isBlankStr(props.specCode4Edit) ? false : true} value={specCode} onChange={onChangeSpecCode} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{height: 20, width: '100%'}}>
                        <Col className="gutter-row" span={24}>
                            &nbsp;
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={3}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>规格名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={21}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="规格名称" value={specName} onChange={onChangeSpecName} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{height: 20, width: '100%'}}>
                        <Col className="gutter-row" span={24}>
                            &nbsp;
                        </Col>
                    </Row> 
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={3}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>状态：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={21}>
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
                    <Row style={{height: 220, width: '100%'}}>
                        <Col className="gutter-row" span={3}>
                            <div className="flex-row-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-end', height: '100%'}}>
                                <span>规格项列表：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={21}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Table
                                columns={specItemCols} 
                                dataSource={specItemList}
                                pagination={false}
                                rowKey={record=>record.id}
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
                                <Button onClick={(e) => onOpenSpecItemNewModal('', '', '')} type='primary'>新增规格</Button>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{height: 20, width: '100%'}}>
                        <Col className="gutter-row" span={24}>
                            &nbsp;
                        </Col>
                    </Row> 
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={3}>
                            <div className="flex-row-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-end', height: '100%'}}>
                                <span>备注：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={21}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <TextArea rows={3} placeholder="备注" maxLength={200} value={comment} onChange={onChangeComment} />
                            </div>
                        </Col>
                    </Row>
                </div>
            </Modal>

            {openSpecItemModalNew && (
                <SpecItemNewModal onClose={onCloseNewSubModal} specItemCode4Edit={specItemCode4Edit} specItemName4Edit={specItemName4Edit} outerSpecItemCode4Edit={outerSpecItemCode4Edit} onClickSubmitSpecItem={onClickSubmitSpecItem}/>
            )}
        </>
    );
};
 
export default SpecNewModal;