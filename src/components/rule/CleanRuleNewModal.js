import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Select, Switch, Tabs } from 'antd';
import axios from 'axios';

import CleanRuleStepTabPane from './CleanRuleStepTabPane'

import '../../css/common.css';
import { isArray, isBlankStr, genGetUrlByParams, genGetUrlBySegs, genPostUrl, getRespErrorMsg, getRespModel, getJwtToken, getTenantCode, handleRespError, isRespSuccess, isBlankObj } from '../../js/common.js';

const CleanRuleNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl('/ruleset/clean/put');
        axios.put(url, {
            tenantCode: getTenantCode(),
            cleanRuleCode: cleanRuleCode,
            cleanRuleName: cleanRuleName,
            permitRemind: permitRemind,
            permitBatch: permitBatch,
            exceptToppingCodeList: exceptToppingCodeList,
            cleanRuleStepList: cleanRuleStepList
        }, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            if (isRespSuccess(response)) {
                alert("保存成功");
            } else {
                alert('保存失败：' + getRespErrorMsg(response));
            }
        })
        .catch(error => {
            handleRespError(error);
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

    // 基础数据初始化相关
    const [cleanRuleCode, setCleanRuleCode] = useState(isBlankStr(props.cleanRuleCode4Edit) ? '' : props.cleanRuleCode4Edit);
    const [cleanRuleName, setCleanRuleName] = useState('');
    const [permitRemind, setPermitRemind] = useState(0);
    const [permitBatch, setPermitBatch] = useState(0);
    const [exceptToppingCodeList, setExceptToppingCodeList] = useState([]);
    const [cleanRuleStepList, setCleanRuleStepList] = useState([]);
    const [toppingList4Select, setToppingList4Select] = useState([]);

    // 初始化动作相关
    const fetchToppingList4Select = () => {
        let url = genGetUrlByParams('/drinkset/topping/list', {
            tenantCode: getTenantCode()
        });
        axios.get(url, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setToppingList4Select((prev => {
            let toppingList4SelectTmp = [];
            model.forEach(item => {
                let toppingTmp = {...item};
                toppingTmp.key = item.toppingCode;
                toppingTmp.label = item.toppingName;
                toppingTmp.value = item.toppingCode;
                toppingList4SelectTmp.push(toppingTmp);
            })
            return toppingList4SelectTmp;
        }));
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    const fetchCleanRule4Edit = () => {
        if (isBlankStr(props.cleanRuleCode4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/ruleset/clean/{segment}/{segment}/get', [getTenantCode(), props.cleanRuleCode4Edit]);
        axios.get(url, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
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
                    model.cleanRuleStepList.forEach(cleanRuleStep => {
                        tmp.push({
                            label: '步骤'+ (cleanRuleStep.stepIndex),
                            children: <CleanRuleStepTabPane cleanRuleStep={cleanRuleStep} stepIndex={cleanRuleStep.stepIndex} updateCleanRuleStep={updateCleanRuleStep}/>,
                            key: cleanRuleStep.stepIndex
                        });
                    });
                    return tmp;
                });
                setStepIndex(model.cleanRuleStepList.length);
            }
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    useEffect(() => {
        fetchToppingList4Select();
    }, []);
    useEffect(() => {
        fetchCleanRule4Edit();
    }, [props.cleanRuleCode4Edit]);


    // 针对pane的hook相关
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

    // 步骤相关
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
            <div className="flex-col-cont" style={{height: 400, width: '100%'}}>
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