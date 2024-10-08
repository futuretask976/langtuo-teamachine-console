import axios from 'axios';

import { BACKEND_BASE_URL, CONSOLE_CONTEXT_PATH, TIMEOUT} from './config';

const instance = axios.create({
    baseURL: BACKEND_BASE_URL,
    timeout: TIMEOUT
});

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        // 在请求发送前添加请求头
        config.headers['Authorization'] = localStorage.getItem('jwtToken');
        config.headers['Lang'] = 'zh_CN';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
  
// 响应拦截器
instance.interceptors.response.use(
    (response) => {
        // console.log('$$$$$ responseInter response=', response);
        // 在响应返回后进行一些额外的处理
        return response;
    },
    (error) => {
        // console.log('$$$$$ instance.interceptors.response.use error=', error);
        if (error != undefined && error != null) {
            let message = error.message;
            // console.log('$$$$$ instance.interceptors.response.use message=', message);
            if (message != undefined && message != null) {
                if (error.response != undefined && error.response != null) {
                    let status = error.response.status;
                    // console.log('$$$$$ instance.interceptors.response.use status=', status);
                    if (status == '401') {
                        alert('登录验证失败，请重新登录！');
                        window.location.href = CONSOLE_CONTEXT_PATH + '/login';
                        return;
                    } else if (status == '403') {
                        // window.location.href = CONSOLE_CONTEXT_PATH + '/error?msg=' + encodeURI('授权验证失败，请联系管理员授权！');
                        alert('授权验证失败，请联系管理员授权！');
                        return Promise.reject(error);
                    } else if (status == '404') {
                        // window.location.href = CONSOLE_CONTEXT_PATH + '/error?msg=' + encodeURI('授权验证失败，请联系管理员授权！');
                        alert('页面未找到，请联系管理员！');
                        return Promise.reject(error);
                    }
                }
                window.location.href = CONSOLE_CONTEXT_PATH + '/error?msg=' + encodeURI(message);
                return;
            }
        }
        // window.location.href = CONSOLE_CONTEXT_PATH + '/error?msg=' + encodeURI('发生未知错误，请联系管理员处理！');
        alert('发生未知错误，请联系管理员处理！');
        return Promise.reject(error);

        // 处理一些错误，如网络错误、服务器错误等
        // return Promise.reject(error);
    }
);

export const get = async (url, params) => {
    try {
        const response = await instance.get(url, {
            params,
        });
        return response.data;
    } catch (error) {
        // 处理一些错误，如网络错误、服务器错误等
        // throw error;
    }
};

export const post = async (url, data) => {
    try {
        const response = await instance.post(url, data);
        return response.data;
    } catch (error) {
        // 处理一些错误，如网络错误、服务器错误等
        // throw error;
    }
};

export const put = async (url, data) => {
    try {
        const response = await instance.put(url, data);
        return response.data;
    } catch (error) {
        // 处理一些错误，如网络错误、服务器错误等
        // throw error;
    }
};

export const del = async (url, params) => {
    try {
        const response = await instance.delete(url, {
            params,
        });
        return response.data;
    } catch (error) {
        // 处理一些错误，如网络错误、服务器错误等
        // throw error;
    }
};



