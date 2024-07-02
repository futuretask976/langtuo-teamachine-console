import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { BorderOuterOutlined, ExperimentOutlined, FileDoneOutlined, FileSearchOutlined, GatewayOutlined, MonitorOutlined, OneToOneOutlined, PieChartOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';

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
        getItem('概况', '1', <PieChartOutlined />),
        getItem('设备元数据', 'machineMetadataSub', <GatewayOutlined />, [
            getItem('设备型号管理', '2'),
        ]),
        getItem('用户', 'userSub', <TeamOutlined />, [
            getItem('商户管理', '3'),
            getItem('组织架构管理', '4'),
            getItem('角色管理', '5'),
			getItem('管理员管理', '6'),
        ]),
        getItem('门店', 'storeSub', <BorderOuterOutlined />, [
            getItem('门店组管理', '7'),
            getItem('门店管理', '8'),
        ]),
        getItem('设备', 'machineSub', <OneToOneOutlined />, [
            getItem('预部署管理', '9'),
            getItem('设备管理', '10'),
			getItem('设备详情管理', '11'),
        ]),
		getItem('饮品生产', 'teaSub', <ExperimentOutlined />, [
            getItem('物料类型管理', '12'),
            getItem('物料管理', '13'),
			getItem('规格管理', '14'),
			getItem('配方类型管理', '15'),
			getItem('配方管理', '16'),
			getItem('配方下发管理', '17'),
			getItem('物料精度模板管理', '18'),
        ]),
        getItem('菜单', 'menuSub', <FileDoneOutlined />, [
            getItem('菜单管理', '19'),
            getItem('系列管理', '20'),
        ]),
        getItem('食安规则', 'ruleSub', <MonitorOutlined />, [
            getItem('营业准备管理', '21'),
            getItem('打烊准备管理', '22'),
			getItem('清洗规则管理', '23'),
			getItem('预警规则管理', '24'),
        ]),
        getItem('日常报表', 'statisticsSub', <FileSearchOutlined />, [
            getItem('废料记录管理', '25'),
            getItem('补料记录管理', '26'),
			getItem('清洗记录管理', '27'),
			getItem('订单记录管理', '28'),
        ]),
    ];

    const siderStyle = {
        backgroundColor: '#ffffff',
        height: "100%",
        lineHeight: '240px',
        overflow: 'auto',
        paddingInline: 0,
        textAlign: 'left',
        border: '0px solid yellow'
    };

    const onMenuItemClick = (e) => {
        if (e.key == 1) {
            window.location.href="/console/index";
        } else if (e.key == 2) {
            window.location.href="/console/machine/model";
        } else if (e.key == 3) {
            window.location.href="/console/user/tenant";
        } else if (e.key == 4) {
            window.location.href="/console/user/org/struc";
        } else if (e.key == 5) {
            window.location.href="/console/user/role";
        } else if (e.key == 6) {
            window.location.href="/console/user/admin";
        } else if (e.key == 7) {
            window.location.href="/console/store/group";
        } else if (e.key == 8) {
            window.location.href="/console/store/shop";
        } else if (e.key == 9) {
            window.location.href="/admin/input";
        } else if (e.key == 10) {
            window.location.href="/admin/input";
        } else if (e.key == 11) {
            window.location.href="/admin/input";
        } else if (e.key == 12) {
            window.location.href="/admin/input";
        } else if (e.key == 13) {
            window.location.href="/admin/input";
        } else if (e.key == 14) {
            window.location.href="/admin/input";
        } else if (e.key == 15) {
            window.location.href="/admin/input";
        } else if (e.key == 16) {
            window.location.href="/console/tea/topping";
        } else if (e.key == 17) {
            window.location.href="/admin/input";
        } else if (e.key == 18) {
            window.location.href="/admin/input";
        } else if (e.key == 19) {
            window.location.href="/admin/input";
        } else if (e.key == 20) {
            window.location.href="/admin/input";
        } else if (e.key == 21) {
            window.location.href="/admin/input";
        } else if (e.key == 22) {
            window.location.href="/admin/input";
        } else if (e.key == 23) {
            window.location.href="/console/rule/clean";
        } else if (e.key == 24) {
            window.location.href="/admin/input";
        } else if (e.key == 25) {
            window.location.href="/admin/input";
        } else if (e.key == 26) {
            window.location.href="/admin/input";
        } else if (e.key == 27) {
            window.location.href="/admin/input";
        } else if (e.key == 28) {
            window.location.href="/admin/input";
        }
    };

    return (
        <Sider collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} style={siderStyle} width="200">
            {/* <div className="demo-logo-vertical" /> */}
            <Menu theme="light" defaultOpenKeys={props.openMenu} defaultSelectedKeys={props.selectedMenu} mode="inline" items={menuItems} onClick={onMenuItemClick} />
        </Sider>
    )
};

export default SiderMenu;

