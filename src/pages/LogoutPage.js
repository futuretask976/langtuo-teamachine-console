import React  from 'react';

const LogoutPage = () => {
    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: 600, width: '100%', border: '0px solid gray'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'gray', height: 30, color: 'white', width: '30%', border: '1px solid gray'}}>
                用户登出成功
            </div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: 45, width: '30%', border: '1px solid gray'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', height: 40, width: '100%', border: '0px solid green'}}>
                    <a href='/gxadmin/index'>返回首页</a>
                </div>
            </div>
        </div>
    )
};

export default LogoutPage;
