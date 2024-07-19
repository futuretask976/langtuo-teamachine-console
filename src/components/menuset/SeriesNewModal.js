import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Select, Spin, Upload, Col, Row, message } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import axios from 'axios';
import OSS from 'ali-oss';

import '../../css/common.css';
import { isBlankStr, genGetUrl, genGetUrlByParams, genGetUrlBySegs, genPostUrl, isBlankArray, OSS_CONFIG_BUCKET, OSS_CONFIG_REGION } from '../../js/common.js';

const { TextArea } = Input;

const SeriesNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        axios.put(genPostUrl('/menuset/series/put'), {
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

    // oss初始化相关
    const fetchOSSToken = async () => {
        try {
            const response = await axios.get(genGetUrl('/securityset/oss/token/get'), {
                withCredentials: true // 这会让axios在请求中携带cookies
            });
            if (response && response.data && response.data.success) {
                console.log('$$$$$ response.data.model=', response.data.model);
                return response.data.model;
            }
        } catch (error) {
            // console.error('error: ', error);
            // console.error('error.response: ', error.response);
            // console.error('error.response.status: ', error.response.status);
            if (error && error.response && error.response.status === 401) {
            }
        }
    }

    // 数据初始化相关
    const [seriesCode, setSeriesCode] = useState(isBlankStr(props.seriesCode4Edit) ? '' : props.seriesCode4Edit);
    const [seriesName, setSeriesName] = useState('');
    const [imgLink, setImgLink] = useState('');
    const [comment, setComment] = useState('');
    const [teaCodeList, setTeaCodeList] = useState([]);
    const [teaList4Select, setTeaList4Select] = useState([]);
    const fetchSeries4Edit = async () => {
        if (isBlankStr(props.seriesCode4Edit)) {
            return;
        }

        try {
            const response = await axios.get(genGetUrlBySegs('/menuset/series/{segment}/{segment}/get', ['tenant_001', props.seriesCode4Edit]), {
                withCredentials: true // 这会让axios在请求中携带cookies
            });
            if (response && response.data && response.data.success) {
                let model = response.data.model;
                setSeriesCode(model.seriesCode);
                setSeriesName(model.seriesName);
                setImgLink(model.imgLink);
                setComment(model.comment);
                setTeaCodeList(convertToTeaCodeList(model.seriesTeaRelList));
                
                if (!isBlankStr(model.imgLink)) {
                    let sts = await fetchOSSToken();
                    setFileList([{url: getPresignedUrl(model.imgLink, sts)}]);
                }
            }
        } catch (error) {
            // console.error('error: ', error);
            // console.error('error.response: ', error.response);
            // console.error('error.response.status: ', error.response.status);
            if (error && error.response && error.response.status === 401) {
            }
        }
    }
    const fetchTeaList4Select = () => {
        axios.get(genGetUrlByParams('/drinkset/tea/list', {tenantCode: 'tenant_001'}), {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                let model = response.data.model;
                setTeaList4Select(() => {
                    let tmp = [];
                    model.forEach(item => {
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
    }
    useEffect(() => {
        fetchTeaList4Select();
    }, []);
    useEffect(() => {
        fetchSeries4Edit();
    }, [props.seriesCode4Edit]);

    // 输入相关
    const onChangeSeriesCode = (e) => {
        setSeriesCode(e.target.value);
    }
    const onChangeSeriesName = (e) => {
        setSeriesName(e.target.value);
    }
    const onChangeComment = (e) => {
        setComment(e.target.value);
    }
    const onChangeTeaCodeList = (e) => {
        setTeaCodeList(e)
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
        if (isBlankArray(seriesTeaRelList)) {
            return [];
        }
        let tmp = [];
        seriesTeaRelList.forEach(seriesTeaRel => {
            tmp.push(seriesTeaRel.teaCode);
        });
        return tmp;
    }

    // 上传文件相关
    // 上一个组件传来的修改资源URL的函数，可用于展示远程的资源
    const [fileList, setFileList] = useState([]);
    const uploadPath = (path, file) => {
        return `${path}/${file.name.split(".")[0]}-${file.uid}.${
            file.type.split("/")[1]
        }`;
    };
    const OssUpload = async (option) => {
        const { file, onSuccess, onProgress, onError } = option;
        const url = uploadPath(OSS_CONFIG_BUCKET, file);
        let sts = await fetchOSSToken();
        const ossClient = new OSS({
            region: OSS_CONFIG_REGION,
            bucket: OSS_CONFIG_BUCKET,
            accessKeyId: sts.accessKeyId,
            accessKeySecret: sts.accessKeySecret,
            stsToken: sts.securityToken
        });
        let data = null;
        try {
            data = await ossClient.multipartUpload(url, file, {
                progress: function (p) {
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
    const getPresignedUrl = (objectName, sts) => { 
        if (isBlankStr(objectName)) {
            return '';
        }
        const ossClient = new OSS({
            region: OSS_CONFIG_REGION, // 你的oss服务器所在区域
            bucket: OSS_CONFIG_BUCKET, // oss上你的bucket名称
            accessKeyId: sts.accessKeyId,
            accessKeySecret: sts.accessKeySecret,
            stsToken: sts.securityToken
        });
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
                <Button key="submit" type="primary" loading={loading} onClick={onClickOK}>
                    提交
                </Button>,
            ]}
        >
            <div style={{height: 425, width: '100%'}}>
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
                            <span>上传图片：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={20}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Upload {...uploadProps}>{uploadButton}</Upload>
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