export const TEAMACHINE_HOST_URL = 'http://localhost:8080/teamachinebackend';
export const OSS_CONFIG_BUCKET = 'miya-bucket2';
export const OSS_CONFIG_REGION = 'oss-cn-hangzhou';
export const OSS_CONFIG_TEA_FOLDER = 'teamachine/tea';
export const OSS_CONFIG_SERIES_FOLDER = 'teamachine/series';
export const OSS_CONFIG_MENU_FOLDER = 'teamachine/folder';

// 通用方法
export const dateToYMDHMS = (date) => {
    function pad(number) {
      if (number < 10) {
        return '0' + number;
      }
      return number;
    }
   
    date = new Date(date);
    return (
        date.getFullYear() + '-' +
        pad(date.getMonth() + 1) + '-' +
        pad(date.getDate()) + ' ' +
        pad(date.getHours()) + ':' +
        pad(date.getMinutes()) + ':' +
        pad(date.getSeconds())
    );
}

export const genGetUrl = (path) => {
    let url = TEAMACHINE_HOST_URL + path;
    return url;
}

export const genGetUrlByParams = (path, params) => {
    let url = TEAMACHINE_HOST_URL + path;
    let paramStr = '';
    for (let key in params) {
        if (params.hasOwnProperty(key)) {
            paramStr = paramStr + "&" + key + "=" + params[key];
        }
    }
    if (isBlankStr(paramStr)) {
        return url;
    } else {
        return url + "?" + paramStr.slice(1);
    }
}

export const genGetUrlBySegs = (path, segments) => {
    let url = TEAMACHINE_HOST_URL + path;
    segments.forEach(ele => {
        url = url.replace('{segment}', ele);
    })
    return url;
}

export const genPostUrl = (path) => {
    let url = TEAMACHINE_HOST_URL + path;
    return url;
}

export const isArray = (arr) => {
    if (arr == undefined || arr == null || !arr instanceof Array) {
        return false;
    } else {
        return true;
    }
};

export const isEmptyArray = (arr) => {
    if (arr == undefined || arr == null || !arr instanceof Array) {
        return true;
    } else {
        if (arr.length == 0) {
            return true;
        } else {
            return false;
        }
    }
};

export const isBlankArray = (arr) => {
    if (arr == undefined || arr == null || !arr instanceof Array) {
        return true;
    } else if (arr.length == 0) {
        return true;
    } else {
        return false;
    }
};

export const isBlankObj = (obj) => {
    if (obj == undefined || obj == null) {
        return true;
    } else {
        return false;
    }
};

export const isBlankStr = (str) => {
    if (str == undefined || str == null || str == '') {
        return true;
    } else {
        return false;
    }
};

export const isNumber = (value) => {
    return /^-?\d+(\.\d+)?$/.test(value);
};

export const isValidCode = (input, required) => {
    if (isBlankStr(input)) {
        if (!required) {
            return true;
        }
    } else {
        let isValid = /^[A-Za-z0-9_]{0,50}$/.test(input);
        if (isValid) {
            return true;
        }
    }
    return false;
};

export const isValidName = (input, required) => {
    if (isBlankStr(input)) {
        if (!required) {
            return true;
        }
    } else {
        let isValid = /^[A-Za-z0-9_\u4e00-\u9fa5]{0,50}$/.test(input);
        if (isValid) {
            return true;
        }
    }
    return false;
};

export const isValidComment = (input, required) => {
    if (isBlankStr(input)) {
        if (!required) {
            return true;
        }
    } else {
        let isValid = /^[A-Za-z0-9_\u4e00-\u9fa5\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b\uFF01]{0,200}$/.test(input);
        if (isValid) {
            return true;
        }
    }
    return false;
};

// http response 处理
export const deleteCookie = (name) => {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

// 清除本地存储的认证信息，如token等
export const deleteJwtToken = () => {
    localStorage.removeItem('jwtToken');
    deleteCookie('JSESSIONID');
};

export const getJwtToken = () => {
    let jwtToken = localStorage.getItem('jwtToken');
    if (isBlankStr(jwtToken)) {
        return null;
    } else {
        return jwtToken;
    }
};

export const getTenantCode = () => {
    let tenantCode = localStorage.getItem('tenantCode');
    if (isBlankStr(tenantCode)) {
        return null;
    } else {
        return tenantCode;
    }
};

export const getRespModel = (resp) => {
    if (isBlankObj(resp) || isBlankObj(resp.data) || !resp.data.success || isBlankObj(resp.data.model)) {
        alert("网络请求出现异常！");
        window.location.href='http://localhost:3000/console/error';
    }
    let model = resp.data.model;
    return model;
};

export const getRespErrorCode = (resp) => {
    if (isBlankObj(resp) || isBlankObj(resp.data) || resp.data.success) {
        return;
    }
    return resp.data.errorCode;
};

export const getRespErrorMsg = (resp) => {
    if (isBlankObj(resp) || isBlankObj(resp.data) || resp.data.success) {
        return;
    }
    return resp.data.errorMsg;
};

export const handleRespError = (errorResp) => {
    if (isBlankObj(errorResp) || isBlankObj(errorResp.response)) {
        let redirectUrl = 'http://localhost:3000/console/error?msg=' + encodeURI('网络请求出现异常！');
        console.log(redirectUrl);
        window.location.href=redirectUrl;
    }
    let resp = errorResp.response;
    if (resp.status == 401) {
        window.location.href='http://localhost:3000/console/login?msg=' + encodeURI('认证失败，需要重新登录！');
    } else if (resp.status == 403) {
        alert("授权失败，请咨询管理员授权！");
    } else {
        window.location.href='http://localhost:3000/console/error?msg=' + encodeURI('出现未知错误！');
    }
};

export const handleRespExport = (resp) => {
    const url4Export = window.URL.createObjectURL(new Blob([resp.data]));
    const link4Export = document.createElement('a');
    link4Export.href = url4Export;
    link4Export.setAttribute('download', 'export.xlsx');
    document.body.appendChild(link4Export);
    link4Export.click();
    document.body.removeChild(link4Export);
};

export const isRespSuccess = (resp) => {
    if (isBlankObj(resp) || isBlankObj(resp.data)) {
        return false;
    }
    return resp.data.success;
};

export const putJwtToken = (jwtToken) => {
    localStorage.setItem('jwtToken', jwtToken);
};

export const putTenantCode = (tenantCode) => {
    localStorage.setItem('tenantCode', tenantCode);
};




