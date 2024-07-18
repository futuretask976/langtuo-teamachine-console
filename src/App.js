import React from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Outlet, RouterProvider, Navigate, createBrowserRouter } from 'react-router-dom';

import MachineModelPage from './pages/MachineModelPage';
import TenantPage from './pages/TenantPage';
import OrgStrucPage from './pages/OrgStrucPage';
import RolePage from './pages/RolePage';
import AdminPage from './pages/AdminPage';
import ShopGroupPage from './pages/ShopGroupPage';
import ShopPage from './pages/ShopPage';
import MachineDeployPage from './pages/MachineDeployPage';
import MachinePage from './pages/MachinePage';
import ToppingTypePage from './pages/ToppingTypePage';
import ToppingPage from './pages/ToppingPage';
import SpecPage from './pages/SpecPage';
import TeaTypePage from './pages/TeaTypePage';
import TeaPage from './pages/TeaPage';
import ToppingAccuracyTemplatePage from './pages/ToppingAccuracyTemplatePage';
import SeriesPage from './pages/SeriesPage';
import MenuPage from './pages/MenuPage';
import CleanRulePage from './pages/CleanRulePage';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    // useState 返回一个状态和一个修改状态的方法，状态需要通过这个方法来进行修改
    // useState 的入参是这个参数的初始状态
    const [token, setToken_] = useState(localStorage.getItem("token"));
 
    const setToken = (newToken) => {
        setToken_(newToken);
    };
 
    // 仅当 token 发生变化时，useEffect 定义的方法才会被执行
    useEffect(() => {
        if (token) {
          localStorage.setItem('token',token);
        } else {
          localStorage.removeItem('token')
        }
    }, [token]);
    
    // 缓存封装，同样的参数+函数，如果已经缓存，则直接返回缓存的值
    const contextValue = useMemo(
        () => ({
            token,
            setToken,
        }),
        [token]
    );
 
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
 
const useAuth = () => {
    return useContext(AuthContext);
};

const Routes = () => {
    const { token } = useAuth();
   
    // 公共路由配置
    const routesForPublic = [
        {
            element: <PublicRoute />, // Wrap the component in AuthenticatedOnlyRoute
            children: [
                {
                    path: "/",
                    element: <Navigate to="/index" />,
                },
                {
                    path: "/index",
                    element: <IndexPage />,
                },
                {
                    path: "/metadataset/model",
                    element: <MachineModelPage />,
                },
                {
                    path: "/userset/tenant",
                    element: <TenantPage />,
                },
                {
                    path: "/userset/org/struc",
                    element: <OrgStrucPage />,
                },
                {
                    path: "/userset/role",
                    element: <RolePage />,
                },
                {
                    path: "/userset/admin",
                    element: <AdminPage />,
                },
                {
                    path: "/shopset/group",
                    element: <ShopGroupPage />,
                },
                {
                    path: "/deviceset/deploy",
                    element: <MachineDeployPage />,
                },
                {
                    path: "/deviceset/machine",
                    element: <MachinePage />,
                },
                {
                    path: "/shopset/shop",
                    element: <ShopPage />,
                },
                {
                    path: "/drinkset/topping/type",
                    element: <ToppingTypePage />,
                },
                {
                    path: "/drinkset/topping",
                    element: <ToppingPage />,
                },
                {
                    path: "/drinkset/spec",
                    element: <SpecPage />,
                },
                {
                    path: "/drinkset/tea/type",
                    element: <TeaTypePage />,
                },
                {
                    path: "/drinkset/tea",
                    element: <TeaPage />,
                },
                {
                    path: "/drinkset/topping/accuracy/template",
                    element: <ToppingAccuracyTemplatePage />,
                },
                {
                    path: "/menuset/series",
                    element: <SeriesPage />,
                },
                {
                    path: "/menuset/menu",
                    element: <MenuPage />,
                },
                {
                    path: "/ruleset/clean",
                    element: <CleanRulePage />,
                },
                {
                    path: "/login",
                    element: <LoginPage />,
                },
                {
                    path: "/logout",
                    element: <LogoutPage />,
                }
            ]
        }
    ];
   
    // 授权的用户才可以访问的路由配置
    const routesForAuthenticatedOnly = [
        {
            element: <AuthenticatedOnlyRoute />, // Wrap the component in AuthenticatedOnlyRoute
            children: []
        }
    ];
   
    // 合并路由配置
    const router = createBrowserRouter([
        ...routesForPublic,
        ...routesForAuthenticatedOnly,
    ],
    {
        basename: "/console"
    });
   
    return <RouterProvider router={router} />;
};


const PublicRoute = () => {
    const { token } = useAuth();
  
    console.log("App.js#PublicRoute entering");
  
    // 如果已经登录，则直接渲染目标组件
    return <Outlet />;
};

const AuthenticatedOnlyRoute = () => {
    const { token } = useAuth();
  
    // 判断用户是否有登录
    if (!token) {
      // 如果没有登录，则跳转到登录页面
      return <Navigate to="/login" />;
    }
  
    // 如果已经登录，则直接渲染目标组件
    return <Outlet />;
};

function App() {
    return (
        <AuthProvider>
            <Routes />
        </AuthProvider>
    );
}

export default App;
