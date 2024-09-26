import React, { useState } from 'react';
import { Button, Input, Space, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidCode, isValidName } from '../../js/common.js';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import SeriesListBlock from '../../components/menu/SeriesListBlock'
import SeriesNewModal from '../../components/menu/SeriesNewModal'

const SeriesPage = () => {
    // 面包屑定义
    const breadcrumbPath = ['控制台', '菜单', '系列管理'];

    // 对话框定义
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = (refresh) => {
        setOpenNewModal(false);
        setSeriesCode4Edit(undefined);
        if (refresh) {
            refreshList();
        }
    }

    // 数据定义
    const [seriesCode4Search, setSeriesCode4Search] = useState();
    const [seriesName4Search, setSeriesName4Search] = useState();
    const [seriesCode4Edit, setSeriesCode4Edit] = useState();

    // 动作定义
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
    const onClickEdit = (selectedSeriesCode)=> {
        setSeriesCode4Edit(selectedSeriesCode);
        setOpenNewModal(true);
    }

    // 刷新定义
    const [refreshListKey, setRefreshListKey] = useState(0);
    const refreshList = () => {
        setRefreshListKey(refreshListKey + 1);
    };

    return (
        <>
            <Space className="full-square" direction="vertical" size={15}>
                <div className='flex-row-cont' style={{alignItems: 'flex-start', justifyContent: 'flex-start', height: 40}}>
                    <BreadcrumbBlock breadcrumbPath={breadcrumbPath} />
                </div>
                <div className='flex-col-cont full-width' style={{alignItems: 'center', background: '#FFFFFF', height: 50}}>
                    <Row className="full-width" style={{height: 40}}>
                        <Col className="gutter-row full-height" span={2}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>系列编码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="物料编码" allowClear onChange={(e) => setSeriesCode4Search(e.target.value)} style={{width: '95%'}}/>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={2}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>系列名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="物料名称" allowClear onChange={(e) => setSeriesName4Search(e.target.value)} style={{width: '95%'}}/>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>新建系列</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="full-width" style={{alignItems: 'center', backgroundColor: 'red', height: 740}}>
                <SeriesListBlock key={refreshListKey} seriesCode4Search={seriesCode4Search} seriesName4Search={seriesName4Search} onClickEdit={onClickEdit}/>
                </div>
            </Space>

            {openNewModal && (
                <SeriesNewModal onClose={onCloseNewModal} seriesCode4Edit={seriesCode4Edit} />
            )}
        </>
    )
};

export default SeriesPage;
