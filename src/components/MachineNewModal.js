import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Input, Modal, Switch, Col, Row } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

import '../css/common.css';
import { TEAMACHINE_HOST_URL, dateToYMDHMS, genGetUrlBySegs, genPostUrl, isBlankStr } from '../js/common.js';

dayjs.locale('zh-cn');

const MachineDeployNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl(TEAMACHINE_HOST_URL, '/machine/update');
        axios.put(url, {
            withCredentials: true, // 这会让axios在请求中携带cookies
            machineCode: machineCode,
            machineName: machineName,
            screenCode: screenCode,
            elecBoardCode: elecBoardCode,
            state: state,
            validUntil: new Date(validUntil),
            maintainUntil: new Date(maintainUntil),
            tenantCode: 'tenant_001',
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
    const [machineCode, setMachineCode] = useState(isBlankStr(props.machineCode4Edit) ? '' : props.machineCode4Edit);
    const [machineName, setMachineName] = useState('');
    const [screenCode, setScreenCode] = useState('');
    const [elecBoardCode, setElecBoardCode] = useState('');
    const [state, setState] = useState(0);
    const [validUntil, setValidUntil] = useState('');
    const [maintainUntil, setMaintainUntil] = useState('');
    useEffect(() => {
        if (isBlankStr(props.machineCode4Edit)) {
            return;
        }

        let url = genGetUrlBySegs(TEAMACHINE_HOST_URL, '/machine', ['tenant_001', props.machineCode4Edit, 'get']);
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setMachineCode(response.data.model.machineCode);
                setMachineName(response.data.model.machineName);
                setScreenCode(response.data.model.screenCode);
                setElecBoardCode(response.data.model.elecBoardCode);
                setState(response.data.model.state);
                setValidUntil(dateToYMDHMS(new Date(response.data.model.validUntil)));
                setMaintainUntil(dateToYMDHMS(new Date(response.data.model.maintainUntil)));
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
    }, [props.machineCodeCode4Edit]);

    // 输入相关
    const onChangeMachineName = (e) => {
        setMachineName(e.target.value);
    }
    const onChangeScreenCode = (e) => {
        setScreenCode(e.target.value);
    }
    const onChangeElecBoardCode = (e) => {
        setElecBoardCode(e.target.value);
    }
    const onChangeState = (e) => {
        setState(e ? 1 : 0);
    }
    const onChangeValidUntil = (date, dateString) => {
        setValidUntil(dateString);
    }
    const onChangeMaintainUntil = (date, dateString) => {
        setMaintainUntil(dateString);
    }
 
    return (
        <Modal
            centered
            open={open}
            title="更新机器信息"
            onOk={onClickOK}
            onCancel={onClickCancel}
            width={500}
            style={{border: '0px solid red'}}
            footer={[
                <Button key="back" onClick={onClickCancel}>取消</Button>,
                <Button key="submit" type="primary" loading={loading} onClick={onClickOK}>
                    提交
                </Button>,
            ]}
        >
            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', height: 410, width: '100%'}}>
                <div style={{height: 410, width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>机器编码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="机器编码" value={machineCode} disabled={true} />
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
                                <span>机器名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="机器名称" value={machineName} onChange={onChangeMachineName}/>
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
                                <span>屏幕编码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="机器编码" value={screenCode} onChange={onChangeScreenCode}/>
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
                                <span>电控板编码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="电控板编码" value={elecBoardCode} onChange={onChangeElecBoardCode}/>
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
                                <span>状态：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
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
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>保修期：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <DatePicker
                                    format={{
                                        format: 'YYYY-MM-DD HH:mm:ss',
                                        type: 'mask',
                                    }}
                                    onChange={onChangeMaintainUntil}
                                    value={dayjs(maintainUntil, 'YYYY-MM-DD HH:mm:ss')}
                                />
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
                                <span>有效期：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <DatePicker
                                    format={{
                                        format: 'YYYY-MM-DD HH:mm:ss',
                                        type: 'mask',
                                    }}
                                    onChange={onChangeValidUntil}
                                    value={dayjs(validUntil, 'YYYY-MM-DD HH:mm:ss')}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </Modal>
    );
};
 
export default MachineDeployNewModal;