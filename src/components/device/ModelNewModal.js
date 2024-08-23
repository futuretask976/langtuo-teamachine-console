import React, { useEffect, useState } from 'react';
import { Button, Input, InputNumber, Modal, Space, Switch, Col, Row } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import axios from 'axios';

import '../../css/common.css';
import { genGetUrlBySegs, genPostUrl, getRespModel, getJwtToken, handleRespError, isArray, isBlankStr, isRespSuccess, isValidCode } from '../../js/common.js';

const ModelNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidCode(modelCode, true)) {
            alert('型号编码不符合规则');
            return;
        }

        setLoading(true);
        let url = genPostUrl('/deviceset/model/put');
        axios.put(url, {
            modelCode: modelCode,
            enableFlowAll: enableFlowAll,
            pipelineList: pipelineList
        }, {
            // withCredentials: true, // 这会让axios在请求中携带cookies
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
            props.onClose();
            setLoading(false);
            setOpen(false);
        }, 1000);
    };
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据初始化相关
    const [modelCode, setModelCode] = useState(isBlankStr(props.modelCode4Edit) ? '' : props.modelCode4Edit);
    const [enableFlowAll, setEnableFlowAll] = useState(1);
    const [pipelineList, setPipelineList] = useState([]);
    const [pipelineNumIdx, setPipelineNumIdx] = useState(1);
    const fetchModel4Edit = () => {
        if (isBlankStr(props.modelCode4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/deviceset/model/{segment}/get', [props.modelCode4Edit]);
        axios.get(url, {
            // withCredentials: true.valueOf, // 这会让axios在请求中携带cookies
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setModelCode(model.modelCode);
            setEnableFlowAll(model.enableFlowAll);
            setPipelineList((prev => {
                let tmp = [];
                if (isArray(model.pipelineList)) {
                    model.pipelineList.forEach(function(ite) {
                        ite.key = ite.id;
                        tmp.push(ite);
                    });
                    
                }
                return tmp;
            }));
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    useEffect(() => {
        fetchModel4Edit();
    }, [props.modelCode4Edit]);

    // 输入相关
    const onClickAddPipeline = (e) => {
        setPipelineList((prev => {
            let tmp = [];
            prev.forEach((pipeline, index) => (
                tmp.push(pipeline)
            ));
            tmp.push({
                pipelineNum: pipelineNumIdx,
                enableFreeze: 0,
                enableWarm: 0,
            });
            setPipelineNumIdx(pipelineNumIdx + 1);
            return tmp;
        }));
    }
    const onClickDeletePipeline = (e) => {
        setPipelineList((prev => {
            let tmp = [];
            prev.forEach((ite, index) => {
                tmp.push(ite)
            });
            tmp.pop();
            setPipelineNumIdx(pipelineNumIdx - 1);
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
 
    return (
        <Modal
            centered
            confirmLoading={loading}
            open={open}
            onOk={onClickOK} 
            onCancel={onClickCancel} 
            style={{border: '0px solid red'}} 
            title="新建/编辑型号" 
            width="750"
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
                    {pipelineList.map((pipeline, index) => (
                        <Row id={index} style={{width: '100%'}}>
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
                            <Col className="gutter-row" span={6}>
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