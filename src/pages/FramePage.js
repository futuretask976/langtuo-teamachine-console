import React, { useState } from 'react';
import { Flex, Layout } from 'antd';

import '../css/common.css';

import HeaderBar from '../components/HeaderBar'
import SiderMenu from '../components/SiderMenu'
import FooterBar from '../components/FooterBar'

import SummaryChartPage from './SummaryChartPage';
// usetSet
import TenantPage from './user/TenantPage';
import OrgPage from './user/OrgPage';
import RolePage from './user/RolePage';
import AdminPage from './user/AdminPage';
// shopSet
import ShopGroupPage from './shop/ShopGroupPage';
import ShopPage from './shop/ShopPage';
// deviceSet
import ModelPage from './device/ModelPage';
import DeployPage from './device/DeployPage';
import MachinePage from './device/MachinePage';
import AndroidAppPage from './device/AndroidAppPage';
// drinkSet
import ToppingTypePage from './drink/ToppingTypePage';
import ToppingPage from './drink/ToppingPage';
import SpecPage from './drink/SpecPage';
import TeaTypePage from './drink/TeaTypePage';
import TeaPage from './drink/TeaPage';
import AccuracyTplPage from './drink/AccuracyTplPage';
// menuSet
import SeriesPage from './menu/SeriesPage';
import MenuPage from './menu/MenuPage';
// ruleSet
import DrainRulePage from './rule/DrainRulePage';
import CleanRulePage from './rule/CleanRulePage';
import WarningRulePage from './rule/WarningRulePage';
// recordSet
import InvalidActRecordPage from './record/InvalidActRecordPage';
import SupplyActRecordPage from './record/SupplyActRecordPage';
import DrainActRecordPage from './record/DrainActRecordPage';
import CleanActRecordPage from './record/CleanActRecordPage';
import OrderActRecordPage from './record/OrderActRecordPage';
// reportSet
import OrderReportPage from './report/OrderReportPage';

const { Content } = Layout;

const FramePage = () => {
    // 数据定义
    const [menuItem, setMenuItem] = useState('summaryChartMgt');

    // 页面样式相关
    const layoutStyle = {
        height: 925,
        overflow: 'hidden',
        width: 'calc(100% - 5px)',
        maxWidth: 'calc(100% - 5px)',
        border: '0px solid red',
    };

    // 数据定义
    const onMenuItemClick = (selectedMenuItem) => {
        setMenuItem(selectedMenuItem);
    }

    return (
        <Flex gap="middle" justify="center" wrap="wrap">
            <Layout style={layoutStyle}>
                <HeaderBar />
                <Layout>
                    <SiderMenu onMenuItemClick={onMenuItemClick}/>
                    <Layout>
                        <Content style={{ margin: '0px 5px 0px 5px' }}>
                            {menuItem === 'summaryChartMgt' && (
                                <SummaryChartPage/>
                            )}
                            
                            {menuItem === 'tenantMgt' && (
                                <TenantPage/>
                            )}
                            {menuItem === 'orgMgt' && (
                                <OrgPage/>
                            )}
                            {menuItem === 'roleMgt' && (
                                <RolePage/>
                            )}
                            {menuItem === 'adminMgt' && (
                                <AdminPage/>
                            )}

                            {menuItem === 'shopGroupMgt' && (
                                <ShopGroupPage/>
                            )}
                            {menuItem === 'shopMgt' && (
                                <ShopPage/>
                            )}

                            {menuItem === 'modelMgt' && (
                                <ModelPage/>
                            )}
                            {menuItem === 'deployMgt' && (
                                <DeployPage/>
                            )}
                            {menuItem === 'machineMgt' && (
                                <MachinePage/>
                            )}
                            {menuItem === 'androidAppMgt' && (
                                <AndroidAppPage/>
                            )}

                            {menuItem === 'toppingTypeMgt' && (
                                <ToppingTypePage/>
                            )}
                            {menuItem === 'toppingMgt' && (
                                <ToppingPage/>
                            )}
                            {menuItem === 'specMgt' && (
                                <SpecPage/>
                            )}
                            {menuItem === 'teaTypeMgt' && (
                                <TeaTypePage/>
                            )}
                            {menuItem === 'teaMgt' && (
                                <TeaPage/>
                            )}
                            {menuItem === 'toppingAccuracyTplMgt' && (
                                <AccuracyTplPage/>
                            )}
                            
                            {menuItem === 'seriesMgt' && (
                                <SeriesPage/>
                            )}
                            {menuItem === 'menuMgt' && (
                                <MenuPage/>
                            )}

                            {menuItem === 'drainRuleMgt' && (
                                <DrainRulePage/>
                            )}
                            {menuItem === 'cleanRuleMgt' && (
                                <CleanRulePage/>
                            )}
                            {menuItem === 'warningRuleMgt' && (
                                <WarningRulePage/>
                            )}

                            {menuItem === 'invalidActRecordMgt' && (
                                <InvalidActRecordPage/>
                            )}
                            {menuItem === 'supplyActRecordMgt' && (
                                <SupplyActRecordPage/>
                            )}
                            {menuItem === 'drainActRecordMgt' && (
                                <DrainActRecordPage/>
                            )}
                            {menuItem === 'cleanActRecordMgt' && (
                                <CleanActRecordPage/>
                            )}
                            {menuItem === 'orderActRecordMgt' && (
                                <OrderActRecordPage/>
                            )}

                            {menuItem === 'orderReportMgt' && (
                                <OrderReportPage/>
                            )}
                        </Content>
                    </Layout>
                </Layout>
                <FooterBar />
            </Layout>
        </Flex>
    )
};

export default FramePage;
