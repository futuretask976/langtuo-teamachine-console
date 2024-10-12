import React, { useEffect, useState } from 'react';
import { Button, Modal, Steps, theme } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { arraysEqual, getTenantCode, isBlankObj, isBlankStr, isEmptyArray, isValidCode, isValidComment, isValidName } from '../../js/common.js';
import { get, put } from '../../js/request.js';

import TeaNewModalInfoPane from '../../components/drink/TeaNewModalInfoPane'
import TeaNewModalActStepPane from '../../components/drink/TeaNewModalActStepPane'
import TeaNewModalBaseRulePane from '../../components/drink/TeaNewModalBaseRulePane'
import TeaNewModalSpecPane from '../../components/drink/TeaNewModalSpecPane'
import TeaNewModalAdjustRulePane from '../../components/drink/TeaNewModalAdjustRulePane'

const TeaNewModal = (props) => {
    // 样式定义
    const { token } = theme.useToken();
    const contentStyle = {
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        color: token.colorTextTertiary,
        height: '100%',
        width: '100%',
        marginTop: 5
    };

    // 数据定义
    const putNew = props.teaCode4Edit == undefined ? true : false;
    const [tea, setTea] = useState();

    // 对话框定义
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickSubmit = () => {
        if (!isValidCode(tea.teaCode, true)) {
            alert(applyLang('msgTeaCodeInvalid'));
            return;
        }
        if (!isValidName(tea.teaName, true)) {
            alert(applyLang('msgTeaNameInvalid'));
            return;
        }
        if (!isValidCode(tea.outerTeaCode, true)) {
            alert('外部茶品编码不符合规则' + tea.outerTeaCode);
            return;
        }
        if (!isValidCode(tea.teaTypeCode, true)) {
            alert(applyLang('msgTeaTypeCodeInvalid'));
            return;
        }
        if (!isValidComment(tea.comment, false)) {
            alert(applyLang('msgCommentInvalid'));
            return;
        }
        if (isEmptyArray(tea.toppingBaseRuleList, true)) {
            alert('茶品操作步骤不符合规则');
            return;
        }
        if (isEmptyArray(tea.specItemRuleList, true)) {
            alert('茶品规格不符合规则');
            return;
        }
        if (isEmptyArray(tea.teaUnitList, true)) {
            alert('茶品单位不符合规则');
            return;
        }

        setLoading(true);
        put('/drinkset/tea/put', {
            tenantCode: getTenantCode(),
            comment: tea.comment,
            teaCode: tea.teaCode,
            teaName: tea.teaName,
            teaTypeCode: tea.teaTypeCode,
            outerTeaCode: tea.outerTeaCode,
            state: tea.state,
            imgLink: tea.imgLink,
            toppingBaseRuleList: tea.toppingBaseRuleList,
            specItemRuleList: tea.specItemRuleList,
            specRuleList: tea.specRuleList,
            teaUnitList: tea.teaUnitList,
            putNew: putNew
        }).then(respData => {
            if (respData.success) {
                alert(applyLang('msgPutSucceed'));
                setLoading(false);
                props.onClose(true);
                setOpen(false);
            } else {
                alert(applyLang('msgPutFailed') + respData.errorMsg);
                setLoading(false);
            }
        });
    };
    const onClickCancel = () => {
        props.onClose(false);
        setOpen(false);
    };

    // 步骤定义
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

    // 初始化定义
    const fetchTea4Edit = () => {
        if (isBlankStr(props.teaCode4Edit)) {
            setTea({});
            return;
        }

        get('/drinkset/tea/get', {
            tenantCode: getTenantCode(),
            teaCode: props.teaCode4Edit
        }).then(respData => {
            let model = respData.model;
            setTea(prev => {
                return {...model};
            });
        });
    }
    useEffect(() => {
        fetchTea4Edit();
    }, []);
    useEffect(() => {
        if (!isBlankObj(tea)) {
            setShowStepPane(true);
        }
    }, [tea]);

    // 输入定义
    const updateInfo = (teaCode, teaName, outerTeaCode, teaTypeCode, state, comment, imgLink) => {
        setTea(prev => {
            let tmp = {...prev};
            tmp.teaCode = teaCode;
            tmp.teaName = teaName;
            tmp.outerTeaCode = outerTeaCode;
            tmp.teaTypeCode = teaTypeCode;
            tmp.state = state;
            tmp.comment = comment;
            tmp.imgLink = imgLink;
            return tmp;
        });
    };
    const updateToppingBaseRuleList = (toppingBaseRuleList) => {
        if (!arraysEqual(toppingBaseRuleList, tea.toppingBaseRuleList)) {
            updateTeaUnitList(undefined);
        }
        setTea(prev => {
            let tmp = {...prev};
            tmp.toppingBaseRuleList = toppingBaseRuleList;
            return tmp;
        });
    };
    const updateSpecItemRuleList = (specItemRuleList) => {
        setTea(prev => {
            let tmp = {...prev};
            tmp.specItemRuleList = specItemRuleList;
            return tmp;
        });
    };
    const updateSpecRuleList = (specItemRuleList) => {
        setTea(prev => {
            let tmp = {...prev};
            tmp.specRuleList = specItemRuleList;
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
            footer={()=>{}}
            onCancel={onClickCancel}
            open={open}
            style={{border: '0px solid red'}}
            title="新建/编辑茶品"
            width={1000}
        >
            <div className='flex-row-cont' style={{flexDirection: 'column', height: 450, width: '100%'}}>
                <Steps current={curStep} items={steps} />
                <div style={contentStyle}>
                    {showStepPane && curStep == 0 && (
                        <TeaNewModalInfoPane putNew={putNew} tea4Edit={tea} updateInfo={updateInfo} />
                    )}
                    {showStepPane && curStep == 1 && (
                        <TeaNewModalActStepPane toppingBaseRuleList4Edit={tea.toppingBaseRuleList} updateToppingBaseRuleList={updateToppingBaseRuleList} />
                    )}
                    {showStepPane && curStep == 2 && (
                        <TeaNewModalBaseRulePane toppingBaseRuleList4Edit={tea.toppingBaseRuleList} updateToppingBaseRuleList={updateToppingBaseRuleList} />
                    )}
                    {showStepPane && curStep == 3 && (
                        <TeaNewModalSpecPane specRuleList4Edit={tea.specRuleList} specItemRuleList4Edit={tea.specItemRuleList} updateSpecRuleList={updateSpecRuleList} updateSpecItemRuleList={updateSpecItemRuleList} />
                    )}
                    {showStepPane && curStep == 4 && (
                        <TeaNewModalAdjustRulePane toppingBaseRuleList4Edit={tea.toppingBaseRuleList} specItemRuleList4Edit={tea.specItemRuleList} teaUnitList4Edit={tea.teaUnitList} updateTeaUnitList={updateTeaUnitList} />
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