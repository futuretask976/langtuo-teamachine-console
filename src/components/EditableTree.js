import React, { useState } from 'react';
import { Space, Tree } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
 
const EditableTree = () => {
    const [treeData, setTreeData] = useState([
        {
            key: '总公司', 
            parentKey: 'NULL',
            isEditable: false,
            children: [
                { 
                    key: '上海分公司', 
                    parentKey: '总公司',
                    isEditable: true,
                },
                { 
                    key: '江苏分公司', 
                    parentKey: '总公司',
                    isEditable: true,
                    children: [
                        { 
                            key: '苏州分公司', 
                            parentKey: '江苏分公司',
                            isEditable: true,
                        },
                        { 
                            key: '南京分公司', 
                            parentKey: '南京分公司',
                            isEditable: true,
                        },
                    ] 
                },
            ] 
        },
    ]);
 
    const addNode = (curNodeKey) => {
        console.log('EditableTree#addNode curNodeKey=' + curNodeKey);
        let newNode = {
            key: '待编辑', 
            parentKey: curNodeKey,
            isEditable: true,
        };
        const updatedData = [...treeData];
        console.log('EditableTree#addNode updatedData=' + updatedData);
        const parent = updatedData.find(node => node.ket === curNodeKey);
        console.log('EditableTree#addNode parent=' + parent);
        if (parent) {
            parent.children = parent.children || [];
            parent.children.push(newNode);
            setTreeData(updatedData);
        }
    };
 
    const removeNode = (curNodeKey) => {
        console.log('EditableTree#removeNode curNodeKey=' + curNodeKey);
        const updatedData = [...treeData];
        console.log('EditableTree#removeNode updatedData=' + updatedData);
        const index = updatedData.findIndex(node => node.key === curNodeKey);
        console.log('EditableTree#removeNode index=' + index);
        if (index > -1) {
            updatedData.splice(index, 1);
            setTreeData(updatedData);
        }
    };
 
  return (
    <Tree
        showIcon
        defaultExpandedKeys={['0']}
        treeData={treeData}
        draggable
        blockNode
        onSelect={(curNodeKey) => {
            console.log("curNodeKey =" + curNodeKey);
        }}
        titleRender={(node) => {
            return (
                <div>
                    <Space size={10}>
                        <span>{node.key}</span>
                        <PlusOutlined onClick={() => addNode(node.key)} style={{color: '#1677ff'}}/>
                        <EditOutlined style={{color: '#1677ff'}}/>
                        <DeleteOutlined onClick={() => removeNode(node.key)} style={{color: '#ff4d4f'}}/>
                    </Space>
                </div>
            );
        }}
    />
  );
};
 
export default EditableTree;