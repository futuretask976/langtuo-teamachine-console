import React, { useEffect, useState } from 'react';
import { Input, Modal, Select, Space, Col, Row } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { getTenantCode, isArray, isBlankStr, isEmptyArray, isValidCode, isValidComment, isValidName } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const { TextArea } = Input;

const SeriesNewModal = (props) => {
    // 对话框定义
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidCode(seriesCode, true)) {
            alert('系列编码不符合规则');
            return;
        }
        if (!isValidName(seriesName, true)) {
            alert('系列名称不符合规则');
            return;
        }
        if (!isValidComment(comment, false)) {
            alert('备注不符合规则');
            return;
        }
        if (isEmptyArray(teaCodeList)) {
            alert('包含的茶品不能为空');
            return;
        }

        setLoading(true);
        put('/menuset/series/put', {
            tenantCode: getTenantCode(),
            comment: comment,
            seriesCode: seriesCode,
            seriesName: seriesName,
            imgLink: imgLink,
            seriesTeaRelList: convertToSeriesTeaRel(),
            putNew: putNew
        }).then(respData => {
            if (respData.success) {
                alert("保存成功");
                setLoading(false);
                props.onClose(true);
                setOpen(false);
            } else {
                alert('保存失败：' + respData.errorMsg);
                setLoading(false);
            }
        });
    };
    const onClickCancel = () => {
        props.onClose(false);
        setOpen(false);
    };

    // 数据定义
    const putNew = props.seriesCode4Edit == undefined ? true : false;
    const [seriesCode, setSeriesCode] = useState();
    const [seriesName, setSeriesName] = useState();
    const [imgLink, setImgLink] = useState();
    const [comment, setComment] = useState();
    const [teaCodeList, setTeaCodeList] = useState();
    const [teaList4Select, setTeaList4Select] = useState();

    // 初始化定义
    const fetchSeries4Edit = async () => {
        if (isBlankStr(props.seriesCode4Edit)) {
            return;
        }

        get('/menuset/series/get', {  
            tenantCode: getTenantCode(),
            seriesCode: props.seriesCode4Edit
        }).then(respData => {
            let model = respData.model;
            setSeriesCode(model.seriesCode);
            setSeriesName(model.seriesName);
            setImgLink(model.imgLink);
            setComment(model.comment);
            setTeaCodeList(convertToTeaCodeList(model.seriesTeaRelList));
        });
    }
    const fetchTeaList4Select = () => {
        get('/drinkset/tea/list', {  
            tenantCode: getTenantCode()
        }).then(respData => {
            setTeaList4Select(() => {
                let tmp = [];
                if (isArray(respData.model)) {
                    respData.model.forEach(item => {
                        item.label = item.teaName;
                        item.value = item.teaCode;
                        tmp.push(item);
                    });
                }
                return tmp;
            });
        });
    }
    useEffect(() => {
        fetchTeaList4Select();
        fetchSeries4Edit();
    }, []);

    // 输入定义
    const convertToSeriesTeaRel = () => {
        if (isEmptyArray(teaCodeList)) {
            return [];
        }
        let tmp = [];
        teaCodeList.forEach(teaCode => {
            tmp.push({
                seriesCode: seriesCode,
                teaCode: teaCode
            });
        });
        return tmp;
    }
    const convertToTeaCodeList = (seriesTeaRelList) => {
        if (isEmptyArray(seriesTeaRelList)) {
            return [];
        }
        let tmp = [];
        seriesTeaRelList.forEach(seriesTeaRel => {
            tmp.push(seriesTeaRel.teaCode);
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
            title="新建/编辑系列"
            width={650}
        >
            <div style={{height: 300, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={4}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>系列编码：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={20}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="系列编码" value={seriesCode} disabled={isBlankStr(props.seriesCode4Edit) ? false : true} onChange={(e) => setSeriesCode(e.target.value)}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={4}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>系列名称：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={20}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="物料名称" value={seriesName} onChange={(e) => setSeriesName(e.target.value)}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={4}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <Space size='small'><span style={{color: 'red'}}>*</span><span>包含茶品：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={20}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Select
                                    mode='multiple'
                                    onChange={(e) =>  setTeaCodeList(e)}
                                    options={teaList4Select}
                                    style={{width: '100%'}}
                                    value={teaCodeList}
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
 
export default SeriesNewModal;