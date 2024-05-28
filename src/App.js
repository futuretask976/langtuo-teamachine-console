import React from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Outlet, RouterProvider, Navigate, createBrowserRouter } from 'react-router-dom';

import IndexPage from './pages/IndexPage';
import InputPage from './pages/InputPage';
import SearchPage from './pages/SearchPage';
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
                    path: "/input",
                    element: <InputPage />,
                },
                {
                    path: "/search",
                    element: <SearchPage />,
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
        basename: "/gxadmin"
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
