import axios from 'axios';

import { BACKEND_BASE_URL, TIMEOUT } from './config';

const instance4Import = axios.create({
    baseURL: BACKEND_BASE_URL,
    timeout: TIMEOUT
});

// 请求拦截器
instance4Import.interceptors.request.use(
    (config) => {
        // 在请求发送前添加请求头
        config.headers['Authorization'] = localStorage.getItem('jwtToken');
        config.headers['Content-Type'] = 'multipart/form-data';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
  
// 响应拦截器
instance4Import.interceptors.response.use(
    (response) => {
        // 在响应返回后进行一些额外的处理
        return response;
    },
    (error) => {
        // 处理一些错误，如网络错误、服务器错误等
        return Promise.reject(error);
    }
);

export const post4Import = async (url, data) => {
    try {
        const response = await instance4Import.post(url, data);
        return response.data;
    } catch (error) {
        // 处理一些错误，如网络错误、服务器错误等
        throw error;
    }
};




