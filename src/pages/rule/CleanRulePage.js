import React, { useState } from 'react';
import { Button, Input, Space, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidCode, isValidName } from '../../js/common.js';
import { applyLang } from '../../i18n/i18n';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import CleanRuleListBlock from '../../components/rule/CleanRuleListBlock'
import CleanRuleNewModal from '../../components/rule/CleanRuleNewModal'
import CleanRuleDispatchModal from '../../components/rule/CleanRuleDispatchModal'

const CleanRulePage = (props) => {
    // 面包屑定义
    const breadcrumbPath = [applyLang('labelConsole'), applyLang('labelRuleSet'), applyLang('labelCleanRuleMgt')];

    // 对话框定义
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = (refresh) => {
        setOpenNewModal(false);
        setCleanRuleCode4Edit(undefined);
        if (refresh) {
            refreshList();
        }
    }
    const [openDispatchModal, setOpenDispatchModal] = useState(false);
    const onCloseDispatchModal = () => {
        setOpenDispatchModal(false);
        setCleanRuleCode4Dispatch(undefined);
    }

    // 数据定义
    const [cleanRuleCode4Search, setCleanRuleCode4Search] = useState();
    const [cleanRuleName4Search, setCleanRuleName4Search] = useState();
    const [cleanRuleCode4Edit, setCleanRuleCode4Edit] = useState();
    const [cleanRuleCode4Dispatch, setCleanRuleCode4Dispatch] = useState();

    // 动作定义
    const onClickSearch = () => {
        if (!isValidCode(cleanRuleCode4Search, false)) {
            alert(applyLang('msgRuleCodeInvalid'));
            return;
        }
        if (!isValidName(cleanRuleName4Search, false)) {
            alert(applyLang('msgRuleNameInvalid'));
            return;
        }
        refreshList();
    }
    const onClickEdit = (selectedCleanRuleCode)=> {
        setCleanRuleCode4Edit(selectedCleanRuleCode);
        setOpenNewModal(true);
    }
    
    const onClickDispatch = (selectedCleanRuleCode)=> {
        setCleanRuleCode4Dispatch(selectedCleanRuleCode);
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
                                <Input placeholder={applyLang('labelRuleCode')} allowClear onChange={(e) => setCleanRuleCode4Search(e.target.value)}/>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={2}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>{applyLang('promptRuleName')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height">
                                <Input placeholder={applyLang('labelRuleName')} allowClear onChange={(e) => setCleanRuleName4Search(e.target.value)}/>
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
                    <CleanRuleListBlock key={refreshListKey} cleanRuleCode4Search={cleanRuleCode4Search} cleanRuleName4Search={cleanRuleName4Search} onClickEdit={onClickEdit} onClickDispatch={onClickDispatch}/>
                </div>
            </Space>

            {openNewModal && (
                <CleanRuleNewModal cleanRuleCode4Edit={cleanRuleCode4Edit} onClose={onCloseNewModal}/>
            )}

            {openDispatchModal && (
                <CleanRuleDispatchModal cleanRuleCode4Dispatch={cleanRuleCode4Dispatch} onClose={onCloseDispatchModal}/>
            )}
        </>
    )
};

export default CleanRulePage;
