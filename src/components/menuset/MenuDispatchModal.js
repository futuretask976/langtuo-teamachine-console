import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Input, Modal, Select, Spin, Switch, Transfer, Upload, Col, Row, message } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import axios from 'axios';
import dayjs from 'dayjs';
import OSS from 'ali-oss';

import '../../css/common.css';
import { dateToYMDHMS, isArray, isBlankStr, genGetUrlByParams, genGetUrlBySegs, genPostUrl, isBlankArray } from '../../js/common.js';

const { TextArea } = Input;

const MenuDispatchModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl('/menuset/menu/dispatch/put');
        axios.put(url, {
            withCredentials: true, // 这会让axios在请求中携带cookies
            tenantCode: 'tenant_001',
            menuCode: menuCode,
            shopGroupCodeList: targetKeys
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
        }, 1000);
    };
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据初始化相关
    const [menuCode, setMenuCode] = useState(isBlankStr(props.menuCode4Dispatch) ? '' : props.menuCode4Dispatch);
    useEffect(() => {
        if (isBlankStr(props.menuCode4Dispatch)) {
            return;
        }

        let url = genGetUrlBySegs('/menuset/menu/dispatch/{segment}/{segment}/get', ['tenant_001', props.menuCode4Dispatch]);
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setTargetKeys(prev => {
                    let tmp = [];
                    if (isArray(response.data.model.shopGroupCodeList)) {
                        response.data.model.shopGroupCodeList.forEach(shopGroupCode => {
                            tmp.push(shopGroupCode);
                        })
                    }
                    return tmp;
                });
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
    }, [props.menuCode4Dispatch]);
    const [shopGroupList4Transfer, setShopGroupList4Transfer] = useState([]);
    useEffect(() => {
        let url = genGetUrlByParams('/shopset/shop/group/list', {
            tenantCode: 'tenant_001'
        });
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setShopGroupList4Transfer(prev => {
                    let tmp = [];
                    response.data.model.forEach(item => {
                        item.key = item.shopGroupCode;
                        tmp.push(item);
                    })
                    return tmp;
                })
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
            open={open}
            title="菜单分发"
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
 
export default MenuDispatchModal;