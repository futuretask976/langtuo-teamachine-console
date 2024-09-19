import React, { useEffect, useState } from 'react';
import { Input, Modal, Select, Space, Switch, Tabs } from 'antd';

import CleanRuleStepTabPane from './CleanRuleStepTabPane'

import '../../css/common.css';
import { getTenantCode, isArray, isBlankObj, isBlankStr, isValidCode, isValidName } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const CleanRuleNewModal = (props) => {
    // 对话框定义
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidCode(cleanRuleCode, true)) {
            alert('规则编码不符合规则');
            return;
        }
        if (!isValidName(cleanRuleName, true)) {
            alert('规则名称不符合规则');
            return;
        }

        setLoading(true);
        put('/ruleset/clean/put', {
            tenantCode: getTenantCode(),
            cleanRuleCode: cleanRuleCode,
            cleanRuleName: cleanRuleName,
            permitRemind: permitRemind,
            permitBatch: permitBatch,
            exceptToppingCodeList: exceptToppingCodeList,
            cleanRuleStepList: cleanRuleStepList,
            putNew: putNew
        }).then(respData => {
            if (respData.success) {
                alert("保存成功！");
            } else {
                alert('保存失败：' + respData.errorMsg);
            }
            setLoading(false);
            props.onClose();
            setOpen(false);
        });
    };
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据定义
    const [toppingList4Select, setToppingList4Select] = useState();
    const putNew = props.cleanRuleCode4Edit == undefined ? true : false;
    const [cleanRuleCode, setCleanRuleCode] = useState();
    const [cleanRuleName, setCleanRuleName] = useState();
    const [permitRemind, setPermitRemind] = useState(0);
    const [permitBatch, setPermitBatch] = useState(0);
    const [exceptToppingCodeList, setExceptToppingCodeList] = useState();
    const [cleanRuleStepList, setCleanRuleStepList] = useState([]);

    // 初始化定义
    const fetchToppingList4Select = () => {
        get('/drinkset/topping/list', {  
            tenantCode: getTenantCode()
        }).then(respData => {
            setToppingList4Select((prev => {
                let toppingList4SelectTmp = [];
                if (isArray(respData.model)) {
                    respData.model.forEach(item => {
                        let toppingTmp = {...item};
                        toppingTmp.key = item.toppingCode;
                        toppingTmp.label = item.toppingName;
                        toppingTmp.value = item.toppingCode;
                        toppingList4SelectTmp.push(toppingTmp);
                    });
                }
                return toppingList4SelectTmp;
            }));
        });
    }
    const fetchCleanRule4Edit = () => {
        if (isBlankStr(props.cleanRuleCode4Edit)) {
            return;
        }

        get('/ruleset/clean/get', {  
            tenantCode: getTenantCode(),
            cleanRuleCode: props.cleanRuleCode4Edit
        }).then(respData => {
            let model = respData.model;
            setCleanRuleCode(model.cleanRuleCode);
            setCleanRuleName(model.cleanRuleName);
            setPermitRemind(model.permitRemind);
            setPermitBatch(model.permitBatch);
            setExceptToppingCodeList(model.exceptToppingCodeList);
            if (isArray(model.cleanRuleStepList)) {
                setCleanRuleStepList(prev => {
                    return model.cleanRuleStepList;
                });
                setCleanRuleStepPaneList(prev => {
                    let tmp = [];
                    if (isArray(model.cleanRuleStepList)) {
                        model.cleanRuleStepList.forEach(cleanRuleStep => {
                            tmp.push({
                                label: '步骤'+ (cleanRuleStep.stepIndex),
                                children: <CleanRuleStepTabPane cleanRuleStep={cleanRuleStep} stepIndex={cleanRuleStep.stepIndex} updateCleanRuleStep={updateCleanRuleStep}/>,
                                key: cleanRuleStep.stepIndex
                            });
                        });
                    }
                    return tmp;
                });
                setStepIndex(model.cleanRuleStepList.length);
            }
        });
    }
    useEffect(() => {
        fetchToppingList4Select();
    }, []);
    useEffect(() => {
        fetchCleanRule4Edit();
    }, [props.cleanRuleCode4Edit]);


    // 输入定义
    const updateCleanRuleStep = (cleanRuleStep) => {
        if (isBlankObj(cleanRuleStep)) {
            return;
        }
        setCleanRuleStepList(prev => {
            let tmp = [...prev];
            tmp[cleanRuleStep.stepIndex - 1] = {...cleanRuleStep};
            return tmp;
        });
    };
    const addCleanRuleStep = () => {
        setCleanRuleStepList(prev => {
            let tmp = [];
            for (let i = 0; i < prev.length; i++) {
                tmp.push(prev[i]);
            }
            tmp.push(undefined);
            return tmp;
        });
    };
    const removeCleanRuleStep = () => {
        setCleanRuleStepList(prev => {
            let tmp = [];
            for (let i = 0; i < prev.length - 1; i++) {
                tmp.push(prev[i]);
            }
            return tmp;
        });
    };

    // 步骤定义
    // 步骤从1开始，不是0，和展示保持一致
    const [stepIndex, setStepIndex] = useState(1);
    const [activeKey, setActiveKey] = useState(1);
    const [cleanRuleStepPaneList, setCleanRuleStepPaneList] = useState([{
        label: '步骤：' + stepIndex,
        children: <CleanRuleStepTabPane cleanRuleStep={cleanRuleStepList[stepIndex - 1]} stepIndex={stepIndex} updateCleanRuleStep={updateCleanRuleStep}/>,
        // 用stepIndex当作key
        key: stepIndex
    }]);
    const add = () => {
        let newStepIndex = stepIndex + 1;
        // 先添加数据
        addCleanRuleStep();
        // 再添加视图
        setCleanRuleStepPaneList(prev => {
            const tmp = [...prev];
            tmp.push({
                label: '步骤：'+ newStepIndex,
                children: <CleanRuleStepTabPane cleanRuleStep={cleanRuleStepList[newStepIndex - 1]} stepIndex={newStepIndex} updateCleanRuleStep={updateCleanRuleStep}/>,
                key: newStepIndex,
            });
            return tmp;
        });
        // 更新指针
        setStepIndex(newStepIndex);
        setActiveKey(newStepIndex);
    };
    const remove = (targetKey) => {
        if (targetKey == 1) {
            alert("请保留至少一个步骤");
            return;
        }
        if (targetKey != stepIndex) {
            alert("请从最后一个步骤开始删除");
            return;
        }

        // 先删除视图
        setCleanRuleStepPaneList(prev => {
            let tmp = [];
            for (let i = 0; i < prev.length - 1; i++) {
                tmp.push(prev[i]);
            }
            return tmp;
        });
        // 再删除数据
        removeCleanRuleStep(stepIndex);
        // 更新指针
        setStepIndex(stepIndex - 1);
        if (activeKey == targetKey) {
            setActiveKey(stepIndex - 1);
        }
    };
    const onEditCleanStepList = (targetKey, act) => {
        if (act === 'add') {
            add();
        } else {
            remove(targetKey);
        }
    };
 
    return (
        <Modal
            centered
            confirmLoading={loading}
            open={open}
            onCancel={onClickCancel}
            onOk={onClickOK}
            title={props.modalTitle}
            width={850}
        >
            <div className="flex-col-cont" style={{height: 400, width: '100%'}}>
                <div className="flex-row-cont" style={{height: '9%', width: '100%'}}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', width: '15%'}}>
                        <Space size='small'><span style={{color: 'red'}}>*</span><span>规则编码：</span></Space>
                    </div>
                    <div style={{width: '35%'}}>
                        <Input placeholder="规则编号" onChange={(e) => setCleanRuleCode(e.target.value)} value={cleanRuleCode} style={{width: '100%'}}/>
                    </div>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', width: '15%'}}>
                        <Space size='small'><span style={{color: 'red'}}>*</span><span>规则名称：</span></Space>
                    </div>
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