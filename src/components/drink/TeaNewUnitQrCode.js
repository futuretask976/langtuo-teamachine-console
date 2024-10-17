import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react' // 有两种都可以用来生成二维码，格式不同

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';

const TeaNewUnitQrCode = (props) => {
    // 对话框定义
    const [open, setOpen] = useState(true);
    const onClickClose = () => {
        props.onClose();
    }
 
    return (
        <Modal
            centered
            open={open}
            title={applyLang('labelViewQrCode')}
            width={650}
            footer={[
                <Button key="close" onClick={onClickClose}>
                    {applyLang('labelClose')}
                </Button>
              ]}
        >
            <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'flex-start', height: 40, width: '100%'}}>
                <span style={{overflowWrap: 'break-word', width: '100%'}}>{applyLang('promptCode')}{props.qrCode}</span>
            </div>
            <div className="flex-col-cont" style={{alignItems: 'center', justifyContent: 'center', height: 250, width: '100%'}}>
                <QRCodeSVG
                    value={props.qrCode} // 生成的二维码的链接，比如：https://m.baidu.com/
                    size={200} // 尺寸大小，number类型，默认128
                    bgColor='#fff' // 背景色，默认#fff
                    fgColor='#000' // 二维码颜色，默认#000
                    level='L' // 容错大小二维码被遮挡后还能正确的展示。取值只有`L、M、Q、H`，默认L
                    marginSize={0} // 指定用于符号周围边距的模块数。(我的理解就是展示大小)
                    imageSettings={{
                        src: 'url', // 图片来源
                        x: 5, // 横向距离, 默认中心
                        y: 5, // 纵向距离, 默认中心
                        height: 10,  // 图片高度，默认size的10%
                        width: 10, // 图片宽度， 默认size的10%
                        excavate: false, // 展示未知效果，默认false
                    }} // 对象，表示二维码中图像的展示
                    />
            </div>
        </Modal>
    );
};
 
export default TeaNewUnitQrCode;