import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Select, Col, Row } from 'antd';
import axios from 'axios';

import '../css/common.css';
import { isBlankStr, genGetUrlByParams, genGetUrlBySegs, genPostUrl, isBlankArray } from '../js/common.js';

const { TextArea } = Input;

const SeriesNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl('/menuset/series/put');
        axios.put(url, {
            withCredentials: true, // 这会让axios在请求中携带cookies
            tenantCode: 'tenant_001',
            comment: comment,
            extraInfo: {
                testA: 'valueA',
                testB: 'valueB'
            },
            seriesCode: seriesCode,
            seriesName: seriesName,
            imgLink: imgLink,
            seriesTeaRelList: convertToSeriesTeaRel()
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                alert("here is success")
            } else {
                alert("here is wrong")
            }
        })
        .catch(error => {
            alert("here is error")
            // console.error('error: ', error);
            // console.error('error.response: ', error.response);
            // console.error('error.response.status: ', error.response.status);
            if (error && error.response && error.response.status === 401) {
                // window.location.href="/gxadmin/login";
            }
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
    const [seriesCode, setSeriesCode] = useState(isBlankStr(props.seriesCode4Edit) ? '' : props.seriesCode4Edit);
    const [seriesName, setSeriesName] = useState('');
    const [imgLink, setImgLink] = useState('');
    const [comment, setComment] = useState('');
    const [teaCodeList, setTeaCodeList] = useState([]);
    useEffect(() => {
        if (isBlankStr(props.seriesCode4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/menuset/series/{segment}/{segment}/get', ['tenant_001', props.seriesCode4Edit]);
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setSeriesCode(response.data.model.seriesCode);
                setSeriesName(response.data.model.seriesName);
                setImgLink(response.data.model.imgLink);
                setComment(response.data.model.comment);
                setTeaCodeList(prev => {
                    return convertToTeaCodeList(response.data.model.seriesTeaRelList);
                });
            }
        })
        .catch(error => {
            // console.error('error: ', error);
            // console.error('error.response: ', error.response);
            // console.error('error.response.status: ', error.response.status);
            if (error && error.response && error.response.status === 401) {
                // window.location.href="/gxadmin/login";
            }
        });
    }, [props.toppingTypeCode4Edit]);
    const [teaList4Select, setTeaList4Select] = useState([]);
    useEffect(() => {
        let url = genGetUrlByParams('/drinkset/tea/list', {
            tenantCode: 'tenant_001'
        });
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setTeaList4Select(prev => {
                    let tmp = [];
                    response.data.model.forEach(item => {
                        item.label = item.teaName;
                        item.value = item.teaCode;
                        tmp.push(item);
                    })
                    return tmp;
                })
            }
        })
        .catch(error => {
            // console.error('error: ', error);
            // console.error('error.response: ', error.response);
            // console.error('error.response.status: ', error.response.status);
            if (error && error.response && error.response.status === 401) {
                // window.location.href="/gxadmin/login";
            }
        });
    }, []);
    

    // 输入相关
    const onChangeSeriesCode = (e) => {
        setSeriesCode(e.target.value);
    }
    const onChangeSeriesName = (e) => {
        setSeriesName(e.target.value);
    }
    const onChangeImgLink = (e) => {
        setImgLink(e.target.value);
    }
    const onChangeComment = (e) => {
        setComment(e.target.value);
    }
    const onChangeTeaCodeList = (e) => {
        setTeaCodeList(prev => {
            return e;
        })
    }
    const convertToSeriesTeaRel = () => {
        if (isBlankArray(teaCodeList)) {
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
        console.log('$$$$$ SeriesNewModal#convertToTeaCodeList seriesTeaRelList=', seriesTeaRelList)
        if (isBlankArray(seriesTeaRelList)) {
            return [];
        }
        let tmp = [];
        seriesTeaRelList.forEach(seriesTeaRel => {
            tmp.push(seriesTeaRel.teaCode);
        });
        console.log('$$$$$ SeriesNewModal#convertToTeaCodeList exiting=', tmp)
        return tmp;
    }
 
    return (
        <Modal
            centered
            open={open}
            title="新建系列"
            onOk={onClickOK}
            onCancel={onClickCancel}
            width={550}
            style={{border: '0px solid red'}}
            footer={[
                <Button key="back" onClick={onClickCancel}>取消</Button>,
                <Button key="submit" type="primary" loading={loading} onClick={onClickOK}>
                    提交
                </Button>,
            ]}
        >
            <div style={{height: 350, width: '100%'}}>
                <Row style={{width: '100%'}}>
                    <Col className="gutter-row" span={4}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <span>系列编码：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={20}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder="系列编码" value={seriesCode} onChange={onChangeSeriesCode} disabled={isBlankStr(props.seriesCode4Edit) ? false : true} />
                        </div>
                    </Col>
                </Row>
                <Row style={{height: 20, width: '100%'}}>
                    <Col className="gutter-row" span={24}>
                        &nbsp;
                    </Col>
                </Row>
                <Row style={{width: '100%'}}>
                    <Col className="gutter-row" span={4}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <span>系列名称：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={20}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder="物料名称" value={seriesName} onChange={onChangeSeriesName} />
                        </div>
                    </Col>
                </Row>
                <Row style={{height: 20, width: '100%'}}>
                    <Col className="gutter-row" span={24}>
                        &nbsp;
                    </Col>
                </Row>
                <Row style={{width: '100%'}}>
                    <Col className="gutter-row" span={4}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <span>包含茶品：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={20}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Select
                                mode='multiple'
                                onChange={onChangeTeaCodeList}
                                options={teaList4Select}
                                style={{width: '100%'}}
                                value={teaCodeList}
                            />
                        </div>
                    </Col>
                </Row>
                <Row style={{height: 20, width: '100%'}}>
                    <Col className="gutter-row" span={24}>
                        &nbsp;
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
                            <TextArea rows={5} placeholder="备注" maxLength={200} value={comment} onChange={onChangeComment}/>
                        </div>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
};
 
export default SeriesNewModal;