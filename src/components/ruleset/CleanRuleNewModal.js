import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Modal, Select, Switch, Tabs } from 'antd';
import axios from 'axios';

import CleanRuleStepTabPane from './CleanRuleStepTabPane'

import '../../css/common.css';
import { isArray, isBlankStr, genGetUrlByParams, genGetUrlBySegs, genPostUrl } from '../../js/common.js';

const CleanRuleNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl('/ruleset/clean/put');
        axios.put(url, {
            withCredentials: true, // 这会让axios在请求中携带cookies
            tenantCode: 'tenant_001',
            cleanRuleCode: cleanRuleCode,
            cleanRuleName: cleanRuleName,
            permitRemind: permitRemind,
            permitBatch: permitBatch,
            exceptToppingCodeList: exceptToppingCodeList,
            cleanRuleStepList: cleanRuleStepList
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                alert("here is success")
            } else {
                alert("here is wrong")
            }
        })
        .catch(error => {
            alert("here is error")
            // console.error('error: ', error);
            // console.error('error.response: ', error.response);
            // console.error('error.response.status: ', error.response.status);
            if (error && error.response && error.response.status === 401) {
                // window.location.href="/gxadmin/login";
            }
        });

        setTimeout(() => {
            setLoading(false);
            props.onClose();
            setOpen(false);
        }, 1000);
    };
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据初始化相关
    const [cleanRuleCode, setCleanRuleCode] = useState(isBlankStr(props.cleanRuleCode4Edit) ? '' : props.cleanRuleCode4Edit);
    const [cleanRuleName, setCleanRuleName] = useState('');
    const [permitRemind, setPermitRemind] = useState(0);
    const [permitBatch, setPermitBatch] = useState(0);
    const [exceptToppingCodeList, setExceptToppingCodeList] = useState([]);
    const [cleanRuleStepList, setCleanRuleStepList] = useState(new Array(10));
    const [toppingList4Select, setToppingList4Select] = useState([]);
    const fetchToppingList4Select = () => {
        let url = genGetUrlByParams('/drinkset/topping/list', {
            tenantCode: 'tenant_001'
        });
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setToppingList4Select((prev => {
                    let toppingList4SelectTmp = [];
                    response.data.model.forEach(item => {
                        let toppingTmp = {...item};
                        toppingTmp.key = item.toppingCode;
                        toppingTmp.label = item.toppingName;
                        toppingTmp.value = item.toppingCode;
                        toppingList4SelectTmp.push(toppingTmp);
                    })
                    return toppingList4SelectTmp;
                }));
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
    useEffect(() => {
        fetchToppingList4Select();
    }, []);
    const fetchCleanRule = () => {
        if (isBlankStr(props.cleanRuleCode4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/ruleset/clean/{segment}/{segment}/get', ['tenant_001', props.cleanRuleCode4Edit]);
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setCleanRuleCode(response.data.model.cleanRuleCode);
                setCleanRuleName(response.data.model.cleanRuleName);
                setPermitRemind(response.data.model.permitRemind);
                setPermitBatch(response.data.model.permitBatch);
                setExceptToppingCodeList(response.data.model.exceptToppingCodeList);
                if (isArray(response.data.model.cleanRuleStepList)) {
                    setCleanRuleStepList(prev => {
                        return response.data.model.cleanRuleStepList;
                    });
                    setCleanRuleStepPaneList(prev => {
                        let tmp = new Array(10);
                        response.data.model.cleanRuleStepList.forEach(cleanRuleStep => {
                            tmp.push({
                                label: '步骤'+ (cleanRuleStep.stepIndex + 1),
                                children: <CleanRuleStepTabPane 
                                        cleanRuleStep={cleanRuleStep} 
                                        stepIndex={cleanRuleStep.stepIndex} 
                                        updateCleanRuleStep={updateCleanRuleStep}/>,
                                key: cleanRuleStep.stepIndex
                            });
                        });
                        return tmp;
                    });
                    setStepIndex(response.data.model.cleanRuleStepList.length == 0 ? 0 : (response.data.model.cleanRuleStepList.length - 1));
                }
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
    useEffect(() => {
        fetchCleanRule();
    }, [props.cleanRuleCode4Edit]);


    // 输入相关
    const updateCleanRuleStep = (stepIndex, cleanRuleStep) => {
        setCleanRuleStepList(prev => {
            let tmp = [...prev];
            tmp[stepIndex] = {...cleanRuleStep};
            return tmp;
        });
    };
    const removeCleanRuleStep = (stepIndex) => {
        setCleanRuleStepList(prev => {
            let tmp = [...prev];
            tmp[stepIndex] = undefined;
            return tmp;
        });
    };

    // 步骤相关
    const [stepIndex, setStepIndex] = useState(0);
    const [activeKey, setActiveKey] = useState(stepIndex);
    const [cleanRuleStepPaneList, setCleanRuleStepPaneList] = useState([{
        label: '步骤' + (stepIndex + 1),
        children: <CleanRuleStepTabPane cleanRuleStep={cleanRuleStepList[0]} stepIndex={0} updateCleanRuleStep={updateCleanRuleStep}/>,
        key: stepIndex
    }]);
    const add = () => {
        const newActiveKey = stepIndex + 1;
        setCleanRuleStepPaneList(prev => {
            const tmp = [...prev];
            tmp.push({
                label: '步骤'+ (newActiveKey + 1),
                children: <CleanRuleStepTabPane cleanRuleStepList={cleanRuleStepList[newActiveKey]} stepIndex={newActiveKey} updateCleanRuleStep={updateCleanRuleStep}/>,
                key: newActiveKey,
            });
            return tmp;
        });
        setActiveKey(newActiveKey);
        setStepIndex(newActiveKey);
    };
    const remove = (targetKey) => {
        alert('$$$$$ remove targetKey=' + targetKey + ', stepIndex=' + stepIndex);
        if (targetKey == 0) {
            alert("请保留至少一个步骤");
            return;
        }
        if (targetKey != stepIndex) {
            alert("请从最后一个步骤开始删除");
            return;
        }

        let newActiveKey = activeKey;
        let lastIndex = -1;
        cleanRuleStepPaneList.forEach((item, i) => {
            if (item.key === targetKey) {
                lastIndex = i - 1;
            }
        });
    
        const newCleanStepPaneList = cleanRuleStepPaneList.filter((item) => item.key !== targetKey);
        if (newCleanStepPaneList.length && newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = newCleanStepPaneList[lastIndex].key;
            } else {
                newActiveKey = newCleanStepPaneList[0].key;
            }
        }
        setCleanRuleStepPaneList(newCleanStepPaneList);
        setActiveKey(newActiveKey);
        removeCleanRuleStep(stepIndex);
        setStepIndex(stepIndex - 1);
    };
    const onEditCleanStepList = (targetKey, action) => {
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
            onOk={onClickOK}
            onCancel={onClickCancel}
            width={850}
            footer={[
                <Button key="back" onClick={onClickCancel}>取消</Button>,
                <Button key="submit" type="primary" loading={loading} onClick={onClickOK}>提交</Button>
            ]}
        >
            <div className="flex-col-cont" style={{height: 450, width: '100%'}}>
                <div className="flex-row-cont" style={{height: '9%', width: '100%'}}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', width: '15%'}}>规则编号：</div>
                    <div style={{width: '35%'}}>
                        <Input placeholder="规则编号" onChange={(e) => setCleanRuleCode(e.target.value)} value={cleanRuleCode} style={{width: '100%'}}/>
                    </div>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', width: '15%'}}>规则名称：</div>
                    <div style={{width: '35%'}}>
                        <Input placeholder="规则名称" onChange={(e) => setCleanRuleName(e.target.value)} value={cleanRuleName}/>
                    </div>
                </div>
                <div className="flex-row-cont" style={{height: '9%', width: '100%'}}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', width: '15%'}}>提前提醒：</div>
                    <div style={{width: '35%'}}>
                        <Switch checkedChildren="支持" unCheckedChildren="不支持" checked={permitRemind === 1 ? true : false} size="middle" onChange={(e) => setPermitRemind(e ? 1 : 0)}/>
                    </div>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', width: '15%'}}>分批清洗：</div>
                    <div style={{width: '35%'}}>
                        <Switch checkedChildren="支持" unCheckedChildren="不支持" checked={permitBatch === 1 ? true : false} size="middle" onChange={(e) => setPermitBatch(e ? 1 : 0)}/>
                    </div>
                </div>
                <div className="flex-row-cont" style={{height: '9%', width: '100%'}}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', width: '15%'}}>不清洗的物料：</div>
                    <div style={{width: '85%'}}>
                        <Select
                            placeholder="请选择"
                            mode="multiple"
                            onChange={(e) => setExceptToppingCodeList(e)}
                            options={toppingList4Select}
                            size="middle"
                            style={{width: '100%'}}
                            value={exceptToppingCodeList}
                        />
                    </div>
                </div>
                <div className="flex-row-cont" style={{height: '3%', width: '100%'}}>
                    &nbsp;
                </div>
                <div style={{height: '70%', width: '100%'}}>
                    <Tabs type="editable-card" 
                        onChange={(e) => setActiveKey(e)} 
                        activeKey={activeKey} 
                        onEdit={onEditCleanStepList} 
                        items={cleanRuleStepPaneList} 
                        style={{height: 450, width: '100%'}} />
                </div>
            </div>
        </Modal>
    );
};
 
export default CleanRuleNewModal;