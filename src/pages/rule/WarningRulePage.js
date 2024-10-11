import React, { useState } from 'react';
import { Button, Input, Space, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidCode, isValidName } from '../../js/common.js';
import { applyLang } from '../../i18n/i18n';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import WarningRuleListBlock from '../../components/rule/WarningRuleListBlock'
import WarningRuleNewModal from '../../components/rule/WarningRuleNewModal'
import WarningRuleDispatchModal from '../../components/rule/WarningRuleDispatchModal'

const WarningRulePage = (props) => {
    // 面包屑定义
    const breadcrumbPath = [applyLang('labelConsole'), applyLang('labelRuleSet'), applyLang('labelWarningRuleMgt')];

    // 对话框定义
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = (refresh) => {
        setOpenNewModal(false);
        setWarningRuleCode4Edit(undefined);
        if (refresh) {
            refreshList();
        }
    }
    const [openDispatchModal, setOpenDispatchModal] = useState(false);
    const onCloseDispatchModal = () => {
        setOpenDispatchModal(false);
        setWarningRuleCode4Dispatch(undefined);
    }

    // 数据定义
    const [warningRuleCode4Search, setWarningRuleCode4Search] = useState();
    const [warningRuleName4Search, setWarningRuleName4Search] = useState();
    const [warningRuleCode4Edit, setWarningRuleCode4Edit] = useState();
    const [warningRuleCode4Dispatch, setWarningRuleCode4Dispatch] = useState();

    // 动作定义
    const onClickSearch = () => {
        if (!isValidCode(warningRuleCode4Search, false)) {
            alert(applyLang('msgRuleCodeInvalid'));
            return;
        }
        if (!isValidName(warningRuleName4Search, false)) {
            alert(applyLang('msgRuleNameInvalid'));
            return;
        }
        refreshList();
    }
    const onClickEdit = (selectedWarningRuleCode)=> {
        setWarningRuleCode4Edit(selectedWarningRuleCode);
        setOpenNewModal(true);
    }
    
    const onClickDispatch = (selectedWarningRuleCode)=> {
        setWarningRuleCode4Dispatch(selectedWarningRuleCode);
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
                                <Input placeholder={applyLang('labelRuleCode')} allowClear onChange={(e) => setWarningRuleCode4Search(e.target.value)}/>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={2}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>{applyLang('promptRuleName')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height">
                                <Input placeholder={applyLang('labelRuleName')} allowClear onChange={(e) => setWarningRuleName4Search(e.target.value)}/>
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
                    <WarningRuleListBlock key={refreshListKey} warningRuleCode4Search={warningRuleCode4Search} warningRuleName4Search={warningRuleName4Search} onClickEdit={onClickEdit} onClickDispatch={onClickDispatch}/>
                </div>
            </Space>

            {openNewModal && (
                <WarningRuleNewModal warningRuleCode4Edit={warningRuleCode4Edit} onClose={onCloseNewModal}/>
            )}

            {openDispatchModal && (
                <WarningRuleDispatchModal warningRuleCode4Dispatch={warningRuleCode4Dispatch} onClose={onCloseDispatchModal}/>
            )}
        </>
    )
};

export default WarningRulePage;
