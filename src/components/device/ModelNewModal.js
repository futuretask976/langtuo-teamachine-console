import React, { useEffect, useState } from 'react';
import { Button, Input, InputNumber, Modal, Space, Switch, Col, Row } from 'antd';
import { FormOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { isArray, isBlankStr, isValidCode } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const ModelNewModal = (props) => {
    // 对话框定义
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidCode(modelCode, true)) {
            alert(applyLang('msgInvalidModelCode'));
            return;
        }
        if (!isArray(pipelineList)) {
            alert(applyLang('msgPipelineListEmpty'));
            return;
        }

        setLoading(true);
        put('/deviceset/model/put', {
            modelCode: modelCode,
            enableFlowAll: enableFlowAll,
            pipelineList: pipelineList,
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
    const putNew = props.modelCode4Edit === undefined ? true : false;
    const [modelCode, setModelCode] = useState();
    const [enableFlowAll, setEnableFlowAll] = useState(1);
    const [pipelineList, setPipelineList] = useState();
    const [pipelineNumIdx, setPipelineNumIdx] = useState(1);

    // 初始化定义
    const fetchModel4Edit = () => {
        if (isBlankStr(props.modelCode4Edit)) {
            return;
        }

        get('/deviceset/model/get', {
            modelCode: props.modelCode4Edit
        }).then(respData => {
            if (respData === undefined) {
                return;
            }
            let model = respData.model;
            setModelCode(model.modelCode);
            setEnableFlowAll(model.enableFlowAll);
            setPipelineList((prev => {
                let tmp = [];
                if (isArray(model.pipelineList)) {
                    model.pipelineList.forEach(function(ite) {
                        ite.key = ite.id;
                        tmp.push(ite);
                        if (ite.pipelineNum >= pipelineNumIdx) {
                            setPipelineNumIdx(ite.pipelineNum + 1);
                        }
                    });
                }
                return tmp;
            }));
        });
    }
    useEffect(() => {
        fetchModel4Edit();
    }, []);

    // 输入定义
    const onClickAddPipeline = (e) => {
        setPipelineList((prev => {
            let tmp = [];
            if (isArray(prev)) {
                prev.forEach((pipeline, index) => (
                    tmp.push(pipeline)
                ));
            }
            tmp.push({
                pipelineNum: pipelineNumIdx,
                enableFreeze: 0,
                enableWarm: 0,
                capacity: 2000
            });
            setPipelineNumIdx(pipelineNumIdx + 1);
            return tmp;
        }));
    }
    const onClickDeletePipeline = (e) => {
        setPipelineList((prev => {
            let tmp = [];
            if (isArray(prev) && prev.length > 0) {
                prev.forEach((ite, index) => {
                    tmp.push(ite)
                });
                tmp.pop();
                setPipelineNumIdx(pipelineNumIdx - 1);
            }
            return tmp;
        }));
    }
    const onChangeFreeze = (value, pipeline) => {
        setPipelineList((prev => {
            let tmp = [];
            prev.forEach((ite, index) => {
                if (ite.pipelineNum === pipeline.pipelineNum) {
                    ite.enableFreeze = value ? 1 : 0;
                }
                tmp.push(ite);
            });
            return tmp;
        }));

        pipeline.enableFreeze = value ? 1 : 0;
    }
    const onChangeWarm = (value, pipeline) => {
        setPipelineList((prev => {
            let tmp = [];
            prev.forEach((ite, index) => {
                if (ite.pipelineNum === pipeline.pipelineNum) {
                    ite.enableWarm = value ? 1 : 0;
                }
                tmp.push(ite);
            });
            return tmp;
        }));

        pipeline.enableWarm = value ? 1 : 0;
    }
    const onChangeCapacity = (value, pipeline) => {
        setPipelineList((prev => {
            let tmp = [];
            prev.forEach((ite, index) => {
                if (ite.pipelineNum === pipeline.pipelineNum) {
                    ite.capacity = value;
                }
                tmp.push(ite);
            });
            return tmp;
        }));

        pipeline.capacity = value;
    }
 
    return (
        <Modal
            centered
            confirmLoading={loading}
            open={open}
            onCancel={onClickCancel} 
            onOk={onClickOK} 
            title={applyLang('labelNewOrEdit')}
            width={900}
        >
            <div className="flex-col-cont" style={{height: 410, width: '100%'}}>
                <div className="flex-col-cont" style={{height: 45, width: '100%'}}>
                    <Row style={{height: 45, width: '100%'}}>
                        <Col className="gutter-row" span={3}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptModelCode')}</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{height: '100%'}}>
                                <Input placeholder={applyLang('labelModelCode')} value={modelCode} disabled={isBlankStr(props.modelCode4Edit) ? false : true} onChange={(e) => setModelCode(e.target.value)} />
                            </div>
                        </Col>
                        <Col className="gutter-row" span={4}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>{applyLang('promptSupportOutputMeanwhile')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={3}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%'}}>
                                <Switch checkedChildren={applyLang('labelEnabled')} unCheckedChildren={applyLang('labelDisabled')} checked={enableFlowAll === 1 ? true : false} onChange={(e) => setEnableFlowAll(e ? 1 : 0)} />
                            </div>
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%'}}>
                                <Space size={10}>
                                    <Button type="primary" icon={<FormOutlined />} onClick={onClickAddPipeline}>{applyLang('labelAddPipeline')}</Button>
                                    <Button type="primary" icon={<FormOutlined />} onClick={onClickDeletePipeline}>{applyLang('labelDelPipeline')}</Button>
                                </Space>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="flex-col-cont" style={{justifyContent: 'flex-start', height: 365, width: '100%', overflowY: 'scroll'}}>
                    {isArray(pipelineList) && pipelineList.map((pipeline, index) => (
                        <Row key={index} style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: 45}}>
                                    <span>{applyLang('promptPipelineNo')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: 45}}>
                                    <InputNumber disabled="true" min={1} max={99} defaultValue={pipeline.pipelineNum}/>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={2}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: 45}}>
                                    <span>{applyLang('promptSupportFreeze')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: 45}}>
                                    <Switch checkedChildren={applyLang('labelEnabled')} disabled="true" unCheckedChildren={applyLang('labelDisabled')} checked={pipeline.enableFreeze === 1 ? true : false} onChange={(value) => onChangeFreeze(value, pipeline)} />
                                </div>
                            </Col>
                            <Col className="gutter-row" span={2}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: 45}}>
                                    <span>{applyLang('promptSupportWarm')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: 45}}>
                                    <Switch checkedChildren={applyLang('labelEnabled')} unCheckedChildren={applyLang('labelDisabled')} checked={pipeline.enableWarm === 1 ? true : false} onChange={(value) => onChangeWarm(value, pipeline)} />
                                </div>
                            </Col>
                            <Col className="gutter-row" span={2}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: 45}}>
                                    <span>{applyLang('promptCapacity')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: 45}}>
                                    <InputNumber min={0} max={999} onChange={(value) => onChangeCapacity(value, pipeline)} value={pipeline.capacity}/>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                &nbsp;
                            </Col>
                        </Row>
                    ))}
                </div>
            </div>
        </Modal>
    );
};
 
export default ModelNewModal;