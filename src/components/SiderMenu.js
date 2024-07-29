import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { BorderOuterOutlined, ExperimentOutlined, FileDoneOutlined, FileSearchOutlined, GatewayOutlined, MonitorOutlined, OneToOneOutlined, PieChartOutlined, TeamOutlined } from '@ant-design/icons';

const { Sider } = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const SiderMenu = (props) => {
    const [collapsed, setCollapsed] = useState(false);

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
            getItem('营业准备管理', 'openRuleMgt'),
            getItem('打烊准备管理', 'closeRuleMgt'),
			getItem('清洗规则管理', 'cleanRuleMgt'),
			getItem('预警规则管理', 'warningRuleMgt'),
        ]),
        getItem('动作记录', 'recordSet', <FileSearchOutlined />, [
            getItem('废料记录管理', 'invalidActRecordMgt'),
            getItem('补料记录管理', 'supplyActRecordMgt'),
			getItem('清洗记录管理', 'cleanActRecordMgt'),
			getItem('订单记录管理', 'orderActRecordMgt'),
        ]),
    ];

    const siderStyle = {
        backgroundColor: '#FFFFFF',
        height: "100%",
        lineHeight: '240px',
        overflow: 'auto',
        paddingInline: 0,
        textAlign: 'left',
        border: '0px solid yellow'
    };

    const onMenuItemClick = (e) => {
        if (e.key == 'indexMgt') {
            window.location.href="/console/index";
        } else if (e.key == 'tenantMgt') {
            window.location.href="/console/userset/tenant";
        } else if (e.key == 'orgMgt') {
            window.location.href="/console/userset/org";
        } else if (e.key == 'roleMgt') {
            window.location.href="/console/userset/role";
        } else if (e.key == 'adminMgt') {
            window.location.href="/console/userset/admin";
        } else if (e.key == 'shopGroupMgt') {
            window.location.href="/console/shopset/group";
        } else if (e.key == 'shopMgt') {
            window.location.href="/console/shopset/shop";
        } else if (e.key == 'modelMgt') {
            window.location.href="/console/deviceset/model";
        } else if (e.key == 'deployMgt') {
            window.location.href="/console/deviceset/deploy";
        } else if (e.key == 'machineMgt') {
            window.location.href="/console/deviceset/machine";
        } else if (e.key == 'toppingTypeMgt') {
            window.location.href="/console/drinkset/topping/type";
        } else if (e.key == 'toppingMgt') {
            window.location.href="/console/drinkset/topping";
        } else if (e.key == 'specMgt') {
            window.location.href="/console/drinkset/spec";
        } else if (e.key == 'teaTypeMgt') {
            window.location.href="/console/drinkset/tea/type";
        } else if (e.key == 'teaMgt') {
            window.location.href="/console/drinkset/tea";
        } else if (e.key == 'toppingAccuracyTplMgt') {
            window.location.href="/console/drinkset/topping/accuracy/template";
        } else if (e.key == 'seriesMgt') {
            window.location.href="/console/menuset/series";
        } else if (e.key == 'menuMgt') {
            window.location.href="/console/menuset/menu";
        } else if (e.key == 'openRuleMgt') {
            window.location.href="/console/ruleset/open";
        } else if (e.key == 'closeRuleMgt') {
            window.location.href="/console/ruleset/close";
        } else if (e.key == 'cleanRuleMgt') {
            window.location.href="/console/ruleset/clean";
        } else if (e.key == 'warningRuleMgt') {
            window.location.href="/console/ruleset/warning";
        } else if (e.key == 'invalidActRecordMgt') {
            window.location.href="/console/recordset/invalid";
        }
    };

    return (
        <Sider collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} style={siderStyle} width="200">
            {/* <div className="demo-logo-vertical" /> */}
            <Menu theme="light" defaultOpenKeys={props.openMenu} defaultSelectedKeys={props.selectedMenu} mode="inline" items={menuItems} onClick={onMenuItemClick} style={{height: '100%'}} />
        </Sider>
    )
};

export default SiderMenu;

