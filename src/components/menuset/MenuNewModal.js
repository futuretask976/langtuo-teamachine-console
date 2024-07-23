import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Input, Modal, Select, Spin, Upload, Col, Row, message } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import axios from 'axios';
import dayjs from 'dayjs';
import OSS from 'ali-oss';

import '../../css/common.css';
import { dateToYMDHMS, isBlankStr, genGetUrlByParams, genGetUrlBySegs, genPostUrl, isBlankArray } from '../../js/common.js';

const { TextArea } = Input;

const MenuNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl('/menuset/menu/put');
        axios.put(url, {
            withCredentials: true, // 这会让axios在请求中携带cookies
            tenantCode: 'tenant_001',
            comment: comment,
            extraInfo: {
                testA: 'valueA',
                testB: 'valueB'
            },
            menuCode: menuCode,
            menuName: menuName,
            imgLink: imgLink,
            validFrom: new Date(validFrom),
            menuSeriesRelList: convertToMenuSeriesRel()
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
    const [menuCode, setMenuCode] = useState(isBlankStr(props.menuCode4Edit) ? '' : props.menuCode4Edit);
    const [menuName, setMenuName] = useState('');
    const [imgLink, setImgLink] = useState('');
    const [comment, setComment] = useState('');
    const [validFrom, setValidFrom] = useState(dateToYMDHMS(new Date()));
    const [seriesCodeList, setSeriesCodeList] = useState([]);
    useEffect(() => {
        if (isBlankStr(props.menuCode4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/menuset/menu/{segment}/{segment}/get', ['tenant_001', props.menuCode4Edit]);
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setMenuCode(response.data.model.menuCode);
                setMenuName(response.data.model.menuName);
                setImgLink(response.data.model.imgLink);
                setComment(response.data.model.comment);
                setValidFrom(dateToYMDHMS(new Date(response.data.model.validFrom)));
                setSeriesCodeList(prev => {
                    return convertToSeriesCodeList(response.data.model.menuSeriesRelList);
                });
                if (!isBlankStr(response.data.model.imgLink)) {
                    setFileList(prev => {
                        return [{url: getPresignedUrl(response.data.model.imgLink)}];
                    });
                }
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
    }, [props.menuCode4Edit]);
    const [seriesList4Select, setSeriesList4Select] = useState([]);
    useEffect(() => {
        let url = genGetUrlByParams('/menuset/series/list', {
            tenantCode: 'tenant_001'
        });
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setSeriesList4Select(prev => {
                    let tmp = [];
                    response.data.model.forEach(item => {
                        item.label = item.seriesName;
                        item.value = item.seriesCode;
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
    const onChangeMenuCode = (e) => {
        setMenuCode(e.target.value);
    }
    const onChangeMenuName = (e) => {
        setMenuName(e.target.value);
    }
    const onChangeComment = (e) => {
        setComment(e.target.value);
    }
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

    // 上传文件相关
    // 上一个组件传来的修改资源URL的函数，可用于展示远程的资源
    // const changeSrc = props.changeSrc;
    const [show, changeShow] = useState(false);
    const [fileList, setFileList] = useState([]);
 
    const ossClient = new OSS({
        region: "oss-cn-hangzhou", //你的oss服务器所在区域
        accessKeyId: "LTAI5tRoDh1tQPDtLTof7QZu",
        accessKeySecret: "SdFJQodAC8Zi6ljLIYlJ9ChP5eRul9",
        bucket: "miya-bucket2", // oss上你的bucket名称
    });

    const uploadPath = (path, file) => {
        return `${path}/${file.name.split(".")[0]}-${file.uid}.${
            file.type.split("/")[1]
        }`;
    };

    const OssUpload = async (option) => {
        const { file, onSuccess, onProgress, onError } = option;
        const folder = "teamachine";
        const url = uploadPath(folder, file);
        let data = null;
        try {
            data = await ossClient.multipartUpload(url, file, {
                progress: function (p) {
                    console.log("获取进度条的值==>", (p * 100).toFixed(2));
                    onProgress({ percent: (p * 100).toFixed(2) }, file);
                },
            });
            onSuccess(
                data,
                file,
            );
        } catch (e) {
            // message.error(e.message);
            onError(e);
        }
    };
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return (isJpgOrPng && isLt2M) || Upload.LIST_IGNORE;
    };
    const getPresignedUrl = (objectName) => { 
        if (isBlankStr(objectName)) {
            return '';
        }      
        try {
          // 生成预签名URL
          const url = ossClient.signatureUrl(objectName, {
            expires: 3600, // URL有效时长，单位为秒，默认为3600秒
            method: 'GET', // 允许的HTTP方法，默认为'GET'
          });
          console.log(url);
          return url;
        } catch (e) {
          console.error(e);
        }
        return '';
    }
    const uploadProps = {
        showUploadList: true,
        customRequest: OssUpload,
        beforeUpload: beforeUpload,
        fileList: fileList,
        listType: "picture-card",
        maxCount: 1,
        onProgress({ percent }, file) {
            const index = fileList.findIndex((item) => item.uid === file.uid);
            fileList[index].percent = percent;
            setFileList([...fileList]);
        },
        onChange(info) {
            if (info.file.status !== "uploading") {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === "done") {
                message.success(`${info.file.name} 文件上传成功`);
                console.log('$$$$$ info.file.response.name=', info.file.response.name);
                console.log('$$$$$ info.file.status=done, info=', info);
                console.log('$$$$$ info.file.status=done, fileList=', fileList);
                setImgLink(info.file.response.name);
            } else if (info.file.status === "error") {
                info.fileList = info.fileList.filter(
                    (item) => item.uid !== info.file.uid,
                );
                message.error(`${info.file.name} 文件上传失败`);
            }
            setFileList([...info.fileList]);
        },
    };
    const uploadButton = (
        <div>
          <PlusOutlined />
          <div className="ant-upload-text">Upload</div>
        </div>
    );
 
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
                <Button key="submit" type="primary" loading={loading} onClick={onClickOK}>提交</Button>
            ]}
        >
            <div style={{height: 425, width: '100%'}}>
                <Row style={{width: '100%'}}>
                    <Col className="gutter-row" span={4}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <span>菜单编码：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={20}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder="菜单编码" value={menuCode} onChange={onChangeMenuCode} disabled={isBlankStr(props.menuCode4Edit) ? false : true} />
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
                            <span>菜单名称：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={20}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder="菜单名称" value={menuName} onChange={onChangeMenuName} />
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
                <Row style={{height: 20, width: '100%'}}>
                    <Col className="gutter-row" span={24}>
                        &nbsp;
                    </Col>
                </Row> 
                <Row style={{width: '100%'}}>
                    <Col className="gutter-row" span={4}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <span>上传图片：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={20}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            {show === true ? (
                                <Spin style={{ position: "relative", left: "40px" }} />
                            ) : (
                                <Upload {...uploadProps}>{uploadButton}</Upload>
                            )}
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
                            <TextArea rows={3} placeholder="备注" maxLength={200} value={comment} onChange={onChangeComment}/>
                        </div>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
};
 
export default MenuNewModal;