import React, { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, Flex, Input, Layout, Modal, Radio, Select, Space, Steps, Table, Tabs, Col, Row, message, theme } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../css/common.css';

const { Content } = Layout;
const { TextArea } = Input;

const CleanRuleNewModal = (props, onClose) => {
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleOk = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOpen(false);
        }, 3000);
    };

    const handleCancel = () => {
        props.onClose();
        setOpen(false);
    };

    const initialItems = [
        {
          label: 'Tab 1',
          children: 'Content of Tab 1',
          key: '1',
        },
        {
          label: 'Tab 2',
          children: 'Content of Tab 2',
          key: '2',
        },
        {
          label: 'Tab 3',
          children: 'Content of Tab 3',
          key: '3',
          closable: false,
        },
      ];

      const [activeKey, setActiveKey] = useState(initialItems[0].key);
  const [items, setItems] = useState(initialItems);
  const newTabIndex = useRef(0);
  const onChange = (newActiveKey) => {
    setActiveKey(newActiveKey);
  };
  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    const newPanes = [...items];
    newPanes.push({
      label: 'New Tab',
      children: 'Content of new Tab',
      key: newActiveKey,
    });
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };
  const remove = (targetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };
  const onEdit = (targetKey, action) => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };
 
    return (
        <Modal
            centered
            open={open}
            title={props.modalTitle}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1000}
            footer={[

            ]}
        >
            <div class="flex-col-cont" style={{height: 450, width: '100%', border: '1px solid red'}}>
                <Tabs type="editable-card" onChange={onChange} activeKey={activeKey} onEdit={onEdit} items={items} />
            </div>
        </Modal>
    );
};
 
export default CleanRuleNewModal;