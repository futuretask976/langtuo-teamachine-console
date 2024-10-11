import React, { useEffect, useState } from 'react';
import { Modal, Transfer, Col, Row } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { isArray, isBlankStr, getTenantCode, isBlankObj } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const MenuDispatchModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);

        put('/menuset/menu/dispatch/put', {
            tenantCode: getTenantCode(),
            menuCode: menuCode,
            shopGroupCodeList: targetKeys
        }).then(respData => {
            if (respData.success) {
                alert("保存成功！");
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
    const [menuCode, setMenuCode] = useState(isBlankStr(props.menuCode4Dispatch) ? '' : props.menuCode4Dispatch);
    const [shopGroupList4Transfer, setShopGroupList4Transfer] = useState([]);

    // 赋值初始化相关
    const fetchMenuDispatch4Edit = () => {
        if (isBlankStr(props.menuCode4Dispatch)) {
            return;
        }

        get('/menuset/menu/dispatch/get', {  
            tenantCode: getTenantCode(),
            menuCode: props.menuCode4Dispatch
        }).then(respData => {
            let model = respData.model;
            if (isBlankObj(model)) {
                return;
            }
            setTargetKeys(respData => {
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
        get('/shopset/shop/group/list', {  
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
        fetchMenuDispatch4Edit();
        fetchShopGroupList4Transfer();
    }, []);
    

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
            confirmLoading={loading}
            open={open}
            onCancel={onClickCancel}
            onOk={onClickOK}
            style={{border: '0px solid red'}}
            title="菜单分发"
            width={600}
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
 
export default MenuDispatchModal;