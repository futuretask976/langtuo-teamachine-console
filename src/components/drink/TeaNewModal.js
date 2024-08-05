import React, { useEffect, useState } from 'react';
import { Button, Modal, Steps, theme } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { genGetUrlByParams, genGetUrlBySegs, genPostUrl, getRespModel, isBlankObj, isBlankStr, handleRespError, isRespSuccess, getJwtToken, getTenantCode } from '../../js/common.js';

import TeaNewModalInfoPane from '../../components/drink/TeaNewModalInfoPane'
import TeaNewModalActStepPane from '../../components/drink/TeaNewModalActStepPane'
import TeaNewModalBaseRulePane from '../../components/drink/TeaNewModalBaseRulePane'
import TeaNewModalSpecPane from '../../components/drink/TeaNewModalSpecPane'
import TeaNewModalAdjustRulePane from '../../components/drink/TeaNewModalAdjustRulePane'

const TeaNewModal = (props) => {
    // 样式相关
    const { token } = theme.useToken();
    const contentStyle = {
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        color: token.colorTextTertiary,
        height: '100%',
        width: '100%',
        marginTop: 5
    };

    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickSubmit = () => {
        setLoading(true);
        let url = genPostUrl('/drink/tea/put');
        axios.put(url, {
            tenantCode: getTenantCode(),
            teaCode: tea.teaCode,
            teaName: tea.teaName,
            outerTeaCode: tea.outerTeaCode,
            state: tea.state,
            teaTypeCode: tea.teaTypeCode,
            comment: tea.comment,
            teaUnitList: tea.teaUnitList
        }, {
            // withCredentials: true, // 这会让axios在请求中携带cookies
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            if (isRespSuccess(response)) {
                alert("here is success")
            } else {
                alert("here is wrong")
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

    // 步骤相关
    const [showStepPane, setShowStepPane] = useState(false);
    const [curStep, setCurStep] = useState(0);
    const onClickNextStep = () => {
        setCurStep(curStep + 1);
    };
    const onClickPrevStep = () => {
        setCurStep(curStep - 1);
    };
    const steps = [
        {
          title: '基础信息'
        },
        {
          title: '制作步骤'
        },
        {
          title: '物料配置'
        },
        {
          title: '添加规格'
        },
        {
          title: '规则设定'
        }
    ];

    // 变量初始化相关
    const [tea, setTea] = useState();

    // 赋值初始化相关
    useEffect(() => {
        if (isBlankStr(props.teaCode4Edit)) {
            setTea({});
            return;
        }

        let url = genGetUrlBySegs('/drinkset/tea/{segment}/{segment}/get', [getTenantCode(), props.teaCode4Edit]);
        axios.get(url, {
            // withCredentials: true, // 这会让axios在请求中携带cookies
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            let teaTmp = {...model};
            setTea(prev => {
                return teaTmp;
            });
        })
        .catch(error => {
            handleRespError(error);
        });
    }, [props.teaCode4Edit]);
    useEffect(() => {
        if (!isBlankObj(tea)) {
            setShowStepPane(true);
        }
    }, [tea]);

    // hook 相关
    const updateInfo = (teaCode, teaName, outerTeaCode, teaTypeCode, state, comment) => {
        setTea(prev => {
            let tmp = {...prev};
            tmp.teaCode = teaCode;
            tmp.teaName = teaName;
            tmp.outerTeaCode = outerTeaCode;
            tmp.teaTypeCode = teaTypeCode;
            tmp.state = state;
            tmp.comment = comment;
            return tmp;
        });
    };
    const updateActStepList = (actStepList) => {
        setTea(prev => {
            let tmp = {...prev};
            tmp.actStepList = actStepList;
            return tmp;
        });
    };
    const updateSpecRuleList = (specRuleList) => {
        setTea(prev => {
            let tmp = {...prev};
            tmp.specRuleList = specRuleList;
            return tmp;
        });
    };
    const updateTeaUnitList = (teaUnitList) => {
        setTea(prev => {
            let tmp = {...prev};
            tmp.teaUnitList = teaUnitList;
            return tmp;
        });
    };
 
    return (
        <Modal
            centered
            open={open}
            title="新建茶品"
            onCancel={onClickCancel}
            width={1000}
            style={{border: '0px solid red'}}
            footer={[]}
        >
            <div className='flex-row-cont' style={{flexDirection: 'column', height: 450, width: '100%'}}>
                <Steps current={curStep} items={steps} />
                <div style={contentStyle}>
                    {showStepPane && curStep == 0 && (
                        <TeaNewModalInfoPane tea4Edit={tea} updateInfo={updateInfo} />
                    )}
                    {showStepPane && curStep == 1 && (
                        <TeaNewModalActStepPane actStepList4Edit={tea.actStepList} updateActStepList={updateActStepList} />
                    )}
                    {showStepPane && curStep == 2 && (
                        <TeaNewModalBaseRulePane actStepList4Edit={tea.actStepList} updateActStepList={updateActStepList} />
                    )}
                    {showStepPane && curStep == 3 && (
                        <TeaNewModalSpecPane specRuleList4Edit={tea.specRuleList} updateSpecRuleList={updateSpecRuleList} />
                    )}
                    {showStepPane && curStep == 4 && (
                        <TeaNewModalAdjustRulePane specRuleList4Edit={tea.specRuleList} actStepList4Edit={tea.actStepList} teaUnitList4Edit={tea.teaUnitList} updateTeaUnitList={updateTeaUnitList} />
                    )}
                </div>
                <div style={{marginTop: 24}}>
                    {curStep > 0 && (
                        <Button style={{margin: '0 8px'}} onClick={() => onClickPrevStep()}>
                            上一步
                        </Button>
                    )}
                    {curStep < steps.length - 1 && (
                        <Button type="primary" onClick={() => onClickNextStep()}>
                            下一步
                        </Button>
                    )}
                    {curStep === steps.length - 1 && (
                        <Button type="primary" loading={loading} onClick={() => onClickSubmit()}>提交</Button>
                    )}
                    <Button key="back" onClick={onClickCancel} style={{margin: '0 8px'}}>取消</Button>
                </div>
            </div>
        </Modal>
    );
};
 
export default TeaNewModal;