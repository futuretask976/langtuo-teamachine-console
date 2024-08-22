import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"; 
import { Layout, Menu } from 'antd';
import { BorderOuterOutlined, ExperimentOutlined, FileDoneOutlined, FileSearchOutlined, MonitorOutlined, OneToOneOutlined, PieChartOutlined, TeamOutlined } from '@ant-design/icons';

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
    const navigate = useNavigate();
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
            navigate('/index');
            window.location.href="/console/index";
        } else if (e.key == 'tenantMgt') {
            navigate('/userset/tenant');
        } else if (e.key == 'orgMgt') {
            navigate('/userset/org');
        } else if (e.key == 'roleMgt') {
            navigate('/userset/role');
        } else if (e.key == 'adminMgt') {
            navigate('/userset/admin');
        } else if (e.key == 'shopGroupMgt') {
            navigate('/shopset/group');
        } else if (e.key == 'shopMgt') {
            navigate('/shopset/shop');
        } else if (e.key == 'modelMgt') {
            navigate('/deviceset/model');
        } else if (e.key == 'deployMgt') {
            navigate('/deviceset/deploy');
        } else if (e.key == 'machineMgt') {
            navigate('/deviceset/machine');
        } else if (e.key == 'toppingTypeMgt') {
            navigate('/drinkset/topping/type');
        } else if (e.key == 'toppingMgt') {
            navigate('/drinkset/topping');
        } else if (e.key == 'specMgt') {
            navigate('/drinkset/spec');
        } else if (e.key == 'teaTypeMgt') {
            navigate('/drinkset/tea/type');
        } else if (e.key == 'teaMgt') {
            navigate('/drinkset/tea');
        } else if (e.key == 'toppingAccuracyTplMgt') {
            navigate('/drinkset/topping/accuracy/template');
        } else if (e.key == 'seriesMgt') {
            navigate('/menuset/series');
        } else if (e.key == 'menuMgt') {
            navigate('/menuset/menu');
        } else if (e.key == 'drainRuleMgt') {
            navigate('/ruleset/drain');
        } else if (e.key == 'cleanRuleMgt') {
            navigate('/ruleset/clean');
        } else if (e.key == 'warningRuleMgt') {
            navigate('/ruleset/warning');
        } else if (e.key == 'invalidActRecordMgt') {
            navigate('/recordset/invalid');
        } else if (e.key == 'supplyActRecordMgt') {
            navigate('/recordset/supply');
        } else if (e.key == 'drainActRecordMgt') {
            navigate('/recordset/drain');
        } else if (e.key == 'cleanActRecordMgt') {
            navigate('/recordset/clean');
        } else if (e.key == 'orderActRecordMgt') {
            navigate('/recordset/order');
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

