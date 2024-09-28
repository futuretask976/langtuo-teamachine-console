import React, { useState } from 'react';
import { DatePicker, Modal, Space, Col, Row } from 'antd';
import dayjs from 'dayjs';

import '../../css/common.css';
import { getTenantCode, getYesterday } from '../../js/common.js';
import { get } from '../../js/request.js';

dayjs.locale('zh-cn');

const OrderReportGenModal = (props) => {
    // 对话框定义
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        get('/reportset/order/calc', {  
            tenantCode: getTenantCode(),
            orderCreatedDay: orderCreatedDay
        }).then(respData => {
            console.log('$$$$$ onClickOK respData=', respData);
            let model = respData.model;
            alert('生成报表需要时间，请等候 5 分钟后再次访问。');

            setLoading(false);
            props.onClose();
            setOpen(false);
        });
    }
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据定义
    const [orderCreatedDay, setOrderCreatedDay] = useState(dayjs(getYesterday()).format('YYYY-MM-DD'));
 
    return (
        <>
            <Modal
                centered
                confirmLoading={loading}
                onCancel={onClickCancel}
                onOk={onClickOK}
                open={open}
                style={{border: '0px solid red'}}
                title="生成报表"
                width={400}
            >
                <div style={{height: 50, width: '100%'}}>
                    <Space direction='vertical' size={20} style={{width: '100%'}}>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={5}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>选择时间：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={19}>
                                <DatePicker
                                    format={{
                                        format: 'YYYY-MM-DD',
                                        type: 'mask',
                                    }}
                                    onChange={(e, dateString) => setOrderCreatedDay(dateString)}
                                    style={{width: '100%'}}
                                    value={dayjs(orderCreatedDay, 'YYYY-MM-DD')}
                                />
                            </Col>
                        </Row>
                    </Space>
                </div>
            </Modal>
        </>
    );
};
 
export default OrderReportGenModal;