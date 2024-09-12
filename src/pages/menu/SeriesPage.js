import React, { useState } from 'react';
import { Button, Input, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidCode, isValidName } from '../../js/common.js';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import SeriesListBlock from '../../components/menu/SeriesListBlock'
import SeriesNewModal from '../../components/menu/SeriesNewModal'

const SeriesPage = () => {
    // 面包屑相关
    const breadcrumbPath = ['控制台', '菜单', '系列管理'];

    // 新建对话框相关
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = () => {
        setOpenNewModal(false);
        setSeriesCode4Edit('');
        refreshList();
    }

    // 搜索相关
    const [seriesCode4Search, setSeriesCode4Search] = useState('');
    const [seriesName4Search, setSeriesName4Search] = useState('');

    // 搜索
    const onClickSearch = () => {
        if (!isValidCode(seriesCode4Search, false)) {
            alert('系列编码不符合规则');
            return;
        }
        if (!isValidName(seriesName4Search, false)) {
            alert('系列名称不符合规则');
            return;
        }
        refreshList();
    }

    // 表格操作相关
    const [seriesCode4Edit, setSeriesCode4Edit] = useState('');
    const onClickEdit = (selectedSeriesCode)=> {
        setSeriesCode4Edit(selectedSeriesCode);
        setOpenNewModal(true);
    }

    // 刷新列表相关
    const [refreshListKey, setRefreshListKey] = useState(0);
    const refreshList = () => {
        setRefreshListKey(refreshListKey + 1);
    };

    return (
        <>
            <BreadcrumbBlock breadcrumbPath={breadcrumbPath} />
            <Row style={{backgroundColor: '#fff'}}>&nbsp;</Row>
            <Row style={{backgroundColor: '#fff'}}>
                <Col className="gutter-row" span={2}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                        <span>系列编码：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="物料编码" allowClear onChange={(e) => setSeriesCode4Search(e.target.value)} style={{width: '95%'}}/>
                    </div>
                </Col>
                <Col className="gutter-row" span={2}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                        <span>系列名称：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="物料名称" allowClear onChange={(e) => setSeriesName4Search(e.target.value)} style={{width: '95%'}}/>
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>新建系列</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={12}>
                    &nbsp;
                </Col>
            </Row>
            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
            <div>&nbsp;</div>
            <SeriesListBlock key={refreshListKey} seriesCode4Search={seriesCode4Search} seriesName4Search={seriesName4Search} onClickEdit={onClickEdit} />

            {openNewModal && (
                <SeriesNewModal onClose={onCloseNewModal} seriesCode4Edit={seriesCode4Edit} />
            )}
        </>
    )
};

export default SeriesPage;
