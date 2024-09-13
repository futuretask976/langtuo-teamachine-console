import React, { useState } from 'react';
import { Button, Input, Space, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidCode, isValidName } from '../../js/common.js';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import DrainRuleListBlock from '../../components/rule/DrainRuleListBlock'
import DrainRuleNewModal from '../../components/rule/DrainRuleNewModal'
import DrainRuleDispatchModal from '../../components/rule/DrainRuleDispatchModal'

const DrainRulePage = (props) => {
    // 面包屑相关
    const breadcrumbPath = ['控制台', '食安规则', '营业准备管理'];

    // 新建对话框相关
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = () => {
        setOpenNewModal(false);
        setDrainRuleCode4Edit('');
        refreshList();
    }

    // 分发对话框相关
    const [openDispatchModal, setOpenDispatchModal] = useState(false);
    const onCloseDispatchModal = () => {
        setOpenDispatchModal(false);
        setDrainRuleCode4Dispatch('');
    }

    // 搜索相关
    const [drainRuleCode4Search, setDrainRuleCode4Search] = useState('');
    const [drainRuleName4Search, setDrainRuleName4Search] = useState('');
    const onClickSearch = () => {
        if (!isValidCode(drainRuleCode4Search, false)) {
            alert('排空规则编码不符合规则');
            return;
        }
        if (!isValidName(drainRuleName4Search, false)) {
            alert('排空规则名称不符合规则');
            return;
        }
        refreshList();
    }

    // 表格操作相关
    const [drainRuleCode4Edit, setDrainRuleCode4Edit] = useState('');
    const onClickEdit = (selectedDrainRuleCode)=> {
        setDrainRuleCode4Edit(selectedDrainRuleCode);
        setOpenNewModal(true);
    }
    const [drainRuleCode4Dispatch, setDrainRuleCode4Dispatch] = useState('');
    const onClickDispatch = (selectedDrainRuleCode)=> {
        setDrainRuleCode4Dispatch(selectedDrainRuleCode);
        setOpenDispatchModal(true);
    }

    // 刷新列表相关
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
                            <div className="flex-row-cont full-height" style={{ justifyContent: 'flex-end', height: '100%'}}>
                                <span>规则编码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height">
                                <Input placeholder="规则编码" allowClear onChange={(e) => setDrainRuleCode4Search(e.target.value)}/>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={2}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>规则名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height">
                                <Input placeholder="规则名称" allowClear onChange={(e) => setDrainRuleName4Search(e.target.value)}/>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height" style={{height: '100%'}}>
                                <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height" style={{height: '100%'}}>
                                <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>新建规则</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="full-width" style={{alignItems: 'center', backgroundColor: 'red', height: 740}}>
                    <DrainRuleListBlock key={refreshListKey} drainRuleCode4Search={drainRuleCode4Search} drainRuleName4Search={drainRuleName4Search} onClickEdit={onClickEdit} onClickDispatch={onClickDispatch}/>
                </div>
            </Space>            

            {openNewModal && (
                <DrainRuleNewModal modalTitle='新建规则' drainRuleCode4Edit={drainRuleCode4Edit} onClose={onCloseNewModal}/>
            )}

            {openDispatchModal && (
                <DrainRuleDispatchModal drainRuleCode4Dispatch={drainRuleCode4Dispatch} onClose={onCloseDispatchModal}/>
            )}
        </>
    )
};

export default DrainRulePage;
