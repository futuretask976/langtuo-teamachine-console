import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"; 
import { Layout, Menu } from 'antd';
import { BorderOuterOutlined, DiffOutlined, ExperimentOutlined, FileDoneOutlined, FileSearchOutlined, MonitorOutlined, OneToOneOutlined, PieChartOutlined, TeamOutlined } from '@ant-design/icons';

const { Sider } = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const SiderMenu4Frame = (props) => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const siderStyle = {
        backgroundColor: '#FFFFFF',
        height: "100%",
        lineHeight: '240px',
        overflow: 'auto',
        paddingInline: 0,
        textAlign: 'left',
        border: '0px solid yellow'
    };

    const menuItems = [
        getItem('概况', 'indexMgt', <PieChartOutlined />),
        getItem('用户', 'userSet', <TeamOutlined />, [
            getItem('商户管理', 'tenantMgt'),
            getItem('组织架构管理', 'orgMgt'),
            getItem('角色管理', 'roleMgt'),
			getItem('管理员管理', 'adminMgt'),
        ]),
        getItem('店铺', 'shopSet', <BorderOuterOutlined />, [
            getItem('店铺组管理', 'shopGroupMgt'),
            getItem('店铺管理', 'shopMgt'),
        ]),
        getItem('设备', 'deviceSet', <OneToOneOutlined />, [
            getItem('型号管理', 'modelMgt'),
            getItem('预部署管理', 'deployMgt'),
            getItem('设备管理', 'machineMgt'),
			// getItem('设备详情管理', '11'),
        ]),
		getItem('饮品生产', 'drinkSet', <ExperimentOutlined />, [
            getItem('物料类型管理', 'toppingTypeMgt'),
            getItem('物料管理', 'toppingMgt'),
			getItem('规格管理', 'specMgt'),
			getItem('茶品类型管理', 'teaTypeMgt'),
			getItem('茶品管理', 'teaMgt'),
			getItem('物料精度模板管理', 'toppingAccuracyTplMgt'),
        ]),
        getItem('菜单', 'menuSet', <FileDoneOutlined />, [
            getItem('系列管理', 'seriesMgt'),
            getItem('菜单管理', 'menuMgt')
        ]),
        getItem('食安规则', 'ruleSet', <MonitorOutlined />, [
            getItem('管道排空管理', 'drainRuleMgt'),
			getItem('管道清洗管理', 'cleanRuleMgt'),
			getItem('预警规则管理', 'warningRuleMgt'),
        ]),
        getItem('动作记录', 'recordSet', <FileSearchOutlined />, [
            getItem('废料记录管理', 'invalidActRecordMgt'),
            getItem('补料记录管理', 'supplyActRecordMgt'),
            getItem('排空记录管理', 'drainActRecordMgt'),
			getItem('清洗记录管理', 'cleanActRecordMgt'),
			getItem('订单记录管理', 'orderActRecordMgt'),
        ]),
        getItem('日常报表', 'reportSet', <DiffOutlined />, [
            getItem('订单-数量报表', 'orderAmtReportMgt'),
            getItem('订单-茶品报表', 'orderTeaReportMgt'),
            getItem('订单-规格项报表', 'orderSpecItemReportMgt'),
            getItem('订单-物料报表', 'orderToppingReportMgt'),
        ]),
    ];

    const onMenuItemClick = (e) => {
        props.onMenuItemClick(e.key);
    };

    return (
        <Sider collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} style={siderStyle} width="200">
            {/* <div className="demo-logo-vertical" /> */}
            <Menu theme="light" defaultSelectedKeys={['indexMgt']} mode="inline" items={menuItems} onClick={onMenuItemClick} style={{height: '100%'}} />
        </Sider>
    )
};

export default SiderMenu4Frame;

