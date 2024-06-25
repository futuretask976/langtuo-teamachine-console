import React, { useEffect, useState } from 'react';
import { Button, Input, InputNumber, Modal, Switch, Col, Row } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import axios from 'axios';

import '../css/common.css';

const MachineModelNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        alert(modelCode)
        let url = 'http://localhost:8080/teamachine/machine/model/put';
        axios.put(url, {
            withCredentials: true, // 这会让axios在请求中携带cookies
            modelCode: modelCode,
            enableFlowAll: enableFlowAll,
            pipelineList: pipelineList,
            extraInfo: {
                testA: 'valueA',
                testB: 'valueB'
            }
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
        }, 3000);
    };
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据初始化相关
    const [modelCode, setModelCode] = useState(props.modelCode4Edit === undefined || props.modelCode4Edit === null ? '' : props.modelCode4Edit);
    const [enableFlowAll, setEnableFlowAll] = useState(1);
    useEffect(() => {
        if (props.modelCode4Edit === undefined || props.modelCode4Edit === null || props.modelCode4Edit === '') {
            return;
        }

        let url = 'http://localhost:8080/teamachine/machine/model/' + props.modelCode4Edit + '/get';
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setModelCode(response.data.model.modelCode);
                setEnableFlowAll(response.data.model.enableFlowAll);
                setPipelineList((prev => {
                    console.log("$$$$$ MachineModelNewModal#fetchMachineModelData pipelineList", response.data.model.pipelineList);
                    return response.data.model.pipelineList === undefined || response.data.model.pipelineList === null ? [] : response.data.model.pipelineList;
                }));
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
    }, [props.modelCode4Edit]);

    // 输入相关
    const onChangeModelCode = (e) => {
        setModelCode(e.target.value);
    }
    const onChangeEnableFlowAll = (value) => {
        setEnableFlowAll(value ? 1 : 0);
    }
    const [pipelineList, setPipelineList] = useState([]);
    const [pipelineNumIdx, setPipelineNumIdx] = useState(1);
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
            open={open}
            title="新建型号"
            onOk={onClickOK}
            onCancel={onClickCancel}
            width={1000}
            style={{border: '0px solid red'}}
            footer={[
                <Button key="back" onClick={onClickCancel}>取消</Button>,
                <Button key="submit" type="primary" loading={loading} onClick={onClickOK}>
                    提交
                </Button>,
            ]}
        >
            <div className="flex-col-cont" style={{height: 410, width: '100%'}}>
                <div className="flex-col-cont" style={{height: 45, width: '100%'}}>
                    <Row style={{height: 45, width: '100%'}}>
                        <Col className="gutter-row" span={2}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%'}}>
                                <span>型号编码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{height: '100%'}}>
                                <Input placeholder="型号编码" value={modelCode} disabled={props.modelCode4Edit === undefined || props.modelCode4Edit === null || props.modelCode4Edit === '' ? false : true} onChange={onChangeModelCode} />
                            </div>
                        </Col>
                        <Col className="gutter-row" span={2}>
                            &nbsp;
                        </Col>
                        <Col className="gutter-row" span={2}>
                            <div className="flex-row-cont" style={{height: '100%'}}>
                                <span>同时出料：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={3}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%'}}>
                                <Switch checkedChildren="支持" unCheckedChildren="不支持" checked={enableFlowAll === 1 ? true : false} onChange={onChangeEnableFlowAll} />
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="flex-col-cont" style={{justifyContent: 'flex-start', height: 365, width: '100%', overflowY: 'scroll'}}>
                    <Row style={{height: 45, width: '100%'}}>
                        <Col className="gutter-row" span={3}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: 40}}>
                                <span><Button type="primary" icon={<FormOutlined />} onClick={onClickAddPipeline}>添加管道</Button></span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={3}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: 40}}>
                                <span><Button type="primary" icon={<FormOutlined />} onClick={onClickDeletePipeline}>删除管道</Button></span>
                            </div>
                        </Col>
                    </Row>
                    {pipelineList.map((pipeline, index) => (
                        <Row id={index} style={{width: '100%'}}>
                            <Col className="gutter-row" span={2}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: 45}}>
                                    <span>管道号码：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: 45}}>
                                    <InputNumber disabled="true" min={1} max={99} defaultValue={pipeline.pipelineNum} size="small" />
                                </div>
                            </Col>
                            <Col className="gutter-row" span={2}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: 45}}>
                                    <span>支持冷藏：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: 45}}>
                                <Switch checkedChildren="支持" unCheckedChildren="不支持" checked={pipeline.enableFreeze === 1 ? true : false} onChange={(value) => onChangeFreeze(value, pipeline)} />
                                </div>
                            </Col>
                            <Col className="gutter-row" span={2}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: 45}}>
                                    <span>支持加热：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: 45}}>
                                <Switch checkedChildren="支持" unCheckedChildren="不支持" checked={pipeline.enableWarm === 1 ? true : false} onChange={(value) => onChangeWarm(value, pipeline)} />
                                </div>
                            </Col>
                        </Row>
                    ))}
                </div>
            </div>
        </Modal>
    );
};
 
export default MachineModelNewModal;