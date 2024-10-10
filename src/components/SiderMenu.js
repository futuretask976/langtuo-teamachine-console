import React, { useContext, useState } from 'react'; 
import { Layout, Menu } from 'antd';
import { BorderOuterOutlined, DiffOutlined, ExperimentOutlined, FileDoneOutlined, FileSearchOutlined, MonitorOutlined, OneToOneOutlined, PieChartOutlined, TeamOutlined } from '@ant-design/icons';

import { FramePageContext } from '../js/context'
import { getLang } from '../i18n/i18n';

const { Sider } = Layout;

const SiderMenu = (props) => {
    // 上下文定义
    const { lang } = useContext(FramePageContext);

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
        getItem(getLang(lang, 'labelSummaryChartMgt'), 'summaryChartMgt', <PieChartOutlined />),
        getItem(getLang(lang, 'labelUserSet'), 'userSet', <TeamOutlined />, [
            getItem(getLang(lang, 'labelTenantMgt'), 'tenantMgt'),
            getItem(getLang(lang, 'labelOrgMgt'), 'orgMgt'),
            getItem(getLang(lang, 'labelRoleMgt'), 'roleMgt'),
			getItem(getLang(lang, 'labelAdminMgt'), 'adminMgt'),
        ]),
        getItem(getLang(lang, 'labelShopSet'), 'shopSet', <BorderOuterOutlined />, [
            getItem(getLang(lang, 'labelShopGroupMgt'), 'shopGroupMgt'),
            getItem(getLang(lang, 'labelShopMgt'), 'shopMgt'),
        ]),
        getItem(getLang(lang, 'labelDeviceSet'), 'deviceSet', <OneToOneOutlined />, [
            getItem(getLang(lang, 'labelModelMgt'), 'modelMgt'),
            getItem(getLang(lang, 'labelDeployMgt'), 'deployMgt'),
            getItem(getLang(lang, 'labelMachineMgt'), 'machineMgt'),
            getItem(getLang(lang, 'labelAndroidAppMgt'), 'androidAppMgt'),
        ]),
		getItem(getLang(lang, 'labelDrinkSet'), 'drinkSet', <ExperimentOutlined />, [
            getItem(getLang(lang, 'labelToppingTypeMgt'), 'toppingTypeMgt'),
            getItem(getLang(lang, 'labelToppingMgt'), 'toppingMgt'),
			getItem(getLang(lang, 'labelSpecMgt'), 'specMgt'),
			getItem(getLang(lang, 'labelTeaTypeMgt'), 'teaTypeMgt'),
			getItem(getLang(lang, 'labelTeaMgt'), 'teaMgt'),
			getItem(getLang(lang, 'labelToppingAccuracyTplMgt'), 'toppingAccuracyTplMgt'),
        ]),
        getItem(getLang(lang, 'labelMenuSet'), 'menuSet', <FileDoneOutlined />, [
            getItem(getLang(lang, 'labelSeriesMgt'), 'seriesMgt'),
            getItem(getLang(lang, 'labelMenuMgt'), 'menuMgt')
        ]),
        getItem(getLang(lang, 'labelRuleSet'), 'ruleSet', <MonitorOutlined />, [
            getItem(getLang(lang, 'labelDrainRuleMgt'), 'drainRuleMgt'),
			getItem(getLang(lang, 'labelCleanRuleMgt'), 'cleanRuleMgt'),
			getItem(getLang(lang, 'labelWarningRuleMgt'), 'warningRuleMgt'),
        ]),
        getItem(getLang(lang, 'labelRecordSet'), 'recordSet', <FileSearchOutlined />, [
            getItem(getLang(lang, 'labelInvalidActRecordMgt'), 'invalidActRecordMgt'),
            getItem(getLang(lang, 'labelSupplyActRecordMgt'), 'supplyActRecordMgt'),
            getItem(getLang(lang, 'labelDrainActRecordMgt'), 'drainActRecordMgt'),
			getItem(getLang(lang, 'labelCleanActRecordMgt'), 'cleanActRecordMgt'),
			getItem(getLang(lang, 'labelOrderActRecordMgt'), 'orderActRecordMgt'),
        ]),
        getItem(getLang(lang, 'labelReportSet'), 'reportSet', <DiffOutlined />, [
            getItem(getLang(lang, 'labelOrderReportMgt'), 'orderReportMgt'),
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

