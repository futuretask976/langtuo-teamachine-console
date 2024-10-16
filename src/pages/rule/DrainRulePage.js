import React, { useState } from 'react';
import { Button, Input, Space, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidCode, isValidName } from '../../js/common.js';
import { applyLang } from '../../i18n/i18n';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import DrainRuleListBlock from '../../components/rule/DrainRuleListBlock'
import DrainRuleNewModal from '../../components/rule/DrainRuleNewModal'
import DrainRuleDispatchModal from '../../components/rule/DrainRuleDispatchModal'

const DrainRulePage = (props) => {
    // 面包屑定义
    const breadcrumbPath = [applyLang('labelConsole'), applyLang('labelRuleSet'), applyLang('labelDrainRuleMgt')];

    // 对话框定义
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = (refresh) => {
        setOpenNewModal(false);
        setDrainRuleCode4Edit(undefined);
        if (refresh) {
            refreshList();
        }
    }
    const [openDispatchModal, setOpenDispatchModal] = useState(false);
    const onCloseDispatchModal = () => {
        setOpenDispatchModal(false);
        setDrainRuleCode4Dispatch(undefined);
    }

    // 数据定义
    const [drainRuleCode4Search, setDrainRuleCode4Search] = useState();
    const [drainRuleName4Search, setDrainRuleName4Search] = useState();
    const [drainRuleCode4Edit, setDrainRuleCode4Edit] = useState();
    const [drainRuleCode4Dispatch, setDrainRuleCode4Dispatch] = useState();

    // 动作定义
    const onClickSearch = () => {
        if (!isValidCode(drainRuleCode4Search, false)) {
            alert(applyLang('msgRuleCodeInvalid'));
            return;
        }
        if (!isValidName(drainRuleName4Search, false)) {
            alert(applyLang('msgRuleNameInvalid'));
            return;
        }
        refreshList();
    }
    const onClickEdit = (selectedDrainRuleCode)=> {
        setDrainRuleCode4Edit(selectedDrainRuleCode);
        setOpenNewModal(true);
    }
    
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
                                <span>{applyLang('promptRuleCode')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height">
                                <Input placeholder={applyLang('labelRuleCode')} allowClear onChange={(e) => setDrainRuleCode4Search(e.target.value)}/>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={2}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>{applyLang('promptRuleName')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height">
                                <Input placeholder={applyLang('labelRuleName')} allowClear onChange={(e) => setDrainRuleName4Search(e.target.value)}/>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height" style={{height: '100%'}}>
                                <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>{applyLang('labelBeginSearch')}</Button>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height" style={{height: '100%'}}>
                                <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>{applyLang('labelNew')}</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="full-width" style={{alignItems: 'center', backgroundColor: 'red', height: 740}}>
                    <DrainRuleListBlock key={refreshListKey} drainRuleCode4Search={drainRuleCode4Search} drainRuleName4Search={drainRuleName4Search} onClickEdit={onClickEdit} onClickDispatch={onClickDispatch}/>
                </div>
            </Space>            

            {openNewModal && (
                <DrainRuleNewModal drainRuleCode4Edit={drainRuleCode4Edit} onClose={onCloseNewModal}/>
            )}

            {openDispatchModal && (
                <DrainRuleDispatchModal drainRuleCode4Dispatch={drainRuleCode4Dispatch} onClose={onCloseDispatchModal}/>
            )}
        </>
    )
};

export default DrainRulePage;
