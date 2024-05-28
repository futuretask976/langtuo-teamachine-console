import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { DesktopOutlined, FileOutlined, PieChartOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';

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
        getItem('主页', '1', <PieChartOutlined />),
        getItem('输入', '2', <DesktopOutlined />),
        getItem('配置', 'sub1', <UserOutlined />, [
            getItem('搜索', '3'),
            getItem('表单配置', '4'),
            getItem('场景', '5'),
        ]),
        getItem('团队', 'sub2', <TeamOutlined />, [getItem('开发团队', '6'), getItem('运营团队', '7')]),
        getItem('文件', '8', <FileOutlined />),
    ];

    const siderStyle = {
        backgroundColor: '#ffffff',
        height: '100%',
        lineHeight: '240px',
        paddingInline: 0,
        textAlign: 'left',
        border: '0px solid yellow'
    };

    const onMenuItemClick = (e) => {
        if (e.key === 1) {
            window.location.href="/admin/index";
        } else if (e.key === 2) {
            window.location.href="/admin/input";
        } else if (e.key === 3) {
            window.location.href="/admin/search";
        } else if (e.key === 4) {
            window.location.href="/admin/search";
        } else if (e.key === 5) {
            window.location.href="/admin/input";
        } else if (e.key === 6) {
            window.location.href="/admin/input";
        } else if (e.key === 7) {
            window.location.href="/admin/input";
        } else if (e.key === 8) {
            window.location.href="/admin/input";
        }
    };

    return (
        <Sider collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} style={siderStyle} width="200">
            {/* <div className="demo-logo-vertical" /> */}
            <Menu theme="light" defaultSelectedKeys={props.selectedMenu} mode="inline" items={menuItems} onClick={onMenuItemClick} />
        </Sider>
    )
};

export default SiderMenu;

