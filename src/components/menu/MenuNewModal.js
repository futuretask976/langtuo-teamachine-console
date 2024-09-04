import React, { useEffect, useState } from 'react';
import { DatePicker, Input, Modal, Select, Space, Col, Row } from 'antd';
import dayjs from 'dayjs';

import '../../css/common.css';
import { dateToYMDHMS, isBlankStr, isBlankArray, getTenantCode, isEmptyArray, isValidCode, isValidComment, isValidName } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const { TextArea } = Input;

const MenuNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidCode(menuCode, true)) {
            alert('菜单编码不符合规则');
            return;
        }
        if (!isValidName(menuName, true)) {
            alert('菜单名称不符合规则');
            return;
        }
        if (!isValidComment(comment, false)) {
            alert('备注不符合规则');
            return;
        }
        if (isEmptyArray(seriesCodeList)) {
            alert('包含的系列不能为空');
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
            menuSeriesRelList: convertToMenuSeriesRel()
        }).then(resp => {
            if (resp.success) {
                alert("保存成功");
            } else {
                alert('保存失败：' + resp.errorMsg);
            }
        });

        setTimeout(() => {
            props.onClose();
            setLoading(false);
            setOpen(false);
        }, 1000);
    };
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据初始化相关
    const [menuCode, setMenuCode] = useState(isBlankStr(props.menuCode4Edit) ? '' : props.menuCode4Edit);
    const [menuName, setMenuName] = useState('');
    const [imgLink, setImgLink] = useState('');
    const [comment, setComment] = useState('');
    const [validFrom, setValidFrom] = useState(dateToYMDHMS(new Date()));
    const [seriesCodeList, setSeriesCodeList] = useState([]);
    const [seriesList4Select, setSeriesList4Select] = useState([]);

    // 赋值初始化相关
    const fetchMenu4Edit = () => {
        if (isBlankStr(props.menuCode4Edit)) {
            return;
        }

        get('/menuset/menu/get', {  
            tenantCode: getTenantCode(),
            menuCode: props.menuCode4Edit
        }).then(resp => {
            let model = resp.model;
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
        }).then(resp => {
            let model = resp.model;
            setSeriesList4Select(prev => {
                let tmp = [];
                model.forEach(item => {
                    item.label = item.seriesName;
                    item.value = item.seriesCode;
                    tmp.push(item);
                })
                return tmp;
            });
        });
    }
    useEffect(() => {
        fetchMenu4Edit();
    }, [props.menuCode4Edit]);
    useEffect(() => {
        fetchSeriesList4Select();
    }, []);
    

    // 输入相关
    const onChangeSeriesCodeList = (e) => {
        setSeriesCodeList(prev => {
            return e;
        })
    }
    const onChangeValidFrom = (date, dateString) => {
        setValidFrom(dateString);
    }
    const convertToMenuSeriesRel = () => {
        if (isBlankArray(seriesCodeList)) {
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
        if (isBlankArray(menuSeriesRelList)) {
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
            style={{border: '0px solid red'}}
            title="新建/编辑菜单"
            width={550}
        >
            <div style={{height: 300, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>菜单编码：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="菜单编码" value={menuCode} disabled={isBlankStr(props.menuCode4Edit) ? false : true} onChange={(e) => setMenuCode(e.target.value)}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>菜单名称：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="菜单名称" value={menuName} onChange={(e) => setMenuName(e.target.value)} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>包含系列：</span>
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
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>生效期：</span></Space>
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
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>备注：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <TextArea rows={3} placeholder="备注" maxLength={200} value={comment} onChange={(e) => setComment(e.target.value)}/>
                            </div>
                        </Col>
                    </Row>
                </Space>
            </div>
        </Modal>
    );
};
 
export default MenuNewModal;