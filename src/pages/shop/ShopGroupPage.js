import React, { useContext, useState } from 'react';
import { Button, Input, Space, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import { FramePageContext } from '../../js/context'
import '../../css/common.css';
import { isValidName } from '../../js/common';
import { getLang } from '../../i18n/i18n';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import ShopGroupListBlock from '../../components/shop/ShopGroupListBlock'
import ShopGroupNewModal from '../../components/shop/ShopGroupNewModal'

const ShopGroupPage = () => {
    // 上下文定义
    const { lang } = useContext(FramePageContext);

    // 面包屑定义
    const breadcrumbPath = [getLang(lang, 'labelConsole'), getLang(lang, 'labelShopSet'), getLang(lang, 'labelShopGroupMgt')];

    // 对话框定义
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = (refresh) => {
        setOpenNewModal(false);
        setShopGroupCode4Edit(undefined);
        if (refresh) {
            refreshList();
        }
    }

    // 数据定义
    const [shopGroupName4Search, setShopGroupName4Search] = useState();
    const [shopGroupCode4Edit, setShopGroupCode4Edit] = useState();

    // 动作定义
    const onClickSearch = () => {
        if (!isValidName(shopGroupName4Search, false)) {
            alert(getLang(lang, 'msgShopGroupNameInvalid'));
            return;
        }
        refreshList();
    }
    const onClickEdit = (selectedShopGroupCode)=> {
        setShopGroupCode4Edit(selectedShopGroupCode);
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
                                <span>{getLang(lang, 'promptShopGroupName')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={getLang(lang, 'labelShopGroupName')} allowClear onChange={(e) => setShopGroupName4Search(e.target.value)} style={{width: '95%'}} />
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>{getLang(lang, 'labelBeginSearch')}</Button>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>{getLang(lang, 'labelNew')}</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="full-width" style={{alignItems: 'center', backgroundColor: 'red', height: 740}}>
                    <ShopGroupListBlock key={refreshListKey} shopGroupName4Search={shopGroupName4Search} onClickEdit={onClickEdit} />
                </div>
            </Space>

            {openNewModal && (
                <ShopGroupNewModal onClose={onCloseNewModal} shopGroupCode4Edit={shopGroupCode4Edit} />
            )}
        </>
    )
};

export default ShopGroupPage;
