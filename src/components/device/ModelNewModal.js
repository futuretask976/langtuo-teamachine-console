import React, { useEffect, useState } from 'react';
import { Button, Input, InputNumber, Modal, Space, Switch, Col, Row } from 'antd';
import { FormOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isArray, isBlankStr, isValidCode } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const ModelNewModal = (props) => {
    // 对话框定义
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidCode(modelCode, true)) {
            alert('型号编码不符合规则');
            return;
        }
        if (!isArray(pipelineList)) {
            alert('管道序号不能为空');
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
                alert("保存成功");
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
    const putNew = props.modelCode4Edit == undefined ? true : false;
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
            if (respData == undefined) {
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
            style={{border: '0px solid red'}} 
            title="新建/编辑型号" 
            width={750}
        >
            <div className="flex-col-cont" style={{height: 410, width: '100%'}}>
                <div className="flex-col-cont" style={{height: 45, width: '100%'}}>
                    <Row style={{height: 45, width: '100%'}}>
                        <Col className="gutter-row" span={3}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>型号编码：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{height: '100%'}}>
                                <Input placeholder="型号编码" value={modelCode} disabled={isBlankStr(props.modelCode4Edit) ? false : true} onChange={(e) => setModelCode(e.target.value)} />
                            </div>
                        </Col>
                        <Col className="gutter-row" span={3}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>同时出料：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={3}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%'}}>
                                <Switch checkedChildren="支持" unCheckedChildren="不支持" checked={enableFlowAll === 1 ? true : false} onChange={(e) => setEnableFlowAll(e ? 1 : 0)} />
                            </div>
                        </Col>
                        <Col className="gutter-row" span={10}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%'}}>
                                <Space size={15}>
                                    <Button type="primary" icon={<FormOutlined />} onClick={onClickAddPipeline}>添加管道</Button>
                                    <Button type="primary" icon={<FormOutlined />} onClick={onClickDeletePipeline}>删除管道</Button>
                                </Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={4}>
                            &nbsp;
                        </Col>
                    </Row>
                </div>
                <div className="flex-col-cont" style={{justifyContent: 'flex-start', height: 365, width: '100%', overflowY: 'scroll'}}>
                    {isArray(pipelineList) && pipelineList.map((pipeline, index) => (
                        <Row key={index} style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: 45}}>
                                    <span>管道号码：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: 45}}>
                                    <InputNumber disabled="true" min={1} max={99} defaultValue={pipeline.pipelineNum}/>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: 45}}>
                                    <span>支持冷藏：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: 45}}>
                                    <Switch checkedChildren="支持" disabled="true" unCheckedChildren="不支持" checked={pipeline.enableFreeze === 1 ? true : false} onChange={(value) => onChangeFreeze(value, pipeline)} />
                                </div>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: 45}}>
                                    <span>支持加热：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: 45}}>
                                    <Switch checkedChildren="支持" unCheckedChildren="不支持" checked={pipeline.enableWarm === 1 ? true : false} onChange={(value) => onChangeWarm(value, pipeline)} />
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