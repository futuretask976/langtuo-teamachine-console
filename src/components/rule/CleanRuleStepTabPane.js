import React, { useEffect, useState } from 'react';
import { Input, InputNumber, Radio, Select, Switch } from 'antd';

import '../../css/common.css';
import { isBlankObj } from '../../js/common.js';

const { TextArea } = Input;

const CleanRuleStepTabPane = (props) => {
    // 数据定义
    const [cleanRuleStep, setCleanRuleStep] = useState({
        stepIndex: props.stepIndex,
        cleanContent: 0, 
        washSec: 0,
        soakMin: 0,
        flushIntervalMin: 0,
        flushSec: 0
    });
    useEffect(() => {
        if (!isBlankObj(props.cleanRuleStep)) {
            setCleanRuleStep(props.cleanRuleStep);
        }
    }, [props.cleanRuleStep]);

    // 动作定义
    const getCleanContent = () => {
        if (isBlankObj(cleanRuleStep)) {
            return 0;
        }
        if (isBlankObj(cleanRuleStep.cleanContent)) {
            return 0;
        }
        return cleanRuleStep.cleanContent;
    }
    const getNeedConfirm = () => {
        if (isBlankObj(cleanRuleStep)) {
            return false;
        }
        if (isBlankObj(cleanRuleStep.needConfirm)) {
            return false;
        }
        return cleanRuleStep.needConfirm == 0 ? false : true;
    }
    const getWashTime = () => {
        if (isBlankObj(cleanRuleStep)) {
            return 0;
        }
        if (isBlankObj(cleanRuleStep.washSec)) {
            return 0;
        }
        return cleanRuleStep.washSec;
    }
    const getSoakTime = () => {
        if (isBlankObj(cleanRuleStep)) {
            return 0;
        }
        if (isBlankObj(cleanRuleStep.washSec)) {
            return 0;
        }
        return cleanRuleStep.washSec;
    }
    const getSoakWashInterval = () => {
        if (isBlankObj(cleanRuleStep)) {
            return 0;
        }
        if (isBlankObj(cleanRuleStep.flushIntervalMin)) {
            return 0;
        }
        return cleanRuleStep.flushIntervalMin;
    }
    const getSoakWashTime = () => {
        if (isBlankObj(cleanRuleStep)) {
            return 0;
        }
        if (isBlankObj(cleanRuleStep.flushSec)) {
            return 0;
        }
        return cleanRuleStep.flushSec;
    }
    const getRemindTitle = () => {
        if (isBlankObj(cleanRuleStep)) {
            return '';
        }
        if (isBlankObj(cleanRuleStep.remindTitle)) {
            return '';
        }
        return cleanRuleStep.remindTitle;
    }
    const getRemindContent = () => {
        if (isBlankObj(cleanRuleStep)) {
            return '';
        }
        if (isBlankObj(cleanRuleStep.remindContent)) {
            return '';
        }
        return cleanRuleStep.remindContent;
    }
    const getCleanAgentType = () => {
        if (isBlankObj(cleanRuleStep)) {
            return 0;
        }
        if (isBlankObj(cleanRuleStep.cleanAgentType)) {
            return 0;
        }
        return cleanRuleStep.cleanAgentType;
    }

    // 初始化定义
    const onChangeCleanContent = (e) => {
        setCleanRuleStep(prev => {
            let tmp = {...prev};
            tmp.cleanContent = e.target.value;
            return tmp;
        });
    };
    const onChangeWashTime = (e) => {
        setCleanRuleStep(prev => {
            let tmp = {...prev};
            tmp.washSec = e;
            return tmp;
        });
    };
    const onChangeSoakTime = (e) => {
        setCleanRuleStep(prev => {
            let tmp = {...prev};
            tmp.washSec = e;
            return tmp;
        });
    };
    const onChangeSoakWashInterval = (e) => {
        setCleanRuleStep(prev => {
            let tmp = {...prev};
            tmp.flushIntervalMin = e;
            return tmp;
        });
    };
    const onChangeSoakWashTime = (e) => {
        setCleanRuleStep(prev => {
            let tmp = {...prev};
            tmp.flushSec = e;
            return tmp;
        });
    };
    const onChangeRemindTitle = (e) => {
        setCleanRuleStep(prev => {
            let tmp = {...prev};
            tmp.remindTitle = e.target.value;
            return tmp;
        });
    };
    const onChangeRemindContent = (e) => {
        setCleanRuleStep(prev => {
            let tmp = {...prev};
            tmp.remindContent = e.target.value;
            return tmp;
        });
    };
    const onChangeNeedConfirm = (e) => {
        setCleanRuleStep(prev => {
            let tmp = {...prev};
            tmp.needConfirm = e ? 1 : 0;
            return tmp;
        });
    };
    const onChangeCleanAgentType = (e) => {
        setCleanRuleStep(prev => {
            let tmp = {...prev};
            tmp.cleanAgentType = e;
            return tmp;
        });
    };
    useEffect(() => {
        props.updateCleanRuleStep(cleanRuleStep);
    }, [cleanRuleStep]);
 
    return (
        <div className="flex-col-cont" style={{height: '100%', width: '100%'}}>
            <div className="flex-row-cont" style={{height: 40, width: '100%'}}>
                <div className="flex-row-cont" style={{justifyContent: 'flex-end', width: '15%'}}>清洗方式：</div>
                <div style={{justifyContent: 'flex-start', width: '20%'}}>
                    <Radio.Group onChange={onChangeCleanContent} value={getCleanContent()}>
                        <Radio value={0}>冲洗</Radio>
                        <Radio value={1}>浸泡</Radio>
                    </Radio.Group>
                </div>
                <div className="flex-row-cont" style={{justifyContent: 'flex-end', width: '15%'}}>是否再次确认：</div>
                <div className="flex-row-cont" style={{justifyContent: 'flex-start', width: '10%'}}>
                    <Switch checkedChildren="支持" unCheckedChildren="不支持" checked={getNeedConfirm()} size="middle" onChange={onChangeNeedConfirm}/>
                </div>
                <div className="flex-row-cont" style={{justifyContent: 'flex-end', width: '15%'}}>清洗剂：</div>
                <div className="flex-row-cont" style={{width: '25%'}}>
                    <Select
                        onChange={onChangeCleanAgentType}
                        options={[
                            {
                                label: '清水',
                                value: 0
                            },
                            {
                                label: '消毒水',
                                value: 1
                            },
                            {
                                label: '饮用水',
                                value: 2
                            }
                        ]}
                        value={getCleanAgentType()}
                        style={{width: '100%'}}
                    />
                </div>
            </div>
            {getCleanContent() == 0 && 
                <div className="flex-row-cont" style={{height: 40, width: '100%'}}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', width: '15%'}}>冲洗时间：</div>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start', width: '85%'}}>
                        <InputNumber min={0} max={9999} onChange={onChangeWashTime} value={getWashTime()}/>&nbsp;分钟
                    </div>
                </div>
            }
            {getCleanContent() == 1 && 
                <div className="flex-row-cont" style={{height: 40, width: '100%'}}>
                    <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'flex-end', width: '15%'}}>浸泡时间：</div>
                    <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'flex-start', width: '85%'}}>
                        <InputNumber min={0} max={9999} defaultValue={0} onChange={onChangeSoakTime} value={getSoakTime()}/>&nbsp;分钟 设备每隔&nbsp;<InputNumber min={0} max={99} onChange={onChangeSoakWashInterval} value={getSoakWashInterval()}/>&nbsp;分钟 冲洗&nbsp;<InputNumber min={0} max={99} defaultValue={0} onChange={onChangeSoakWashTime} value={getSoakWashTime()}/>&nbsp;秒
                    </div>
                </div>
            }
            <div className="flex-row-cont" style={{height: 40, width: '100%'}}>
                <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'flex-end', height: '100%', width: '15%'}}>清洗提示标题：</div>
                <div className="flex-row-cont" style={{alignItems: 'center', height: '100%', width: '85%'}}>
                    <Input placeholder="清洗提示标题" onChange={onChangeRemindTitle} value={getRemindTitle()}/>
                </div>
            </div>
            <div className="flex-row-cont" style={{height: 65, width: '100%'}}>
                <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'flex-end', height: '100%', width: '15%'}}>清洗提示内容：</div>
                <div className="flex-row-cont" style={{alignItems: 'center', height: '100%', width: '85%'}}>
                    <TextArea rows={2} placeholder="清洗提示内容" maxLength={200} onChange={onChangeRemindContent} value={getRemindContent()}/>
                </div>
            </div>
        </div>
    );
};
 
export default CleanRuleStepTabPane;