import React, { useEffect, useState } from 'react';
import { Input, InputNumber, Radio, Select, Switch } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
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
        return cleanRuleStep.needConfirm === 0 ? false : true;
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
                <div className="flex-row-cont" style={{justifyContent: 'flex-end', width: '15%'}}>{applyLang('promptCleanContent')}</div>
                <div style={{justifyContent: 'flex-start', width: '20%'}}>
                    <Radio.Group onChange={onChangeCleanContent} value={getCleanContent()}>
                        <Radio value={0}>{applyLang('labelWash')}</Radio>
                        <Radio value={1}>{applyLang('labelSoak')}</Radio>
                    </Radio.Group>
                </div>
                <div className="flex-row-cont" style={{justifyContent: 'flex-end', width: '15%'}}>{applyLang('promptNeedConfirm')}</div>
                <div className="flex-row-cont" style={{justifyContent: 'flex-start', width: '10%'}}>
                    <Switch checkedChildren={applyLang('labelYes')} unCheckedChildren={applyLang('labelNo')} checked={getNeedConfirm()} size="middle" onChange={onChangeNeedConfirm}/>
                </div>
                <div className="flex-row-cont" style={{justifyContent: 'flex-end', width: '15%'}}>{applyLang('promptCleanAgent')}</div>
                <div className="flex-row-cont" style={{width: '25%'}}>
                    <Select
                        onChange={onChangeCleanAgentType}
                        options={[
                            {
                                label: applyLang('labelWater'),
                                value: 0
                            },
                            {
                                label: applyLang('labelSanitizer'),
                                value: 1
                            },
                            {
                                label: applyLang('labelDrinkingWater'),
                                value: 2
                            }
                        ]}
                        value={getCleanAgentType()}
                        style={{width: '100%'}}
                    />
                </div>
            </div>
            {getCleanContent() === 0 && 
                <div className="flex-row-cont" style={{height: 40, width: '100%'}}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', width: '15%'}}>{applyLang('promptWashDuration')}</div>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start', width: '85%'}}>
                        <InputNumber min={0} max={9999} onChange={onChangeWashTime} value={getWashTime()}/>&nbsp;{applyLang('labelMins')}
                    </div>
                </div>
            }
            {getCleanContent() === 1 && 
                <div className="flex-row-cont" style={{height: 40, width: '100%'}}>
                    <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'flex-end', width: '15%'}}>{applyLang('promptSoakDuration')}</div>
                    <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'flex-start', width: '85%'}}>
                        <InputNumber min={0} max={9999} defaultValue={0} onChange={onChangeSoakTime} value={getSoakTime()}/>&nbsp;{applyLang('labelMins')} {applyLang('labelEveryInterval')}&nbsp;<InputNumber min={0} max={99} onChange={onChangeSoakWashInterval} value={getSoakWashInterval()}/>&nbsp;{applyLang('labelMins')} {applyLang('labelFlush')}&nbsp;<InputNumber min={0} max={99} defaultValue={0} onChange={onChangeSoakWashTime} value={getSoakWashTime()}/>&nbsp;{applyLang('labelSecs')}
                    </div>
                </div>
            }
            <div className="flex-row-cont" style={{height: 40, width: '100%'}}>
                <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'flex-end', height: '100%', width: '15%'}}>{applyLang('promptRemindTitle')}</div>
                <div className="flex-row-cont" style={{alignItems: 'center', height: '100%', width: '85%'}}>
                    <Input placeholder={applyLang('labelRemindTitle')} onChange={onChangeRemindTitle} value={getRemindTitle()}/>
                </div>
            </div>
            <div className="flex-row-cont" style={{height: 65, width: '100%'}}>
                <div className="flex-row-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-end', height: '100%', width: '15%'}}>{applyLang('promptRemindContent')}</div>
                <div className="flex-row-cont" style={{alignItems: 'center', height: '100%', width: '85%'}}>
                    <TextArea rows={2} placeholder={applyLang('labelRemindContent')} maxLength={200} onChange={onChangeRemindContent} value={getRemindContent()}/>
                </div>
            </div>
        </div>
    );
};
 
export default CleanRuleStepTabPane;