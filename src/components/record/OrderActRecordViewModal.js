import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Input, Modal, Select, Space, Table, Col, Row } from 'antd';
import dayjs from 'dayjs';

import '../../css/common.css';
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
    const [machineCode, setMachineCode] = useState('');
    const [shopGroupName, setShopGroupName] = useState('');
    const [shopName, setShopName] = useState('');
    const [orderGmtCreated, setOrderGmtCreated] = useState();
    const [outerOrderId, setOuterOrderId] = useState('');
    const [state, setState] = useState(0);
    const [specItems, setSpecItems] = useState('');
    const [toppingRecList, setToppingRecList] = useState([]);

    // 赋值初始化
    const fetchInvalidActRecord = () => {
        if (isBlankStr(props.idempotentMark4View)) {
            return;
        }

        get('/recordset/order/get', {  
            tenantCode: getTenantCode(),
            idempotentMark: props.idempotentMark4View
        }).then(resp => {
            let model = resp.model;
            setMachineCode(model.machineCode);
            setShopGroupName(model.shopGroupName);
            setShopName(model.shopName);
            setOrderGmtCreated(model.orderGmtCreated);
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
        fetchInvalidActRecord();
    }, [props.idempotentMark4View]);

    // 物料列表相关
    const toppingRecCols = [
        {
            title: '步骤序号',
            dataIndex: 'stepIndex',
            key: 'stepIndex',
            width: '20%'
        },
        {
            title: '物料名称',
            dataIndex: 'toppingName',
            key: 'toppingName',
            width: '40%'
        },
        {
            title: '实际用量',
            dataIndex: 'actualAmount',
            key: 'actualAmount',
            width: '40%'
        }
    ];
 
    return (
        <>
            <Modal
                centered
                open={open}
                title="新建规则"
                onCancel={onClickCancel}
                width={750}
                style={{border: '0px solid red'}}
                footer={[
                    <Button key="back" onClick={onClickCancel}>关闭</Button>,
                ]}
            >
                <div style={{height: 375, width: '100%'}}>
                    <Space direction='vertical' size={20} style={{width: '100%'}}>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>机器编码：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={9}>
                                <Input placeholder="机器编码" disabled={true} value={machineCode}/>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>订单状态：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={9}>
                                <Select
                                    disabled={true}
                                    options={[{
                                        label: '未制作',
                                        value: 0
                                    },
                                    {
                                        label: '制作中',
                                        value: 1
                                    },
                                    {
                                        label: '已制作',
                                        value: 2
                                    },
                                    {
                                        label: '有异常',
                                        value: 3
                                    },
                                    {
                                        label: '已取消',
                                        value: 4
                                    }
                                    ]}
                                    style={{width: '100%'}}
                                    value={state}
                                />
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>店铺组名称：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={9}>
                                <Input placeholder="店铺组名称" disabled={true} value={shopGroupName}/>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>店铺名称：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={9}>
                                <Input placeholder="店铺名称" disabled={true} value={shopName}/>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>外部订单号：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={9}>
                                <Input placeholder="外部订单号" disabled={true} value={outerOrderId}/>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>创建时间：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={9}>
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
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>规格项：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={21}>
                                <Input placeholder="规格项" disabled={true} value={specItems}/>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>物料明细：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={21}>
                                <Table
                                    columns={toppingRecCols} 
                                    dataSource={toppingRecList}
                                    pagination={false}
                                    rowKey={record=>record.id}
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