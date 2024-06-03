import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Flex, Input, Layout, Modal, Radio, Select, Space, Steps, Table, Col, Row, message, theme } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import HeaderBar from '../components/HeaderBar'
import SiderMenu from '../components/SiderMenu'
import BreadcrumbBlock from "../components/BreadcrumbBlock"
import ToppingListBlock from '../components/ToppingListBlock'
import FooterBar from '../components/FooterBar'

const { Content } = Layout;
const { TextArea } = Input;

const ToppingPage = () => {
    const openMenu = ['teaSub'];
    const selectedMenu = ['16'];
    const breadcrumbPath = ['控制台', '饮品生产', '配方管理'];
    const layoutStyle = {
        height: 1000,
        overflow: 'hidden',
        width: 'calc(100% - 5px)',
        maxWidth: 'calc(100% - 5px)',
        border: '0px solid red',
    };

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [toppingGroupVal, setToppingGroupVal] = useState();
    const [toppingStatVal, setToppingStatVal] = useState(1);
    const [toppingProduceStepListData, setToppingProduceStepListData] = useState([
        {
            key: '1',
            step: '1',
            toppingSelectedList: [],
            actions: ['编辑', '删除'],
        },
        {
            key: '2',
            step: '1',
            toppingSelectedList: [],
            actions: ['编辑', '删除'],
        }
    ]);
    const [teaSubSpecData, setTeaSubSpecData] = useState([
        {
            value: '1',
            label: '杯型',
            subSpecs: [
                {
                    value: '11',
                    label: '大杯',
                },
                {
                    value: '12',
                    label: '中杯',
                },
                {
                    value: '13',
                    label: '小杯',
                }
            ]
        },
        {
            value: '2',
            label: '温度',
            subSpecs: [
                {
                    value: '21',
                    label: '高温',
                },
                {
                    value: '22',
                    label: '中温',
                },
                {
                    value: '23',
                    label: '低温',
                }
            ]
        }
    ]);
    const [testNum, setTestNum] = useState(0);
  
    const onToppingStatChange = (e) => {
        console.log('radio checked', e.target.value);
        setToppingStatVal(e.target.value);
    };

    const onSearch = () => {
        alert("onSearch");
    };

    const onCreate = () => {
        showTitleModal();
    };
    
    const showTitleModal = () => {
        setOpen(true);
    };

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

    const steps = [
        {
            title: '基本信息',
            content: '这里是基本信息',
        },
        {
            title: '操作步骤',
            content: '这里是操作步骤',
        },
        {
            title: '标准配方',
            content: '这里是标准配方',
        },
        {
            title: '选项配置',
            content: '这里是选项配置',
        },
        {
            title: '变动规则',
            content: '这里是变动规则',
        },
    ];

    const next = () => {
        setCurrent(current + 1);
    };
    
    const prev = () => {
        setCurrent(current - 1);
    };

    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));
    
    const contentStyle = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
        height: '100%',
        width: '100%'
    };

    const onToppingGroupChange = (newToppingGroupVal) => {
        setToppingGroupVal(newToppingGroupVal);
    };

    let toppingGroupData = [
        {
            value: 'GROUP_SELF_DEVELOP',
            label: '自研'
        },
        {
            value: 'GROUP_BUY',
            label: '外部采购'
        }
    ];

    const onSelectedToppingChange = (newToppingGroupVal) => {
        addSubSpec();
    };

    let selectedToppingData = [
        {
            value: '1',
            label: '牛奶'
        },
        {
            value: '2',
            label: '葡萄果酱'
        },
        {
            value: '3',
            label: '橙汁'
        },
        {
            value: '4',
            label: '咖啡'
        },
        {
            value: '5',
            label: '茉莉花茶'
        },
        {
            value: '6',
            label: '绿茶'
        }
    ];

    let toppingProduceStepListColumns = [
        {
            title: '步骤',
            dataIndex: 'step',
            key: 'step',
        },
        {
            title: '物料',
            dataIndex: 'toppingSelectedList',
            key: 'toppingSelectedList',
            render: (_, { toppingSelectedList }) => (
                <Select
                    mode="multiple"
                    placeholder="Please select"
                    size="middle"
                    defaultValue={toppingSelectedList}
                    style={{width: '100%'}}
                    onChange={onSelectedToppingChange}
                    options={selectedToppingData}
                />
            ),
        },
        {
            title: '操作',
            key: 'actions',
            render: (_, { actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    return (
                        <a>{action}</a>
                    );
                })}
                </Space>
            ),
        },
    ];

    let teaSpecData = [
        {
            value: '1',
            label: '杯型'
        },
        {
            value: '2',
            label: '温度'
        }
    ];

    const addSubSpec = () => {
        teaSubSpecData.push({
            value: '3',
            label: '糖度',
            subSpecs: [
                {
                    value: '31',
                    label: '高糖',
                },
                {
                    value: '32',
                    label: '中糖',
                },
                {
                    value: '33',
                    label: '低糖',
                }
            ]
        });
        alert("aaaa");
        setTeaSubSpecData(teaSubSpecData);
        setCurrent(current);
        setTestNum(testNum + 1);
    }

    return (
        <>
            <Flex gap="middle" justify="center" wrap="wrap">
                <Layout style={layoutStyle}>
                    <HeaderBar />
                    <Layout>
                        <SiderMenu openMenu={openMenu} selectedMenu={selectedMenu} />
                        <Layout>
                            <Content style={{ margin: '0px 5px 0px 5px' }}>
                                <BreadcrumbBlock breadcrumbPath={breadcrumbPath} />
                                <Row style={{backgroundColor: '#fff'}}>&nbsp;</Row>
                                <Row style={{backgroundColor: '#fff'}}>
                                    <Col className="gutter-row" span={2}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', backgroundColor: '#fff', height: '100%'}}>
                                            <span>配方名称：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Input placeholder="配方名称" />&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Button type="primary" icon={<SearchOutlined />}>开始搜索</Button>&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Button type="primary" icon={<FormOutlined />} onClick={onCreate}>新建配方</Button>&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={12}>
                                        &nbsp;
                                    </Col>
                                </Row>
                                <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
                                <div>&nbsp;</div>
                                <ToppingListBlock />
                            </Content>
                        </Layout>
                    </Layout>
                    <FooterBar />
                </Layout>
            </Flex>

            <Modal
                centered
                open={open}
                title="新建配方"
                onOk={handleOk}
                onCancel={handleCancel}
                width={1000}
                style={{border: '0px solid red'}}
                footer={[
                ]}
            >
                <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', flexDirection: 'column', height: 450, width: '100%'}}>
                    <Steps current={current} items={items} />
                    <div style={contentStyle}>
                        {current == 0 && (
                            <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', flexDirection: 'column', height: '100%', width: '100%'}}>
                                <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', flexDirection: 'row', height: 35, width: '100%'}}>
                                    <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', width: '45%'}}>
                                        <span>配方编码：</span>
                                    </div>
                                    <div style={{height: '100%', width: '10%'}}></div>
                                    <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', width: '45%'}}>
                                        <span>配方名称：</span>
                                    </div>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', flexDirection: 'row', height: 35, width: '100%'}}>
                                    <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', width: '45%'}}>
                                        <Input placeholder="配方编码" />
                                    </div>
                                    <div style={{height: '100%', width: '10%'}}></div>
                                    <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', width: '45%'}}>
                                        <Input placeholder="配方名称" />
                                    </div>
                                </div>

                                <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', flexDirection: 'row', height: 35, width: '100%'}}>
                                    <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', width: '45%'}}>
                                        <span>外部配方编码：</span>
                                    </div>
                                    <div style={{height: '100%', width: '10%'}}></div>
                                    <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', width: '45%'}}>
                                        <span>配方分类：</span>
                                    </div>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', flexDirection: 'row', height: 35, width: '100%'}}>
                                    <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', width: '45%'}}>
                                        <Input placeholder="外部配方编码" />
                                    </div>
                                    <div style={{height: '100%', width: '10%'}}></div>
                                    <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', width: '45%'}}>
                                        <Select
                                            defaultValue={toppingGroupVal}
                                            style={{width: '100%'}}
                                            onChange={onToppingGroupChange}
                                            options={toppingGroupData}
                                        />
                                    </div>
                                </div>

                                <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', flexDirection: 'row', height: 35, width: '100%'}}>
                                    <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', width: '100%'}}>
                                        <span>配方状态：</span>
                                    </div>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', flexDirection: 'row', height: 35, width: '100%'}}>
                                    <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', width: '45%'}}>
                                        <Radio.Group onChange={onToppingStatChange} value={toppingStatVal}>
                                            <Radio value={1}>启用</Radio>
                                            <Radio value={2}>禁用</Radio>
                                        </Radio.Group>
                                    </div>
                                </div>

                                <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', flexDirection: 'row', height: 35, width: '100%'}}>
                                    <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', width: '100%'}}>
                                        <span>备注：</span>
                                    </div>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', flexDirection: 'row', height: 70, width: '100%'}}>
                                    <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', width: '100%'}}>
                                        <TextArea rows={2} placeholder="备注" maxLength={200} />
                                    </div>
                                </div>
                            </div>
                        )}
                        {current == 1 && (
                            <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', flexDirection: 'column', height: '100%', width: '100%'}}>
                                <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', flexDirection: 'row', height: 35, width: '100%'}}>
                                    <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', width: '100%'}}>
                                        <Button key="back" type="primary" style={{margin: '0 8px'}}>新增</Button>
                                    </div>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', flexDirection: 'row', height: '100%', width: '100%'}}>
                                    <Table columns={toppingProduceStepListColumns} dataSource={toppingProduceStepListData} size='small' style={{width: '100%'}} />
                                </div>
                            </div>
                        )}
                        {current == 2 && (
                            <div style={contentStyle}>This is 2</div>
                        )}
                        {testNum >= 0 && current == 3 && (
                            <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', flexDirection: 'column', height: '100%', width: '100%'}}>
                                <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', flexDirection: 'row', height: 35, width: '100%'}}>
                                    <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', width: '45%'}}>
                                        <span>可选规格：</span>
                                    </div>
                                    <div style={{height: '100%', width: '10%'}}></div>
                                    <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', width: '45%'}}>
                                        <Select
                                            mode="multiple"
                                            placeholder="Please select"
                                            size="middle"
                                            defaultValue={teaSpecData}
                                            style={{width: '100%'}}
                                            onChange={onSelectedToppingChange}
                                            options={selectedToppingData}
                                        />
                                    </div>
                                </div>
                                {teaSubSpecData.map((spec) => (
                                    <div id="appendTestDiv" style={{display: 'flex', alignItems: 'center', justifyItems: 'center', flexDirection: 'column', height: 100, width: '100%'}}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', height: 30, width: '100%'}}>
                                            <span>{spec.label}</span>
                                        </div>
                                        <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', height: 50, width: '100%'}}>
                                            {spec.subSpecs.map((subSpec) => (
                                                <Button key="back" onClick={handleCancel}>{subSpec.label}</Button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {current == 4 && (
                            <div style={contentStyle}>This is 4</div>
                        )}
                    </div>
                    <div style={{marginTop: 24}}>
                        {current > 0 && (
                            <Button
                                style={{
                                margin: '0 8px',
                                }}
                                onClick={() => prev()}
                            >
                                上一步
                            </Button>
                        )}
                        {current < steps.length - 1 && (
                            <Button type="primary" onClick={() => next()}>
                                下一步
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button type="primary" onClick={() => message.success('操作完成！')}>
                                完成
                            </Button>
                        )}
                        <Button key="back" onClick={handleCancel} style={{margin: '0 8px'}}>取消</Button>
                        <Button key="submit" type="primary" loading={loading} onClick={handleOk} style={{margin: '0 8px'}}>
                            提交
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
};

export default ToppingPage;
