import React, { useState } from 'react';
import { Button, Modal, Space, Spin, Upload, message } from 'antd';
import { PlusOutlined } from "@ant-design/icons";

import '../../css/common.css';
import { getTenantCode } from '../../js/common.js';
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

    // 上传文件相关
    // 上一个组件传来的修改资源URL的函数，可用于展示远程的资源
    const [show, changeShow] = useState(false);
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
            footer={[
                <Button key="back" onClick={onClickCancel}>关闭</Button>,
            ]}
            onCancel={onClickCancel}
            onOk={onClickOK}
            open={open}
            style={{border: '0px solid red'}}
            title="上传导入文件"
            width={400}
        >
            <div className="flex-row-cont" style={{height: 150, width: '100%'}}>
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
        </Modal>
    );
};
 
export default TeaUploadModal;