import React from 'react';

import { List } from 'antd';

const IndexListBlock = () => {
    let indexListBlockData = [
        'Racing car sprays burning fuel into crowd.',
        'Japanese princess to wed commoner.',
        'Australian walks 100km after outback crash.',
    ];

    let indexListBlockStyle = {
        background: '#ffffff',
        padding: '5px, 5px, 5px, 5px',
        height: 210,
        border: '0px solid gray'
    };

    return (
        <div style={indexListBlockStyle}>
            <List size="small" header={<div style={{paddingLeft: '15px'}}>Header</div>} footer={<div style={{paddingLeft: '15px', paddingRight: '15px', textAlign: 'right'}}>&gt;&gt;更多</div>} dataSource={indexListBlockData} renderItem={(item) => <List.Item>{item}</List.Item>} />
        </div>
    )
};

export default IndexListBlock;

