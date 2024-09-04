import React, { useEffect, useState } from 'react';
import { Input, Modal, Space, Col, Row } from 'antd';

import '../../css/common.css';
import { isBlankStr, getTenantCode, isValidCode, isValidComment, isValidName } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const { TextArea } = Input;

const ShopGroupNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidCode(shopGroupCode, true)) {
            alert('店铺组编码不符合规则');
            return;
        }
        if (!isValidName(shopGroupName, true)) {
            alert('店铺组名称不符合规则');
            return;
        }
        if (!isValidComment(comment, false)) {
            alert('备注不符合规则');
            return;
        }

        setLoading(true);

        put('/shopset/shop/group/put', {
            shopGroupCode: shopGroupCode,
            shopGroupName: shopGroupName,
            comment: comment,
            tenantCode: getTenantCode()
        }).then(resp => {
            if (resp.success) {
                alert("保存成功");
            } else {
                alert('保存失败：' + resp.errorMsg);
            }
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
    const [shopGroupCode, setShopGroupCode] = useState(isBlankStr(props.shopGroupCode4Edit) ? '' : props.shopGroupCode4Edit);
    const [shopGroupName, setShopGroupName] = useState('');
    const [comment, setComment] = useState('');
    const fetchShopGroup4Edit = () => {
        if (isBlankStr(props.shopGroupCode4Edit)) {
            return;
        }

        get('/shopset/shop/group/get', {  
            tenantCode: getTenantCode(),
            shopGroupCode: props.shopGroupCode4Edit
        }).then(resp => {
            let model = resp.model;
            setShopGroupCode(model.shopGroupCode);
            setShopGroupName(model.shopGroupName);
            setComment(model.comment);
        });
    }
    useEffect(() => {
        fetchShopGroup4Edit();
    }, [props.shopGroupCode4Edit]);
 
    return (
        <Modal
            centered
            confirmLoading={loading}
            open={open}
            onOk={onClickOK}
            onCancel={onClickCancel}
            style={{border: '0px solid red'}}
            title="新建/编辑店铺组"
            width={500}
        >
            <div style={{height: 250, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>店铺组编码：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <Input placeholder="店铺组编码" value={shopGroupCode} onChange={(e) => setShopGroupCode(e.target.value)}/>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>店铺组名称：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <Input placeholder="店铺组名称" value={shopGroupName} onChange={(e) => setShopGroupName(e.target.value)}/>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>备注：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <TextArea rows={5} placeholder="备注" maxLength={200} value={comment} onChange={(e) => setComment(e.target.value)}/>
                        </Col>
                    </Row>
                </Space>
            </div>
        </Modal>
    );
};
 
export default ShopGroupNewModal;