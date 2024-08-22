import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Outlet, RouterProvider, Navigate, createBrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';

import { getJwtToken } from './js/common.js';

// userset
import TenantPage from './pages/user/TenantPage';
import RolePage from './pages/user/RolePage';
import AdminPage from './pages/user/AdminPage';
import OrgPage from './pages/user/OrgPage';
// shopset
import ShopGroupPage from './pages/shop/ShopGroupPage';
import ShopPage from './pages/shop/ShopPage';
// deviceset
import ModelPage from './pages/device/ModelPage';
import DeployPage from './pages/device/DeployPage';
import MachinePage from './pages/device/MachinePage';
// drinkset
import ToppingTypePage from './pages/drink/ToppingTypePage';
import ToppingPage from './pages/drink/ToppingPage';
import SpecPage from './pages/drink/SpecPage';
import TeaTypePage from './pages/drink/TeaTypePage';
import TeaPage from './pages/drink/TeaPage';
import AccuracyTplPage from './pages/drink/AccuracyTplPage';
// menu
import SeriesPage from './pages/menu/SeriesPage';
import MenuPage from './pages/menu/MenuPage';
// ruleset
import DrainRulePage from './pages/rule/DrainRulePage';
import CleanRulePage from './pages/rule/CleanRulePage';
import WarningRulePage from './pages/rule/WarningRulePage';
// recordset
import InvalidActRecordPage from './pages/record/InvalidActRecordPage';
import SupplyActRecordPage from './pages/record/SupplyActRecordPage';
import DrainActRecordPage from './pages/record/DrainActRecordPage';
import CleanActRecordPage from './pages/record/CleanActRecordPage';
import OrderActRecordPage from './pages/record/OrderActRecordPage';
// single page
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import ErrorPage from './pages/ErrorPage';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    // useState 返回一个状态和一个修改状态的方法，状态需要通过这个方法来进行修改
    // useState 的入参是这个参数的初始状态
    const [token, setToken_] = useState(getJwtToken());
 
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
            element: <AuthenticatedOnlyRoute />, // Wrap the component in AuthenticatedOnlyRoute
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
                    path: "/userset/tenant",
                    element: <TenantPage />,
                },
                {
                    path: "/userset/org",
                    element: <OrgPage />,
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
                    path: "/deviceset/model",
                    element: <ModelPage />,
                },
                {
                    path: "/deviceset/deploy",
                    element: <DeployPage />,
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
                    element: <AccuracyTplPage />,
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
                    path: "/ruleset/drain",
                    element: <DrainRulePage />,
                },
                {
                    path: "/ruleset/clean",
                    element: <CleanRulePage />,
                },
                {
                    path: "/ruleset/warning",
                    element: <WarningRulePage />,
                },
                {
                    path: "/recordset/invalid",
                    element: <InvalidActRecordPage />,
                },
                {
                    path: "/recordset/supply",
                    element: <SupplyActRecordPage />,
                },
                {
                    path: "/recordset/drain",
                    element: <DrainActRecordPage />,
                },
                {
                    path: "/recordset/clean",
                    element: <CleanActRecordPage />,
                },
                {
                    path: "/recordset/order",
                    element: <OrderActRecordPage />,
                }
            ]
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
  
    console.log("$$$$$ PublicRoute entering=", token);
  
    // 如果已经登录，则直接渲染目标组件
    return <Outlet />;
};

const AuthenticatedOnlyRoute = () => {
    const { token } = useAuth();

    console.log("$$$$$ AuthenticatedOnlyRoute entering=", token);
  
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
            <ConfigProvider theme={{
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
            }}>
                <Routes />
            </ConfigProvider>
        </AuthProvider>
    );
}

export default App;
