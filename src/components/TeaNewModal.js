import React, { useEffect, useState } from 'react';
import { Button, Modal, Steps, message, theme } from 'antd';
import axios from 'axios';

import '../css/common.css';
import { isBlankStr, genGetUrlBySegs, genPostUrl } from '../js/common.js';

import TeaNewModalInfoPane from '../components/TeaNewModalInfoPane'
import TeaNewModalActStepPane from '../components/TeaNewModalActStepPane'
import TeaNewModalAmtPane from '../components/TeaNewModalAmtPane'
import TeaNewModalSpecPane from '../components/TeaNewModalSpecPane'
import TeaNewModalSpecRulePane from '../components/TeaNewModalSpecRulePane'

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
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl('/drinkset/tea/put');
        axios.put(url, {
            withCredentials: true, // 这会让axios在请求中携带cookies
            tenantCode: 'tenant_001',
            extraInfo: {
                testA: 'valueA',
                testB: 'valueB'
            },
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

    // 步骤相关
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
    const [tea, setTea] = useState({});

    // 赋值初始化相关
    useEffect(() => {
        if (isBlankStr(props.teaCode4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/drinkset/topping/type/{segment}/{segment}/get', ['tenant_001', props.teaCode4Edit]);
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setTea(response.data.model);
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
    }, [props.teaCode4Edit]);

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
                    {curStep == 0 && (
                        <TeaNewModalInfoPane teaCode4Edit={tea.teaCode} teaName4Edit={tea.teaName} outerTeaCode4Edit={tea.outerTeaCode} teaTypeCode4Edit={tea.teaTypeCode} state4Edit={tea.state} comment4Edit={tea.comment} updateInfo={updateInfo} />
                    )}
                    {curStep == 1 && (
                        <TeaNewModalActStepPane actStepList={tea.actStepList} updateActStepList={updateActStepList} />
                    )}
                    {curStep == 2 && (
                        <TeaNewModalAmtPane actStepList={tea.actStepList} updateActStepList={updateActStepList} />
                    )}
                    {curStep == 3 && (
                        <TeaNewModalSpecPane tea4Edit={tea} setTea={setTea} />
                    )}
                    {curStep == 4 && (
                        <TeaNewModalSpecRulePane tea4Edit={tea} setTea={setTea} />
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
                        <Button type="primary" loading={loading} onClick={() => message.success('操作完成！')}>提交</Button>
                    )}
                    <Button key="back" onClick={onClickCancel} style={{margin: '0 8px'}}>取消</Button>
                </div>
            </div>
        </Modal>
    );
};
 
export default TeaNewModal;