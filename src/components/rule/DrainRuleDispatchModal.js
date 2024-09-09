import React, { useEffect, useState } from 'react';
import { Button, Modal, Transfer, Col, Row } from 'antd';

import '../../css/common.css';
import { isArray, isBlankStr, getTenantCode } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const DrainRuleDispatchModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);

        put('/ruleset/drain/dispatch/put', {
            tenantCode: getTenantCode(),
            drainRuleCode: drainRuleCode,
            shopGroupCodeList: targetKeys
        }).then(respData => {
            if (respData.success) {
                alert("保存成功");
            } else {
                alert('保存失败：' + respData.errorMsg);
            }
        });

        setTimeout(() => {
            setLoading(false);
            props.onClose();
            setOpen(false);
        }, 1000);
    };
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据初始化相关
    const [drainRuleCode, setDrainRuleCode] = useState(isBlankStr(props.drainRuleCode4Dispatch) ? '' : props.drainRuleCode4Dispatch);
    const [shopGroupList4Transfer, setShopGroupList4Transfer] = useState([]);

    // 初始化动作相关
    const fetchDrainRule4Edit = () => {
        if (isBlankStr(props.drainRuleCode4Dispatch)) {
            return;
        }

        get('/ruleset/drain/dispatch/get', {  
            tenantCode: getTenantCode(),
            drainRuleCode: props.drainRuleCode4Dispatch
        }).then(respData => {
            let model = respData.model;
            setTargetKeys(prev => {
                let tmp = [];
                if (isArray(model.shopGroupCodeList)) {
                    model.shopGroupCodeList.forEach(shopGroupCode => {
                        tmp.push(shopGroupCode);
                    })
                }
                return tmp;
            });
        });
    }
    const fetchShopGroupList4Transfer = () => {
        get('/shopset/shop/group/listbyadminorg', {  
            tenantCode: getTenantCode()
        }).then(respData => {
            setShopGroupList4Transfer(prev => {
                let tmp = [];
                if (isArray(respData.model)) {
                    respData.model.forEach(item => {
                        item.key = item.shopGroupCode;
                        tmp.push(item);
                    });
                }
                return tmp;
            });
        });
    }
    useEffect(() => {
        fetchShopGroupList4Transfer();
    }, []);
    useEffect(() => {
        fetchDrainRule4Edit();
    }, [props.drainRuleCode4Dispatch]);
    

    // 输入相关
    const [targetKeys, setTargetKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const handleChange = (newTargetKeys, direction, moveKeys) => {
        setTargetKeys(newTargetKeys);
        // console.log('targetKeys: ', newTargetKeys);
        // console.log('direction: ', direction);
        // console.log('moveKeys: ', moveKeys);
    };
    const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
        // console.log('sourceSelectedKeys: ', sourceSelectedKeys);
        // console.log('targetSelectedKeys: ', targetSelectedKeys);
    };
    const handleScroll = (direction, e) => {
        // console.log('direction:', direction);
        // console.log('target:', e.target);
    };
 
    return (
        <Modal
            centered
            open={open}
            title="排空规则分发"
            onOk={onClickOK}
            onCancel={onClickCancel}
            width={600}
            style={{border: '0px solid red'}}
            footer={[
                <Button key="back" onClick={onClickCancel}>取消</Button>,
                <Button key="submit" type="primary" loading={loading} onClick={onClickOK}>
                    提交
                </Button>,
            ]}
        >
            <div style={{height: 425, width: '100%'}}>
                <Row style={{width: '100%'}}>
                    <Col className="gutter-row" span={24}>
                        <div className="flex-row-cont" style={{justifyContent: 'center', height: '100%'}}>
                            <Transfer
                                dataSource={shopGroupList4Transfer}
                                titles={['待选择列表', '已选择列表']}
                                targetKeys={targetKeys}
                                selectedKeys={selectedKeys}
                                onChange={handleChange}
                                onSelectChange={handleSelectChange}
                                onScroll={handleScroll}
                                render={(item) => item.shopGroupName}
                                oneWay
                                style={{
                                    marginBottom: 16,
                                }}
                                listStyle={{
                                    width: 250,
                                    height: 420,
                                }}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
};
 
export default DrainRuleDispatchModal;