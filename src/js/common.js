export const TEAMACHINE_HOST_URL = 'http://localhost:8080/teamachine';
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

export const isValidInput = (value) => {
    return /^[A-Za-z0-9_]{0,50}$/.test(value);
};

export const isValidTextArea = (value) => {
    return /^[A-Za-z0-9_]{0,50}$/.test(value);
};



// http response 处理
export const getJwtToken = () => {
    let jwtToken = localStorage.getItem('jwtToken');
    if (isBlankStr(jwtToken)) {
        return '';
    } else {
        return jwtToken;
    }
};

export const getTenantCode = () => {
    let tenantCode = localStorage.getItem('tenantCode');
    if (isBlankStr(tenantCode)) {
        return '';
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

export const isRespSuccess = (resp) => {
    if (isBlankObj(resp) || isBlankObj(resp.data)) {
        return false;
    }
    return resp.data.success;
};




