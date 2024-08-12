import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Input, Modal, Select, Space, Col, Row } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

import '../../css/common.css';
import { dateToYMDHMS, isBlankStr, genGetUrlByParams, genGetUrlBySegs, genPostUrl, isBlankArray, getTenantCode, getJwtToken, getRespModel, handleRespError, isRespSuccess } from '../../js/common.js';

const { TextArea } = Input;

const MenuNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl('/menuset/menu/put');
        axios.put(url, {
            tenantCode: getTenantCode(),
            comment: comment,
            menuCode: menuCode,
            menuName: menuName,
            imgLink: imgLink,
            validFrom: new Date(validFrom),
            menuSeriesRelList: convertToMenuSeriesRel()
        }, {
            // withCredentials: true // 这会让axios在请求中携带cookies
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            if (isRespSuccess(response)) {
                alert("here is success")
            } else {
                alert("here is wrong")
            }
        })
        .catch(error => {
            handleRespError(error);
        });

        setTimeout(() => {
            setLoading(false);
            props.onClose();
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

        let url = genGetUrlBySegs('/menuset/menu/{segment}/{segment}/get', [getTenantCode(), props.menuCode4Edit]);
        axios.get(url, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setMenuCode(model.menuCode);
            setMenuName(model.menuName);
            setImgLink(model.imgLink);
            setComment(model.comment);
            setValidFrom(dateToYMDHMS(new Date(model.validFrom)));
            setSeriesCodeList(prev => {
                return convertToSeriesCodeList(model.menuSeriesRelList);
            });
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    const fetchSeriesList4Select = () => {
        let url = genGetUrlByParams('/menuset/series/list', {
            tenantCode: getTenantCode()
        });
        axios.get(url, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setSeriesList4Select(prev => {
                let tmp = [];
                model.forEach(item => {
                    item.label = item.seriesName;
                    item.value = item.seriesCode;
                    tmp.push(item);
                })
                return tmp;
            });
        })
        .catch(error => {
            handleRespError(error);
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
            open={open}
            title="新建/编辑系列"
            onOk={onClickOK}
            onCancel={onClickCancel}
            width={550}
            style={{border: '0px solid red'}}
            footer={[
                <Button key="back" onClick={onClickCancel}>取消</Button>,
                <Button key="submit" type="primary" loading={loading} onClick={onClickOK}>提交</Button>
            ]}
        >
            <div style={{height: 300, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={4}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>菜单编码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={20}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="菜单编码" value={menuCode} disabled={isBlankStr(props.menuCode4Edit) ? false : true} onChange={(e) => setMenuCode(e.target.value)}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={4}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>菜单名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={20}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="菜单名称" value={menuName} onChange={(e) => setMenuName(e.target.value)} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={4}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>包含系列：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={20}>
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
                        <Col className="gutter-row" span={4}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>生效期：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={20}>
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
                        <Col className="gutter-row" span={4}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>备注：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={20}>
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