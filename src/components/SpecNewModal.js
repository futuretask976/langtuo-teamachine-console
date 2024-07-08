import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Space, Switch, Table, Col, Row } from 'antd';
import axios from 'axios';

import '../css/common.css';
import { isBlankStr, genGetUrlByParams, genGetUrlBySegs, genPostUrl } from '../js/common.js';

const { TextArea } = Input;

const SpecNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl('/drinkset/spec/put');
        axios.put(url, {
            withCredentials: true, // 这会让axios在请求中携带cookies
            specCode: specCode,
            specName: specName,
            state: state,
            tenantCode: 'tenant_001',
            comment: comment,
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
    const [specCode, setSpecCode] = useState(isBlankStr(props.specCode4Edit) ? '' : props.specCode4Edit);
    const [specName, setSpecName] = useState('');
    const [state, setState] = useState(0);
    const [comment, setComment] = useState('');
    const [specSubList, setSpecSubList] = useState([]);
    useEffect(() => {
        if (isBlankStr(props.specCode4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/drinkset/spec/{segment}/{segment}/get', ['tenant_001', props.specCode4Edit]);
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setSpecCode(response.data.model.specCode);
                setSpecName(response.data.model.specName);
                setState(response.data.model.state);
                setComment(response.data.model.comment);
                setSpecSubList(prev => {
                    let tmp = [];
                    response.data.model.specSubList.forEach(item => {
                        tmp.push({
                            key: item.id,
                            specSubCode: item.specSubCode,
                            specSubName: item.specSubName,
                            outerSpecSubCode: item.outerSpecSubCode,
                            actions: ['edit', 'delete']
                        });
                    });
                    return tmp;
                });
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
    const specSubCols = [
        {
            title: '子项编码',
            dataIndex: 'specSubCode',
            key: 'specSubCode',
            width: '25%',
            render: (text) => <a>{text}</a>
        },
        {
            title: '外部编码',
            dataIndex: 'outerSpecSubCode',
            key: 'outerSpecSubCode',
            width: '25%'
        },
        {
            title: '子项名称',
            dataIndex: 'specSubCode',
            key: 'specSubCode',
            width: '30%'
        },
        {
            title: '操作',
            key: 'actions',
            width: '20%',
            render: (_, { specSubCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a id={action + '_' + specSubCode} onClick={(e) => onClickDeleteSpecSub(e, specSubCode)}>编辑</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a id={action + '_' + specSubCode} onClick={(e) => onClickDeleteSpecSub(e, specSubCode)}>删除</a>
                        );
                    }
                })}
                </Space>
            ),
        },
    ];
    const onClickEdit = (e, specSubCode) => {
        
    }
    const onClickDeleteSpecSub = (e, specSubCode) => {
        setSpecSubList(prev => {
            let tmp = [];
            prev.forEach(item => {
                if (item.specSubCode != specSubCode) {
                    tmp.push(item);
                }
            });
            return tmp;
        });
    }

    const onClickAddSpecSub = () => {
        setSpecSubList(prev => {
            let tmp = [];
            prev.forEach(item => {
                tmp.push(item);
            });
            tmp.push({
                key: '1111',
                specSubCode: '22222',
                specSubName: '33333',
                outerSpecSubCode: '44444',
                actions: ['edit', 'delete']
            });
            return tmp;
        });
    }
 
    return (
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
                            <Input placeholder="规格编码" value={specCode} onChange={onChangeSpecCode} />
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
                            <span>规格子项：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={21}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Table
                            columns={specSubCols} 
                            dataSource={specSubList}
                            pagination={false}
                            rowKey={record=>record.id}
                            scroll={{ y: 170 }} // 设置垂直滚动高度为300px
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
                            <Button onClick={onClickAddSpecSub} type='primary'>新增规格</Button>
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
    );
};
 
export default SpecNewModal;