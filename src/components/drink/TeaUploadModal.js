import React, { useState } from 'react';
import { Button, Modal, Space, Spin, Upload, message } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import OSS from 'ali-oss';

import '../../css/common.css';
import { getTenantCode, isBlankStr } from '../../js/common.js';
import { post4Import } from '../../js/request4Import';

const TeaUploadModal = (props) => {
    // 对话框相关
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setTimeout(() => {
            props.onClose();
            setOpen(false);
        }, 3000);
    };
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据定义相关
    const [imgLink, setImgLink] = useState('');
    const [fileList, setFileList] = useState([]);

    // OSS 相关
    const ossClient = new OSS({
        region: "oss-cn-hangzhou", //你的oss服务器所在区域
        accessKeyId: "LTAI5tRoDh1tQPDtLTof7QZu",
        accessKeySecret: "SdFJQodAC8Zi6ljLIYlJ9ChP5eRul9",
        bucket: "miya-bucket2", // oss上你的bucket名称
    });
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
            onError(e);
        }
    };
    const ExcelUpload = async (option) => {
        const { file, onSuccess, onProgress, onError } = option;

        const formData = new FormData();
        formData.append('tenantCode', getTenantCode());
        formData.append('file', file);
       
        post4Import('/drinkset/tea/upload', formData)
        .then(response => {
            console.log('File uploaded successfully');
            // 处理响应数据
            onSuccess(
                response,
                file,
            );
        });
    };
    const beforeUpload = (file) => {
        const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        if (!isExcel) {
            message.error('You can only upload xlsx file!');
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('Image must smaller than 10MB!');
        }
        return (isExcel && isLt10M) || Upload.LIST_IGNORE;
    };
    const uploadProps = {
        showUploadList: true,
        customRequest: ExcelUpload,
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
            title="上传导入文件"
            onOk={onClickOK}
            onCancel={onClickCancel}
            width={400}
            style={{border: '0px solid red'}}
            footer={[
                <Button key="back" onClick={onClickCancel}>关闭</Button>,
            ]}
        >
            <div className="flex-col-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-start', height: 200, width: '100%'}}>
                <div className="flex-row-cont" style={{height: 200, width: '98%'}}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%', width: '25%'}}>
                        <Space size='small'><span style={{color: 'red'}}>*</span><span>文件上传：</span></Space>
                    </div>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%', width: '75%'}}>
                        {show === true ? (
                            <Spin style={{ position: "relative", left: "40px" }} />
                        ) : (
                            <Upload {...uploadProps}>{uploadButton}</Upload>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};
 
export default TeaUploadModal;