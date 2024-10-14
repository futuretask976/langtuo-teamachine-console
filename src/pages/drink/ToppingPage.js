import React, { useState } from 'react';
import { Button, Input, Space, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidCode, isValidName } from '../../js/common.js';
import { applyLang } from '../../i18n/i18n';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import ToppingListBlock from '../../components/drink/ToppingListBlock'
import ToppingNewModal from '../../components/drink/ToppingNewModal'

const ToppingPage = () => {
    // 面包屑定义
    const breadcrumbPath = [applyLang('labelConsole'), applyLang('labelDeviceSet'), applyLang('labelToppingMgt')];

    // 对话框定义
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = (refresh) => {
        setOpenNewModal(false);
        setToppingCode4Edit(undefined);
        if (refresh) {
            refreshList();
        }
    }

    // 数据定义
    const [toppingCode4Search, setToppingCode4Search] = useState();
    const [toppingName4Search, setToppingName4Search] = useState();
    const [toppingCode4Edit, setToppingCode4Edit] = useState();

    // 动作定义
    const onClickSearch = () => {
        if (!isValidCode(toppingCode4Search, false)) {
            alert(applyLang('msgToppingCodeInvalid'));
            return;
        }
        if (!isValidName(toppingName4Search, false)) {
            alert(applyLang('msgToppingNameInvalid'));
            return;
        }
        refreshList();
    }
    const onClickEdit = (selectedToppingCode)=> {
        setToppingCode4Edit(selectedToppingCode);
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
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>{applyLang('promptToppingCode')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={applyLang('labelToppingCode')} allowClear onChange={(e) => setToppingCode4Search(e.target.value)} style={{width: '95%'}}/>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>{applyLang('promptToppingName')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={applyLang('labelToppingName')} allowClear onChange={(e) => setToppingName4Search(e.target.value)} style={{width: '95%'}}/>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>{applyLang('labelBeginSearch')}</Button>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>{applyLang('labelNew')}</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="full-width" style={{alignItems: 'center', backgroundColor: 'red', height: 740}}>
                    <ToppingListBlock key={refreshListKey} toppingCode4Search={toppingCode4Search} toppingName4Search={toppingName4Search} onClickEdit={onClickEdit} />
                </div>
            </Space>

            {openNewModal && (
                <ToppingNewModal onClose={onCloseNewModal} toppingCode4Edit={toppingCode4Edit} />
            )}
        </>
    )
};

export default ToppingPage;
