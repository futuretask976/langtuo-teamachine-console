import React, { useState } from 'react'; 
import { Layout, Menu } from 'antd';
import { BorderOuterOutlined, DiffOutlined, ExperimentOutlined, FileDoneOutlined, FileSearchOutlined, MonitorOutlined, OneToOneOutlined, PieChartOutlined, TeamOutlined } from '@ant-design/icons';

import {useLang} from '../i18n/i18n';

const { Sider } = Layout;

const SiderMenu = (props) => {
    // 菜单定义
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
    const getItem = (label, key, icon, children) => {
        return {
            key,
            icon,
            children,
            label,
        };
    }
    const menuItems = [
        getItem(useLang('summaryChartMgt'), 'summaryChartMgt', <PieChartOutlined />),
        getItem(useLang('userSet'), 'userSet', <TeamOutlined />, [
            getItem(useLang('tenantMgt'), 'tenantMgt'),
            getItem(useLang('orgMgt'), 'orgMgt'),
            getItem(useLang('roleMgt'), 'roleMgt'),
			getItem(useLang('adminMgt'), 'adminMgt'),
        ]),
        getItem(useLang('shopSet'), 'shopSet', <BorderOuterOutlined />, [
            getItem(useLang('shopGroupMgt'), 'shopGroupMgt'),
            getItem(useLang('shopMgt'), 'shopMgt'),
        ]),
        getItem(useLang('deviceSet'), 'deviceSet', <OneToOneOutlined />, [
            getItem(useLang('modelMgt'), 'modelMgt'),
            getItem(useLang('deployMgt'), 'deployMgt'),
            getItem(useLang('machineMgt'), 'machineMgt'),
            getItem(useLang('androidAppMgt'), 'androidAppMgt'),
        ]),
		getItem(useLang('drinkSet'), 'drinkSet', <ExperimentOutlined />, [
            getItem(useLang('toppingTypeMgt'), 'toppingTypeMgt'),
            getItem(useLang('toppingMgt'), 'toppingMgt'),
			getItem(useLang('specMgt'), 'specMgt'),
			getItem(useLang('teaTypeMgt'), 'teaTypeMgt'),
			getItem(useLang('teaMgt'), 'teaMgt'),
			getItem(useLang('toppingAccuracyTplMgt'), 'toppingAccuracyTplMgt'),
        ]),
        getItem(useLang('menuSet'), 'menuSet', <FileDoneOutlined />, [
            getItem(useLang('seriesMgt'), 'seriesMgt'),
            getItem(useLang('menuMgt'), 'menuMgt')
        ]),
        getItem(useLang('ruleSet'), 'ruleSet', <MonitorOutlined />, [
            getItem(useLang('drainRuleMgt'), 'drainRuleMgt'),
			getItem(useLang('cleanRuleMgt'), 'cleanRuleMgt'),
			getItem(useLang('warningRuleMgt'), 'warningRuleMgt'),
        ]),
        getItem(useLang('recordSet'), 'recordSet', <FileSearchOutlined />, [
            getItem(useLang('invalidActRecordMgt'), 'invalidActRecordMgt'),
            getItem(useLang('supplyActRecordMgt'), 'supplyActRecordMgt'),
            getItem(useLang('drainActRecordMgt'), 'drainActRecordMgt'),
			getItem(useLang('cleanActRecordMgt'), 'cleanActRecordMgt'),
			getItem(useLang('orderActRecordMgt'), 'orderActRecordMgt'),
        ]),
        getItem(useLang('reportSet'), 'reportSet', <DiffOutlined />, [
            getItem(useLang('orderReportMgt'), 'orderReportMgt'),
        ]),
    ];
    const onMenuItemClick = (e) => {
        props.onMenuItemClick(e.key);
    };

    return (
        <Sider collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} style={siderStyle} width="250">
            {/* <div className="demo-logo-vertical" /> */}
            <Menu theme="light" defaultSelectedKeys={['summaryChartMgt']} mode="inline" items={menuItems} onClick={onMenuItemClick} style={{height: '100%'}} />
        </Sider>
    )
};

export default SiderMenu;

