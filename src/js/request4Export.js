import axios from 'axios';

import { BACKEND_BASE_URL, TIMEOUT } from './config';
import { getLang, isBlankStr } from './common';

const instance4Export = axios.create({
    baseURL: BACKEND_BASE_URL,
    timeout: TIMEOUT
});

// 请求拦截器
instance4Export.interceptors.request.use(
    (config) => {
        // 在请求发送前添加请求头
        config.headers['Authorization'] = localStorage.getItem('jwtToken');
        config.responseType = 'blob';

        let lang = getLang();
        if (isBlankStr(lang)) {
            lang = 'zh_CN';
        }
        config.headers['Lang'] = lang;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
  
// 响应拦截器
instance4Export.interceptors.response.use(
    (response) => {
        // 在响应返回后进行一些额外的处理
        return response;
    },
    (error) => {
        // 处理一些错误，如网络错误、服务器错误等
        return Promise.reject(error);
    }
);

export const get4Export = async (url, params) => {
    try {
        const response = await instance4Export.get(url, {
            params,
        });
        return response.data;
    } catch (error) {
        // 处理一些错误，如网络错误、服务器错误等
        throw error;
    }
};




