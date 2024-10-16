import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Input, Modal, Select, Space, Table, Col, Row } from 'antd';
import dayjs from 'dayjs';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { isArray, isBlankStr, getTenantCode } from '../../js/common.js';
import { get } from '../../js/request.js';

dayjs.locale('zh-cn');

const OrderActRecordViewModal = (props) => {
    // 对话框相关
    const [open, setOpen] = useState(true);
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据初始化相关
    const [machineCode, setMachineCode] = useState();
    const [shopGroupName, setShopGroupName] = useState();
    const [shopName, setShopName] = useState();
    const [orderGmtCreated, setOrderGmtCreated] = useState();
    const [teaTypeName, setTeaTypeName] = useState();
    const [teaName, setTeaName] = useState();
    const [outerOrderId, setOuterOrderId] = useState();
    const [state, setState] = useState(0);
    const [specItems, setSpecItems] = useState();
    const [toppingRecList, setToppingRecList] = useState([]);

    // 赋值初始化
    const fetchOrderActRecord = () => {
        if (isBlankStr(props.shopGroupCode4View) || isBlankStr(props.idempotentMark4View)) {
            return;
        }

        get('/recordset/order/get', {  
            tenantCode: getTenantCode(),
            shopGroupCode: props.shopGroupCode4View,
            idempotentMark: props.idempotentMark4View
        }).then(respData => {
            let model = respData.model;
            setMachineCode(model.machineCode);
            setShopGroupName(model.shopGroupName);
            setShopName(model.shopName);
            setOrderGmtCreated(model.orderGmtCreated);
            setTeaTypeName(model.teaTypeName);
            setTeaName(model.teaName);
            setOuterOrderId(model.outerOrderId);
            setState(model.state);
            if (isArray(model.specItemList)) {
                let specItemsTmp = '';
                model.specItemList.forEach(specItem => {
                    specItemsTmp = specItemsTmp + "，" + specItem.specItemName;
                });
                setSpecItems(specItemsTmp.substring(1));
            }
            if (isArray(model.toppingList)) {
                setToppingRecList(model.toppingList);
            }
        });
    }
    useEffect(() => {
        fetchOrderActRecord();
    }, [props.idempotentMark4View]);

    // 物料列表相关
    const toppingRecCols = [
        {
            title: applyLang('labelStepIndex'),
            dataIndex: 'stepIndex',
            key: 'stepIndex',
            width: '20%'
        },
        {
            title: applyLang('labelToppingName'),
            dataIndex: 'toppingName',
            key: 'toppingName',
            width: '40%'
        },
        {
            title: applyLang('labelActualAmount'),
            dataIndex: 'actualAmount',
            key: 'actualAmount',
            width: '40%'
        }
    ];
 
    return (
        <>
            <Modal
                centered
                onCancel={onClickCancel}
                open={open}
                title={applyLang('labelViewDetail')}
                width={875}
                footer={[
                    <Button key="back" onClick={onClickCancel}>{applyLang('labelClose')}</Button>,
                ]}
            >
                <div style={{height: 450, width: '100%'}}>
                    <Space direction='vertical' size={20} style={{width: '100%'}}>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={4}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptMachineCode')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Input placeholder={applyLang('labelMachineCode')} disabled={true} value={machineCode}/>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptState')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Select
                                    disabled={true}
                                    options={[{
                                        label: applyLang('labelWaitting'),
                                        value: 0
                                    },
                                    {
                                        label: applyLang('labelProducing'),
                                        value: 1
                                    },
                                    {
                                        label: applyLang('labelProduced'),
                                        value: 2
                                    },
                                    {
                                        label: applyLang('labelAbnormal'),
                                        value: 3
                                    },
                                    {
                                        label: applyLang('labelCancelled'),
                                        value: 4
                                    }
                                    ]}
                                    style={{width: '100%'}}
                                    value={state}
                                />
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={4}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptShopGroupName')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Input placeholder={applyLang('labelShopGroupName')} disabled={true} value={shopGroupName}/>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptShopName')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Input placeholder={applyLang('labelShopName')} disabled={true} value={shopName}/>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={4}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptTeaTypeName')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Input placeholder={applyLang('labelTeaTypeName')} disabled={true} value={teaTypeName}/>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptTeaName')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Input placeholder={applyLang('labelTeaName')} disabled={true} value={teaName}/>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={4}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptOuterOrderId')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Input placeholder={applyLang('labelOuterOrderId')} disabled={true} value={outerOrderId}/>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptOrderCreated')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <DatePicker
                                    disabled={true}
                                    format={{
                                        format: 'YYYY-MM-DD HH:mm:ss',
                                        type: 'mask',
                                    }}
                                    style={{width: '100%'}}
                                    value={dayjs(orderGmtCreated, 'YYYY-MM-DD HH:mm:ss')}
                                />
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={4}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptSpecItem')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={20}>
                                <Input placeholder={applyLang('labelSpecItem')} disabled={true} value={specItems}/>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={4}>
                                <div className="flex-row-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptToppingDetail')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={20}>
                                <Table
                                    columns={toppingRecCols} 
                                    dataSource={toppingRecList}
                                    pagination={false}
                                    rowKey={record => record.toppingCode}
                                    scroll={{ y: 170 }}
                                    size='small'
                                    style={{width: '100%'}} />
                            </Col>
                        </Row>
                    </Space>
                </div>
            </Modal>
        </>
    );
};
 
export default OrderActRecordViewModal;