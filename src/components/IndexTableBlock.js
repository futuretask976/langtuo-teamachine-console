import React, { useEffect, useState } from 'react';
import { theme, Button, Image, Input, Modal, Space, Table, Col, Row } from 'antd';
import axios from 'axios';

import portrait from '../images/portrait.jpg'

const { TextArea } = Input;

function IndexTableBlock() {
    const [machineData, setMachineData] = useState([]);
    useEffect(() => {
        axios.get('/gxsp3demo/machine/list', {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
            .then(response => {
                console.log("response: ", response);
                let tmpData = [];
                response.data.model.forEach((item, index) => {
                    tmpData.push({
                        key: index,
                        id: item.id,
                        machineCode: item.machineCode,
                        machineName: item.machineName,
                    });
                });
                setMachineData(tmpData);
            })
            .catch(error => {
                // console.error('error: ', error);
                // console.error('error.response: ', error.response);
                // console.error('error.response.status: ', error.response.status);
                if (error && error.response && error.response.status === 401) {
                    // window.location.href="/gxadmin/login";
                }
            });
    }, []);

    const [maCode, setMaCode] = useState();
    const [maName, setMaName] = useState();
    const onTitleClick = (record) => {
        setMaCode(record.machineCode);
        setMaName(record.machineName);
        showTitleModal();
    };

    const onDeleteClick = (e) => {
        alert(e);
        console.log('onDeleteClick', e);
    };

    const [open, setOpen] = useState(false);
    const showTitleModal = () => {
        setOpen(true);
    };

    const [loading, setLoading] = useState(false);
    const handleOk = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOpen(false);
        }, 3000);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    let {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    let columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (_, record) => (
                <Button type='link' onClick={() => onTitleClick(record)}>{record.id}</Button>
            ),
        },
        {
            title: '机器代码',
            dataIndex: 'machineCode',
            key: 'machineCode',
        },
        {
            title: '机器名称',
            dataIndex: 'machineName',
            key: 'machineName',
        },
        {
            title: '动作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => onDeleteClick(record.machineName)}>删除</a>
                </Space>
            ),
        },
    ];

    if (!machineData) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div style={{ padding: 24, minHeight: 500, background: colorBgContainer, borderRadius: borderRadiusLG }}>
                <Table columns={columns} dataSource={machineData} />
            </div>

            <Modal
                open={open}
                title="用户详细情况"
                onOk={handleOk}
                onCancel={handleCancel}
                style={{display: 'flex', alignItems: 'center', flexDirection: 'row', border: '0px solid red'}}
                height={525}
                width={625}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Return
                    </Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                        Submit
                    </Button>,
                    <Button
                        key="link"
                        href="https://google.com"
                        type="primary"
                        loading={loading}
                        onClick={handleOk}
                    >
                        Search on Google
                    </Button>,
                ]}
            >
                <div style={{display: 'flex', alignItems: 'center', flexDirection: 'row', height: 500, width: 600, border: '0px solid yellow'}}>
                    <Row style={{height: 500, width: 600, border: '0px solid black'}}>
                        <Col span={14}>
                            <div>
                                <Row>
                                    <Col span={5} style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: 5}}>姓名：</Col>
                                    <Col span={19} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 5}}><Input placeholder="姓名，例如文一西路西溪泊岸3幢731室" value={maCode} /></Col>
                                </Row>
                                <Row>
                                    <Col span={5} style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: 5}}>性别：</Col>
                                    <Col span={19} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 5}}><Input placeholder="性别，例如男或者女" value={maName} /></Col>
                                </Row>
                                <Row>
                                    <Col span={5} style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: 5}}>身高：</Col>
                                    <Col span={19} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 5}}><Input placeholder="身高，例如183cm" /></Col>
                                </Row>
                                <Row>
                                    <Col span={24} style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: 5}}>详细介绍：</Col>
                                </Row>
                                <Row>
                                    <Col span={24} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 5}}>
                                        <TextArea rows={15} placeholder="maxLength is 1200" maxLength={1200} />
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col span={10} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 5}}>
                            <Image height={500} width={250} src={portrait} />
                        </Col>
                    </Row>
                </div>
            </Modal>
        </>
    )
};

export default IndexTableBlock;

