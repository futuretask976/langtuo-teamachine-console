import React, { useEffect, useState } from 'react';
import { DatePicker, Input, Modal, Select, Space, Col, Row } from 'antd';
import dayjs from 'dayjs';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { dateToYMDHMS, getTenantCode, isArray, isBlankStr, isEmptyArray, isValidCode, isValidComment, isValidName } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const { TextArea } = Input;

const MenuNewModal = (props) => {
    // 对话框定义
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidCode(menuCode, true)) {
            alert(applyLang('msgMenuCodeInvalid'));
            return;
        }
        if (!isValidName(menuName, true)) {
            alert(applyLang('msgMenuNameInvalid'));
            return;
        }
        if (!isValidComment(comment, false)) {
            alert(applyLang('msgCommentInvalid'));
            return;
        }
        if (isEmptyArray(seriesCodeList)) {
            alert(applyLang('msgSeriesListEmpty'));
            return;
        }

        setLoading(true);
        put('/menuset/menu/put', {
            tenantCode: getTenantCode(),
            comment: comment,
            menuCode: menuCode,
            menuName: menuName,
            imgLink: imgLink,
            validFrom: new Date(validFrom),
            menuSeriesRelList: convertToMenuSeriesRel(),
            putNew: putNew
        }).then(respData => {
            if (respData.success) {
                alert(applyLang('msgPutSucceed'));
                setLoading(false);
                props.onClose(true);
                setOpen(false);
            } else {
                alert(applyLang('msgPutFailed') + respData.errorMsg);
                setLoading(false);
            }
        });
    };
    const onClickCancel = () => {
        props.onClose(false);
        setOpen(false);
    };

    // 数据定义
    const putNew = props.menuCode4Edit === undefined ? true : false;
    const [menuCode, setMenuCode] = useState();
    const [menuName, setMenuName] = useState();
    const [imgLink, setImgLink] = useState();
    const [comment, setComment] = useState();
    const [validFrom, setValidFrom] = useState(dateToYMDHMS(new Date()));
    const [seriesCodeList, setSeriesCodeList] = useState();
    const [seriesList4Select, setSeriesList4Select] = useState();

    // 初始化定义
    const fetchMenu4Edit = () => {
        if (isBlankStr(props.menuCode4Edit)) {
            return;
        }

        get('/menuset/menu/get', {  
            tenantCode: getTenantCode(),
            menuCode: props.menuCode4Edit
        }).then(respData => {
            let model = respData.model;
            setMenuCode(model.menuCode);
            setMenuName(model.menuName);
            setImgLink(model.imgLink);
            setComment(model.comment);
            setValidFrom(dateToYMDHMS(new Date(model.validFrom)));
            setSeriesCodeList(prev => {
                return convertToSeriesCodeList(model.menuSeriesRelList);
            });
        });
    }
    const fetchSeriesList4Select = () => {
        get('/menuset/series/list', {  
            tenantCode: getTenantCode()
        }).then(respData => {
            let model = respData.model;
            setSeriesList4Select(prev => {
                let tmp = [];
                if (isArray(respData.model)) {
                    respData.model.forEach(item => {
                        item.label = item.seriesName;
                        item.value = item.seriesCode;
                        tmp.push(item);
                    });
                }
                return tmp;
            });
        });
    }
    useEffect(() => {
        fetchSeriesList4Select();
        fetchMenu4Edit();
    }, []);
    

    // 输入定义
    const onChangeSeriesCodeList = (e) => {
        setSeriesCodeList(prev => {
            return e;
        })
    }
    const onChangeValidFrom = (date, dateString) => {
        setValidFrom(dateString);
    }
    const convertToMenuSeriesRel = () => {
        if (isEmptyArray(seriesCodeList)) {
            return [];
        }
        let tmp = [];
        seriesCodeList.forEach(seriesCode => {
            tmp.push({
                menuCode: menuCode,
                seriesCode: seriesCode
            });
        });
        return tmp;
    }
    const convertToSeriesCodeList = (menuSeriesRelList) => {
        if (isEmptyArray(menuSeriesRelList)) {
            return [];
        }
        let tmp = [];
        menuSeriesRelList.forEach(menuSeriesRel => {
            tmp.push(menuSeriesRel.seriesCode);
        });
        return tmp;
    }
 
    return (
        <Modal
            centered
            confirmLoading={loading}
            open={open}
            onOk={onClickOK}
            onCancel={onClickCancel}
            title={applyLang('labelNewOrEdit')}
            width={550}
        >
            <div style={{height: 300, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptMenuCode')}</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={applyLang('labelMenuCode')} value={menuCode} disabled={isBlankStr(props.menuCode4Edit) ? false : true} onChange={(e) => setMenuCode(e.target.value)}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptMenuName')}</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={applyLang('labelMenuName')} value={menuName} onChange={(e) => setMenuName(e.target.value)} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>{applyLang('promptIncludeSeries')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Select
                                    mode='multiple'
                                    onChange={onChangeSeriesCodeList}
                                    options={seriesList4Select}
                                    style={{width: '100%'}}
                                    value={seriesCodeList}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptValidTime')}</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <DatePicker
                                    format={{
                                        format: 'YYYY-MM-DD HH:mm:ss',
                                        type: 'mask',
                                    }}
                                    onChange={onChangeValidFrom}
                                    value={dayjs(validFrom, 'YYYY-MM-DD HH:mm:ss')}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-end', height: '100%'}}>
                                <span>{applyLang('promptComment')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <TextArea rows={2} placeholder={applyLang('labelComment')} maxLength={200} value={comment} onChange={(e) => setComment(e.target.value)}/>
                            </div>
                        </Col>
                    </Row>
                </Space>
            </div>
        </Modal>
    );
};
 
export default MenuNewModal;