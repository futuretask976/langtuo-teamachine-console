import React from 'react';

import { Layout } from 'antd';

const FooterBar = () => {
    let { Footer } = Layout;

    let footerStyle = {
        padding: 0,
        width: '100%',
        border: '0px solid blue'
    };

    return (
        <Footer style={footerStyle}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <span>&nbsp;</span>
            </div>
        </Footer>
    )
};

export default FooterBar;

