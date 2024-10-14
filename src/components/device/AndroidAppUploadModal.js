import React, { useEffect, useState } from 'react';
import { Input, Modal, Space, Spin, Upload, message } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import OSS from 'ali-oss';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { isBlankStr, isValidComment, isValidVersion } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const AndroidAppUploadModal = (props) => {
    // OSS 定义
    const getOSSToken = async () => {
        const model = await get('/securityset/oss/token/get', {
        }).then(resp => {
            let model = resp.model;
            return model;
        });
        return model;
    }
    const getAliOssClient = async () => {
        const data = await getOSSToken();
        const parseMast = {
            bucket: data.bucketName,
            region: data.region,
            accessKeyId: data.accessKeyId,
            accessKeySecret: data.accessKeySecret,
            stsToken: data.securityToken,
            expiration: data.expiration,
            refreshSTSToken: async () => {
                const info = await getOSSToken()
                return {
                    accessKeyId: info.accessKeyId,
                    accessKeySecret: info.accessKeySecret,
                    stsToken: info.securityToken
                }
            },
            // 刷新临时访问凭证的时间间隔，单位为毫秒，在过期前一分钟刷新
            // 过期时间是后端配的，这里配合后端把时间写死也可以，例如 15 分钟过期，10 分钟就可以刷新一次
            refreshSTSTokenInterval: new Date(data.expiration) - new Date() - 1000 * 60
        }
        return new OSS(parseMast) // 调用OSS依赖
    }

    // 对话框定义
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidVersion(version, true)) {
            alert(applyLang('msgVersionInvalid'));
            return;
        }
        if (isBlankStr(ossPath)) {
            alert(applyLang('msgOssPathInvalid'));
            return;
        }
        if (!isValidComment(comment, false)) {
            alert(applyLang('msgCommentInvalid'));
            return;
        }

        setLoading(true);
        put('/deviceset/android/app/put', {
            version: version,
            ossPath: ossPath,
            comment: comment,
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
    const putNew = props.version4Edit == undefined ? true : false;
    const [version, setVersion] = useState();
    const [ossPath, setOssPath] = useState();
    const [comment, setComment] = useState();
    const [fileList, setFileList] = useState();

    // 初始化定义
    const fetchAndroidAppVersion = () => {
        if (isBlankStr(props.version4Edit)) {
            return;
        }

        get('/deviceset/android/app/get', {
            version: props.version4Edit
        }).then(respData => {
            let model = respData.model;
            setVersion(model.version);
            setComment(model.comment);
            setOssPath(model.ossPath);
        });
    }
    useEffect(() => {
        fetchAndroidAppVersion();
    }, []);

    // 文件上传定义
    // 上一个组件传来的修改资源URL的函数，可用于展示远程的资源
    const [show, changeShow] = useState(false);
    const uploadPath = (path, file) => {
        // console.log('$$$$$ uploadAndroidApk file=', file);
        // console.log('$$$$$ uploadAndroidApk file.name=', file.name);
        // console.log('$$$$$ uploadAndroidApk file.type=', file.type);
        // console.log('$$$$$ uploadAndroidApk file.uid=', file.uid);
        let nameArr = file.name.split(".");
        return `${path}/${nameArr[0]}-${file.uid}.${
            nameArr[nameArr.length - 1]
        }`;
    };
    const OssUpload = async (option) => {
        const { file, onSuccess, onProgress, onError } = option;
        const folder = "android";
        const url = uploadPath(folder, file);

        const ossClient = await getAliOssClient();
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
            onError(e);
        }
    };
    const beforeUpload = (file) => {
        const isAndroidApp = file.type === 'application/vnd.android.package-archive';
        if (!isAndroidApp) {
            message.error('You can only upload apk file!');
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('Android app must smaller than 10MB!');
        }
        return (isAndroidApp && isLt10M) || Upload.LIST_IGNORE;
    };
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
                setOssPath(info.file.response.name);
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
            confirmLoading={loading}
            onCancel={onClickCancel}
            onOk={onClickOK}
            open={open}
            title={applyLang('labelImport')}
            width={450}
        >
            <div className="flex-col-cont" style={{justifyContent: 'flex-start', height: 275, width: '100%'}}>
                <Space className="full-square" size={10} direction='vertical'>
                    <div className="flex-row-cont" style={{height: 40, width: '100%'}}>
                        <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', width: '25%'}}>
                            <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptVersion')}</span></Space>
                        </div>
                        <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start', width: '75%'}}>
                            <Input placeholder={applyLang('labelVersion')} allowClear disabled={props.version4Edit == undefined ? false : true} value={version} onChange={(e) => setVersion(e.target.value)}/>
                        </div>
                    </div>
                    <div className="flex-row-cont" style={{height: 40, width: '100%'}}>
                        <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', width: '25%'}}>
                            <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptComment')}</span></Space>
                        </div>
                        <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start', width: '75%'}}>
                            <Input placeholder={applyLang('labelComment')} allowClear value={comment} onChange={(e) => setComment(e.target.value)}/>
                        </div>
                    </div>
                    <div className="flex-row-cont" style={{height: 40, width: '100%'}}>
                        <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', width: '25%'}}>
                            <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptOssPath')}</span></Space>
                        </div>
                        <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start', width: '75%'}}>
                            <Input placeholder={applyLang('labelOssPath')} allowClear disabled={true} value={ossPath}/>
                        </div>
                    </div>
                    <div className="flex-row-cont" style={{height: 110, width: '100%'}}>
                        <div className="flex-row-cont full-height" style={{alignItems: 'flex-start', justifyContent: 'flex-end', width: '25%'}}>
                        <span>{applyLang('promptUploadFile')}</span>
                        </div>
                        <div className="flex-row-cont full-height" style={{alignItems: 'flex-start', justifyContent: 'flex-start', width: '75%'}}>
                            {show === true ? (
                                <Spin style={{ position: "relative", left: "40px" }} />
                            ) : (
                                <Upload {...uploadProps}>{uploadButton}</Upload>
                            )}
                        </div>
                    </div>
                </Space>
            </div>
        </Modal>
    );
};
 
export default AndroidAppUploadModal;