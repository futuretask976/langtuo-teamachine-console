import React, { useEffect, useState } from 'react';
import { Button, Input, Select, Col, Row } from 'antd';
import { AuditOutlined, FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { getTenantCode, isArray, isValidCode } from '../../js/common.js';
import { get } from '../../js/request.js';
import { get4Export } from '../../js/request4Export.js'

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import AndroidAppListBlock from '../../components/device/AndroidAppListBlock'
import AndroidAppUploadModal from '../../components/device/AndroidAppUploadModal'

const AndroidAppPage = () => {
    // 面包屑相关
    const breadcrumbPath = ['控制台', '设备', '预部署管理'];

    // 数据初始化
    const [shopList4Select, setShopList4Select] = useState([]);
    const fetchShopList4Select = () => {
        get('/shopset/shop/listbyadminorg', {
            tenantCode: getTenantCode()
        }).then(respData => {
            setShopList4Select((prev => {
                let shopListTmp = [{
                    label: '全部',
                    value: ''
                }];
                if (isArray(respData.model)) {
                    respData.model.forEach(item => {
                        shopListTmp.push({
                            label: item.shopName,
                            value: item.shopCode
                        });
                    });
                }
                return shopListTmp;
            }));
        });
    }
    useEffect(() => {
        fetchShopList4Select();
    }, []);

    // 新建对话框相关
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = () => {
        setOpenNewModal(false);
        setDeployCode4Edit('');
        refreshList();
    }

    // 搜索相关
    const [version4Search, setVersion4Search] = useState('');
    const onClickSearch = () => {
        refreshList();
    }

    // 表格操作相关
    const [deployCode4Edit, setDeployCode4Edit] = useState('');
    const onClickEdit = (selectedDeployCode)=> {
        setDeployCode4Edit(selectedDeployCode);
        setOpenNewModal(true);
    }
    const onExportByExcel = ()=> {
        get4Export('/deviceset/deploy/export', {  
            tenantCode: getTenantCode()
        }).then(respData => {
            const url4Export = window.URL.createObjectURL(new Blob([respData]));
            const link4Export = document.createElement('a');
            link4Export.href = url4Export;
            link4Export.setAttribute('download', 'export.xlsx');
            document.body.appendChild(link4Export);
            link4Export.click();
            document.body.removeChild(link4Export);
        });
    }

    // 刷新列表相关
    const [refreshListKey, setRefreshListKey] = useState(0);
    const refreshList = () => {
        setRefreshListKey(refreshListKey + 1);
    };

    return (
        <>
            <BreadcrumbBlock breadcrumbPath={breadcrumbPath} />
            <Row style={{backgroundColor: '#FFFFFF'}}>&nbsp;</Row>
            <Row style={{backgroundColor: '#FFFFFF'}}>
                <Col className="gutter-row" span={2}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                        <span>版本号：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="版本号" onChange={(e) => setVersion4Search(e.target.value)}/>
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>新建版本</Button>
                    </div>
                </Col>
            </Row>
            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
            <div>&nbsp;</div>
            <AndroidAppListBlock key={refreshListKey} version4Search={version4Search}/>

            {openNewModal && (
                <AndroidAppUploadModal onClose={onCloseNewModal}/>
            )}
        </>
    )
};

export default AndroidAppPage;
