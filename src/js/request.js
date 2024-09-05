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
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
  
// 响应拦截器
instance.interceptors.response.use(
    (response) => {
        console.log('$$$$$ responseInter response=', response);
        // 在响应返回后进行一些额外的处理
        return response;
    },
    (error) => {
        let message = error.message;
        let status = error.response.status;
        window.location.href = CONSOLE_CONTEXT_PATH + '/error?msg=' + encodeURI(message);
        // 处理一些错误，如网络错误、服务器错误等
        return Promise.reject(error);
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
        throw error;
    }
};

export const post = async (url, data) => {
    try {
        const response = await instance.post(url, data);
        return response.data;
    } catch (error) {
        // 处理一些错误，如网络错误、服务器错误等
        throw error;
    }
};

export const put = async (url, data) => {
    try {
        const response = await instance.put(url, data);
        return response.data;
    } catch (error) {
        // 处理一些错误，如网络错误、服务器错误等
        throw error;
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
        throw error;
    }
};



