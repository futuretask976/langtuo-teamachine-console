import React, { useEffect, useState } from 'react';
import { Space, Tree } from 'antd';
import { isArray } from '../../js/common';
 
const EditableTree = (props) => {
    const [expandedKeys, setExpandedKeys] = useState([]);

    const initDefaultExpandedKeys = () => {
        let tmp = [];
        let loop = (data) => {
            if (isArray(data)) {
                data.map((item, index) => {
                    tmp.push(item.key);
                    if (item.children && item.children.length > 0) {
                        loop(item.children)
                    }
                })
            }
        }
        loop(props.orgStrucTree);
        setExpandedKeys(tmp);
    }
    useEffect(() => {
        initDefaultExpandedKeys();
    }, [props.orgStrucTree]);

    return (
        <>
            {isArray(props.orgStrucTree) && (
                <Tree
                    defaultExpandAll
                    titleRender={(node) => {
                        return (
                            <div>
                                <Space size={10}>
                                    <span>{node.key}</span>
                                </Space>
                            </div>
                        );
                    }}
                    treeData={props.orgStrucTree}
                />
            )}
        </>
  );
};
 
export default EditableTree;