import React, { useState } from 'react'; 
import { Layout, Menu } from 'antd';
import { BorderOuterOutlined, DiffOutlined, ExperimentOutlined, FileDoneOutlined, FileSearchOutlined, MonitorOutlined, OneToOneOutlined, PieChartOutlined, TeamOutlined } from '@ant-design/icons';

import { applyLang } from '../i18n/i18n';

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
        getItem(applyLang('labelSummaryChartMgt'), 'summaryChartMgt', <PieChartOutlined />),
        getItem(applyLang('labelUserSet'), 'userSet', <TeamOutlined />, [
            getItem(applyLang('labelTenantMgt'), 'tenantMgt'),
            getItem(applyLang('labelOrgMgt'), 'orgMgt'),
            getItem(applyLang('labelRoleMgt'), 'roleMgt'),
			getItem(applyLang('labelAdminMgt'), 'adminMgt'),
        ]),
        getItem(applyLang('labelShopSet'), 'shopSet', <BorderOuterOutlined />, [
            getItem(applyLang('labelShopGroupMgt'), 'shopGroupMgt'),
            getItem(applyLang('labelShopMgt'), 'shopMgt'),
        ]),
        getItem(applyLang('labelDeviceSet'), 'deviceSet', <OneToOneOutlined />, [
            getItem(applyLang('labelModelMgt'), 'modelMgt'),
            getItem(applyLang('labelDeployMgt'), 'deployMgt'),
            getItem(applyLang('labelMachineMgt'), 'machineMgt'),
            getItem(applyLang('labelAndroidAppMgt'), 'androidAppMgt'),
        ]),
		getItem(applyLang('labelDrinkSet'), 'drinkSet', <ExperimentOutlined />, [
            getItem(applyLang('labelToppingTypeMgt'), 'toppingTypeMgt'),
            getItem(applyLang('labelToppingMgt'), 'toppingMgt'),
			getItem(applyLang('labelSpecMgt'), 'specMgt'),
			getItem(applyLang('labelTeaTypeMgt'), 'teaTypeMgt'),
			getItem(applyLang('labelTeaMgt'), 'teaMgt'),
			getItem(applyLang('labelToppingAccuracyTplMgt'), 'toppingAccuracyTplMgt'),
        ]),
        getItem(applyLang('labelMenuSet'), 'menuSet', <FileDoneOutlined />, [
            getItem(applyLang('labelSeriesMgt'), 'seriesMgt'),
            getItem(applyLang('labelMenuMgt'), 'menuMgt')
        ]),
        getItem(applyLang('labelRuleSet'), 'ruleSet', <MonitorOutlined />, [
            getItem(applyLang('labelDrainRuleMgt'), 'drainRuleMgt'),
			getItem(applyLang('labelCleanRuleMgt'), 'cleanRuleMgt'),
			getItem(applyLang('labelWarningRuleMgt'), 'warningRuleMgt'),
        ]),
        getItem(applyLang('labelRecordSet'), 'recordSet', <FileSearchOutlined />, [
            getItem(applyLang('labelInvalidActRecordMgt'), 'invalidActRecordMgt'),
            getItem(applyLang('labelSupplyActRecordMgt'), 'supplyActRecordMgt'),
            getItem(applyLang('labelDrainActRecordMgt'), 'drainActRecordMgt'),
			getItem(applyLang('labelCleanActRecordMgt'), 'cleanActRecordMgt'),
			getItem(applyLang('labelOrderActRecordMgt'), 'orderActRecordMgt'),
        ]),
        getItem(applyLang('labelReportSet'), 'reportSet', <DiffOutlined />, [
            getItem(applyLang('labelOrderReportMgt'), 'orderReportMgt'),
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

