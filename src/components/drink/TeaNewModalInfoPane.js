import React, { useEffect, useState } from 'react';
import { Input, Select, Space, Switch, Spin, Upload, message } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import OSS from 'ali-oss';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { getTenantCode, isBlankObj, isBlankStr } from '../../js/common.js';
import { get } from '../../js/request.js';

const { TextArea } = Input;

const TeaNewModalInfoPane = (props) => {
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
    const getPresignedUrl = async (objectName) => {
        if (isBlankStr(objectName)) {
            return '';
        }

        const ossClient = await getAliOssClient();
        try {
            // 生成预签名URL
            const url = ossClient.signatureUrl(objectName, {
                expires: 3600, // URL有效时长，单位为秒，默认为3600秒
                method: 'GET', // 允许的HTTP方法，默认为'GET'
            });
            return url;
        } catch (e) {
            console.error(e);
        }
        return '';
    }

    // 数据定义
    const [teaCode, setTeaCode] = useState(() => {
        if (isBlankObj(props.tea4Edit)) {
            return undefined;
        }
        if (isBlankObj(props.tea4Edit.teaCode)) {
            return undefined;
        }
        return props.tea4Edit.teaCode;
    });
    const [teaName, setTeaName] = useState(() => {
        if (isBlankObj(props.tea4Edit)) {
            return undefined;
        }
        if (isBlankObj(props.tea4Edit.teaName)) {
            return undefined;
        }
        return props.tea4Edit.teaName;
    });
    const [outerTeaCode, setOuterTeaCode] = useState(() => {
        if (isBlankObj(props.tea4Edit)) {
            return undefined;
        }
        if (isBlankObj(props.tea4Edit.outerTeaCode)) {
            return undefined;
        }
        return props.tea4Edit.outerTeaCode;
    });
    const [teaTypeCode, setTeaTypeCode] = useState(() => {
        if (isBlankObj(props.tea4Edit)) {
            return undefined;
        }
        if (isBlankObj(props.tea4Edit.teaTypeCode)) {
            return undefined;
        }
        return props.tea4Edit.teaTypeCode;
    });
    const [state, setState] = useState(() => {
        if (isBlankObj(props.tea4Edit)) {
            return undefined;
        }
        if (isBlankObj(props.tea4Edit.state)) {
            return undefined;
        }
        return props.tea4Edit.state;
    });
    const [comment, setComment] = useState(() => {
        if (isBlankObj(props.tea4Edit)) {
            return undefined;
        }
        if (isBlankObj(props.tea4Edit.comment)) {
            return undefined;
        }
        return props.tea4Edit.comment;
    });
    const [fileList, setFileList] = useState(() => {
        if (!isBlankObj(props.tea4Edit) && !isBlankObj(props.tea4Edit.imgLink)) {
            getPresignedUrl(props.tea4Edit.imgLink)
            .then(presignedUrl => {
                setFileList([{url: presignedUrl}]);
            });
        }
        return [];
    });
    const [imgLink, setImgLink] = useState(() => {
        if (isBlankObj(props.tea4Edit)) {
            return undefined;
        }
        if (isBlankObj(props.tea4Edit.imgLink)) {
            return undefined;
        }
        return props.tea4Edit.imgLink;
    });
    const [teaTypeList4Select, setTeaTypeList4Select] = useState();

    // 动作定义
    const fetchTeaTypeList4Select = () => {
        get('/drinkset/tea/type/list', {
            tenantCode: getTenantCode()
        }).then(resp => {
            let model = resp.model;
            setTeaTypeList4Select((prev => {
                let teaTypeListTmp = [];
                model.forEach(item => {
                    teaTypeListTmp.push({
                        key: item.teaTypeCode,
                        label: item.teaTypeName,
                        value: item.teaTypeCode
                    });
                })
                return teaTypeListTmp;
            }));
        });
    }
    useEffect(() => {
        fetchTeaTypeList4Select();
    }, []);

    // 输入定义
    useEffect(() => {
        props.updateInfo(teaCode, teaName, outerTeaCode, teaTypeCode, state, comment, imgLink);
    }, [teaCode, teaName, outerTeaCode, teaTypeCode, state, comment, imgLink]);


    // 上传文件相关
    // 上一个组件传来的修改资源URL的函数，可用于展示远程的资源
    const [show, changeShow] = useState(false);
    const uploadPath = (path, file) => {
        return `${path}/${file.name.split(".")[0]}-${file.uid}.${
            file.type.split("/")[1]
        }`;
    };
    const OssUpload = async (option) => {
        const { file, onSuccess, onProgress, onError } = option;
        const folder = "teaImg";
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
                alert("文件上传成功");
                // message.success(`${info.file.name} 文件上传成功`);
                // console.log('$$$$$ info.file.response.name=', info.file.response.name);
                // console.log('$$$$$ info.file.status=done, info=', info);
                // console.log('$$$$$ info.file.status=done, fileList=', fileList);
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
        <div className="flex-col-cont" style={{justifyContent: 'flex-start', height: '100%', width: '100%'}}>
            <div className="flex-row-cont" style={{height: 50, width: '98%', border: '0px solid red'}}>
                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%', width: '13%'}}>
                    <Space size='small'><span style={{color: 'red'}}>*</span><span>茶品编码：</span></Space>
                </div>
                <div className="flex-row-cont" style={{height: '100%', width: '37%'}}>
                    <Input placeholder="茶品编码" disabled={!props.putNew} onChange={(e) => setTeaCode(e.target.value)} value={teaCode}/>
                </div>
                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%', width: '13%'}}>
                    <Space size='small'><span style={{color: 'red'}}>*</span><span>茶品名称：</span></Space>
                </div>
                <div className="flex-row-cont" style={{height: '100%', width: '37%'}}>
                    <Input placeholder="茶品名称" onChange={(e) => setTeaName(e.target.value)} value={teaName}/>
                </div>
            </div>

            <div className="flex-row-cont" style={{height: 50, width: '98%'}}>
                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%', width: '13%'}}>
                    <Space size='small'><span style={{color: 'red'}}>*</span><span>外部茶品编码：</span></Space>
                </div>
                <div className="flex-row-cont" style={{height: '100%', width: '37%'}}>
                    <Input placeholder="外部茶品编码" onChange={(e) => setOuterTeaCode(e.target.value)} value={outerTeaCode}/>
                </div>
                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%', width: '13%'}}>
                    <Space size='small'><span style={{color: 'red'}}>*</span><span>茶品类型：</span></Space>
                </div>
                <div className="flex-row-cont" style={{height: '100%', width: '37%'}}>
                    <Select
                        onChange={(e) => setTeaTypeCode(e)}
                        options={teaTypeList4Select}
                        style={{width: '100%'}}
                        value={teaTypeCode}
                    />
                </div>
            </div>

            <div className="flex-row-cont" style={{height: 50, width: '98%'}}>
                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%', width: '13%'}}>
                    <Space size='small'><span style={{color: 'red'}}>*</span><span>茶品状态：</span></Space>
                </div>
                <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%', width: '88%'}}>
                    <Switch checkedChildren="启用" unCheckedChildren="禁用" checked={state === 1 ? true : false} onChange={(e) => setState(e ? 1 : 0)} />
                </div>
            </div>

            <div className="flex-row-cont" style={{height: 65, width: '98%'}}>
                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%', width: '13%'}}>
                    <span>{applyLang('promptComment')}</span>
                </div>
                <div className="flex-row-cont" style={{height: '100%', width: '88%'}}>
                    <TextArea placeholder={applyLang('labelComment')} onChange={(e) => setComment(e.target.value)} maxLength={200} rows={2} value={comment}/>
                </div>
            </div>

            <div className="flex-row-cont" style={{height: 130, width: '98%'}}>
                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%', width: '13%'}}>
                    <Space size='small'><span style={{color: 'red'}}>*</span><span>图片上传：</span></Space>
                </div>
                <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%', width: '88%'}}>
                    {show === true ? (
                        <Spin style={{ position: "relative", left: "40px" }} />
                    ) : (
                        <Upload {...uploadProps}>{uploadButton}</Upload>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeaNewModalInfoPane;