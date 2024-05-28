import React from 'react';
import { Breadcrumb } from 'antd';

export default class BreadcrumbBlock extends React.Component{
    constructor(){
        super();
    }

    render(){
        let breadcrumbItems = [];
        for (let i = 0; i < this.props.breadcrumbPath.length; i++) {
            breadcrumbItems.push({
                key: i,
                title: this.props.breadcrumbPath[i]
            });
        }

        return(
            <>
                <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />
            </>
        )  
    }
}

