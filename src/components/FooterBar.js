import React from 'react';

import { Layout } from 'antd';

const FooterBar = () => {
    let { Footer } = Layout;

    let footerStyle = {
        padding: 0,
        width: '100%',
        border: '0px solid blue'
    };

    return (
        <Footer style={footerStyle}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', padding: 10}}>
                <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column', height: 100, width: '23%', padding: 5, border: '0px solid red'}}>
                    <span>商务合作</span>
                    <hr style={{width: '100%', border: '0.5px solid gray'}}/>
                    <span>联系邮箱：xxx@163.com</span>
                    <span>联系电话：136xxxxxxxx</span>
                    <span>给我们留言：xxx</span>
                </div>
                <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column', height: 100, width: '23%', padding: 5, border: '0px solid red'}}>
                    <span>站点地图</span>
                    <hr style={{width: '100%', border: '0.5px solid gray'}}/>
                    <span>公司介绍：http://xxx.xxx.com</span>
                    <span>商品采购：http://xxx.xxx.com</span>
                    <span>供应商地图：http://xxx.xxx.com</span>
                </div>
                <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column', height: 100, width: '23%', padding: 5, border: '0px solid red'}}>
                    <span>加入我们</span>
                    <hr style={{width: '100%', border: '0.5px solid gray'}}/>
                    <span>校园招聘：http://xxx.xxx.com</span>
                    <span>社会招聘：http://xxx.xxx.com</span>
                    <span>急聘：http://xxx.xxx.com</span>
                </div>
                <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column', height: 100, width: '23%', padding: 5, border: '0px solid red'}}>
                    <span>技术支持</span>
                    <hr style={{width: '100%', border: '0.5px solid gray'}}/>
                    <span>开发支持：http://xxx.xxx.com</span>
                    <span>业务支持：http://xxx.xxx.com</span>
                    <span>运维支持：http://xxx.xxx.com</span>
                </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 10}}>
                <hr style={{width: '100%', border: '0.5px solid gray'}}/>
                <span>京网文﹝2023﹞4325-128号　互联网新闻信息服务许可编号：11220180001 北京新浪互联信息服务有限公司</span>
                <span>互联网药品信息服务（京）-经营性-2019-0026　京教研[2002]7号　电信业务审批[2001]字</span>
                <span>增值电信业务经营许可证B1.B2-20090108　增值电信业务经营许可证：京ICP证000007号</span>
                <span>广播电视节目制作经营许可证（京）字第00828号 甲测资字11110398 京公网安备11000002000016号</span>
                <span>互联网宗教信息服务许可证：京（2022）0000062</span>
            </div>
        </Footer>
    )
};

export default FooterBar;

