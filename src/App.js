import React, { useState } from "react";
import { Outlet, RouterProvider, Navigate, createBrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';

import { FramePageContext } from './js/context';
import { getLang, getJwtToken, isBlankStr } from './js/common';

import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';

import FramePage from './pages/FramePage';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import ErrorPage from './pages/ErrorPage';

const Routes = () => {
    // 公共路由配置
    const routesForPublic = [
        {
            element: <PublicRoute />,
            children: [
                {
                    path: "/login",
                    element: <LoginPage />,
                },
                {
                    path: "/logout",
                    element: <LogoutPage />,
                },
                {
                    path: "/error",
                    element: <ErrorPage />,
                }
            ]
        }
    ];
   
    // 授权的用户才可以访问的路由配置
    const routesForAuthenticatedOnly = [
        {
            element: <AuthenticatedOnlyRoute />,
            children: [
                {
                    path: "/",
                    element: <Navigate to="/index" />,
                },
                {
                    path: "/index",
                    element: <FramePage />,
                }
            ]
        }
    ];
   
    // 合并路由配置
    const router = createBrowserRouter(
        [
            ...routesForPublic,
            ...routesForAuthenticatedOnly,
        ],
        {
            basename: "/teamachineconsole"
        }
    );
   
    return <RouterProvider router={router} />;
};


const PublicRoute = () => {  
    // 直接渲染目标组件
    return <Outlet />;
};

const AuthenticatedOnlyRoute = () => {
    // 判断用户是否有登录
    const jwtToken = getJwtToken();
    if (isBlankStr(jwtToken)) {
        // 如果没有登录，则跳转到登录页面
        return <Navigate to="/login" />;
    }
  
    // 如果已经登录，则直接渲染目标组件
    return <Outlet />;
};

const getLocale = () => {
    let lang = getLang();
    console.log('$$$$$ App.js lang=', lang)
    let locale = (lang == 'zh_CN') ? zhCN : enUS;
    return locale;
}



function App() {
    const [refresh, setRefresh] = useState(1);

    document.title = 'Tea Machine';
    return (
        <FramePageContext.Provider value={{ refresh, setRefresh }}>
            <ConfigProvider 
                key={refresh}
                locale={getLocale()}
                theme={{
                    token: {
                        colorPrimary: '#353535'
                    },
                    components: {
                        Button: {
                            colorPrimary: '#353535'
                        },
                        Menu: {
                            itemSelectedBg: '#D6D6D6',
                            subMenuItemBg: '#FFFFFF'
                        },
                        Select: {
                            optionSelectedColor: '#FFFFFF'
                        }
                    }
                }}
            >
                <Routes />
            </ConfigProvider>
        </FramePageContext.Provider>
        
    );
}

export default App;
