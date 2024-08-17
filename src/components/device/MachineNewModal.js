import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Input, Modal, Select, Space, Switch, Col, Row } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

import '../../css/common.css';
import { dateToYMDHMS, genGetUrlByParams, genGetUrlBySegs, genPostUrl, isBlankStr, handleRespError, isRespSuccess, getJwtToken, getRespModel, getTenantCode, isArray } from '../../js/common.js';

dayjs.locale('zh-cn');

const MachineDeployNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl('/deviceset/machine/update');
        axios.put(url, {
            machineCode: machineCode,
            machineName: machineName,
            screenCode: screenCode,
            elecBoardCode: elecBoardCode,
            state: state,
            validUntil: new Date(validUntil),
            maintainUntil: new Date(maintainUntil),
            tenantCode: getTenantCode()
        }, {
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
    const [maintainUntil, setMaintainUntil] = useState(dateToYMDHMS(new Date()));
    const [shopCode, setShopCode] = useState('');
    const [shopList4Select, setShopList4Select] = useState([]);

    // 赋值初始化相关
    const fetchMachine4Edit = () => {
        if (isBlankStr(props.machineCode4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/deviceset/machine/{segment}/{segment}/get', [getTenantCode(), props.machineCode4Edit]);
        axios.get(url, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setMachineCode(model.machineCode);
            setMachineName(model.machineName);
            setScreenCode(model.screenCode);
            setElecBoardCode(model.elecBoardCode);
            setState(model.state);
            setValidUntil(dateToYMDHMS(new Date(model.validUntil)));
            setMaintainUntil(dateToYMDHMS(new Date(model.maintainUntil)));
            setShopCode(model.shopCode);
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    const fetchShopList4Select = () => {
        let url = genGetUrlByParams('/shopset/shop/list', {tenantCode: getTenantCode()});
        axios.get(url, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            if (isArray(model)) {
                setShopList4Select(prev => {
                    let tmp = [];
                    model.forEach(item => {
                        tmp.push({
                            label: item.shopName,
                            value: item.shopCode
                        });
                    })
                    return tmp;
                });
            }
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    useEffect(() => {
        fetchShopList4Select();
    }, []);
    useEffect(() => {
        fetchMachine4Edit();
    }, [props.machineCodeCode4Edit]);

    // 输入相关
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
            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', height: 400, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>机器编码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="机器编码" value={machineCode} disabled={true} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>机器名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="机器名称" value={machineName} onChange={(e) => setMachineName(e.target.value)}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>屏幕编码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="机器编码" value={screenCode} disabled={true} onChange={(e) => setScreenCode(e.target.value)}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>电控板编码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="电控板编码" value={elecBoardCode} disabled={true} onChange={(e) => setElecBoardCode(e.target.value)}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>状态：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Switch checkedChildren="启用" unCheckedChildren="禁用" checked={state === 1 ? true : false} onChange={(e) => setState(e ? 1 : 0)} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>保修期：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
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
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>有效期：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
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
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>归属店铺：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <Select
                                value={shopCode}
                                disabled={true}
                                style={{width: '100%'}}
                                onChange={(e) => setShopCode(e)}
                                options={shopList4Select}
                            />
                        </Col>
                    </Row>
                </Space>
            </div>
        </Modal>
    );
};
 
export default MachineDeployNewModal;