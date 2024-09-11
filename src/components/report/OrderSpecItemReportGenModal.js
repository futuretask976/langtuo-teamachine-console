import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Input, InputNumber, Modal, Radio, Space, Col, Row } from 'antd';
import dayjs from 'dayjs';

import '../../css/common.css';
import { isBlankStr, getTenantCode } from '../../js/common.js';
import { get } from '../../js/request.js';

dayjs.locale('zh-cn');

const OrderSpecItemReportGenModal = (props) => {
    // 对话框相关
    const [open, setOpen] = useState(true);
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据初始化相关
    const [orderCreatedDay, setOrderCreatedDay] = useState(dayjs(new Date()).format('YYYY-MM-DD'));

    const onClickOK = () => {
        alert('aab');
        get('/reportset/order/calc', {  
            tenantCode: getTenantCode(),
            orderCreatedDay: orderCreatedDay
        }).then(respData => {
            console.log('$$$$$ onClickOK respData=', respData);
            let model = respData.model;
            alert('生成报表需要时间，请等候 5 分钟后再次访问。');
        });
    }
 
    return (
        <>
            <Modal
                centered
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
 
export default OrderSpecItemReportGenModal;