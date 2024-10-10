import React, { useContext, useState } from 'react';
import { Button, Input, Space, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import { FramePageContext } from '../../js/context'
import '../../css/common.css';
import { isValidCode, isValidName } from '../../js/common.js';
import { getLang } from '../../i18n/i18n';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import ToppingTypeListBlock from '../../components/drink/ToppingTypeListBlock'
import ToppingTypeNewModal from '../../components/drink/ToppingTypeNewModal'

const ToppingTypePage = () => {
    // 上下文定义
    const { lang } = useContext(FramePageContext);

    // 面包屑定义
    const breadcrumbPath = ['控制台', '饮品', '物料类型管理'];

    // 对话框定义
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = (refresh) => {
        setOpenNewModal(false);
        setToppingTypeCode4Edit(undefined);
        if (refresh) {
            refreshList();
        }
    }

    // 数据定义
    const [toppingTypeCode4Search, setToppingTypeCode4Search] = useState();
    const [toppingTypeName4Search, setToppingTypeName4Search] = useState();
    const [toppingTypeCode4Edit, setToppingTypeCode4Edit] = useState();

    // 动作定义
    const onClickSearch = () => {
        if (!isValidCode(toppingTypeCode4Search, false)) {
            alert(getLang(lang, 'msgToppingTypeCodeInvalid'));
            return;
        }
        if (!isValidName(toppingTypeName4Search, false)) {
            alert(getLang(lang, 'msgToppingTypeNameInvalid'));
            return;
        }
        refreshList();
    }
    const onClickEdit = (selectedToppingTypeCode)=> {
        setToppingTypeCode4Edit(selectedToppingTypeCode);
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
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <span>{getLang(lang, "toppingTypeCode")}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={getLang(lang, "toppingTypeCode")} allowClear onChange={(e) => setToppingTypeCode4Search(e.target.value)} style={{width: '95%'}} />
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={2}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <span>{getLang(lang, "toppingTypeName")}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={getLang(lang, "toppingTypeName")} allowClear onChange={(e) => setToppingTypeName4Search(e.target.value)} style={{width: '95%'}} />
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>{getLang(lang, "beginSearch")}</Button>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>{getLang(lang, "newToppingType")}</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="full-width" style={{alignItems: 'center', backgroundColor: 'red', height: 740}}>
                    <ToppingTypeListBlock key={refreshListKey} toppingTypeCode4Search={toppingTypeCode4Search} toppingTypeName4Search={toppingTypeName4Search} onClickEdit={onClickEdit} />
                </div>
            </Space>

            {openNewModal && (
                <ToppingTypeNewModal onClose={onCloseNewModal} toppingTypeCode4Edit={toppingTypeCode4Edit} />
            )}
        </>
    )
};

export default ToppingTypePage;
