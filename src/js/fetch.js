export const TEAMACHINE_HOST_URL = 'http://localhost:8080/teamachine';

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

// 网路请求
export const fetchOSSToken = () => {
    axios.get(genGetUrl('/securityset/oss/token/get'), {
        withCredentials: true // 这会让axios在请求中携带cookies
    })
    .then(response => {
        if (response && response.data && response.data.success) {
            setAccessKeyId(response.data.model.accessKeyId);
            setAccessKeySecret(response.data.model.accessKeySecret);
            setSecurityToken(response.data.model.securityToken);
        }
    })
    .catch(error => {
        // console.error('error: ', error);
        // console.error('error.response: ', error.response);
        // console.error('error.response.status: ', error.response.status);
        if (error && error.response && error.response.status === 401) {
            // window.location.href="/gxadmin/login";
        }
    });
}





