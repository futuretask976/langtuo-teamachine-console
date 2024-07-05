import React, { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, Flex, Input, Layout, Modal, Radio, Select, Space, Steps, Switch, Table, Tabs, Col, Row, message, theme } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../css/common.css';
import { isBlankStr, genGetUrlBySegs, genPostUrl } from '../js/common.js';

const ToppingNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl('/drinkset/topping/put');
        axios.put(url, {
            withCredentials: true, // 这会让axios在请求中携带cookies
            toppingCode: toppingCode,
            toppingName: toppingName,
            toppingTypeCode: toppingTypeCode,
            measureUnit: measureUnit,
            state: state,
            validHourPeriod: validHourPeriod,
            cleanHourPeriod: cleanHourPeriod,
            convertCoefficient: convertCoefficient,
            flowSpeed: flowSpeed,
            comment: comment,
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

    // 数据初始化相关
    const [toppingCode, setToppingCode] = useState(isBlankStr(props.toppingCode4Edit) ? '' : props.toppingCode4Edit);
    const [toppingName, setToppingName] = useState('');
    const [toppingTypeCode, setToppingTypeCode] = useState('');
    const [measureUnit, setMeasureUnit] = useState(0);
    const [state, setState] = useState(1);
    const [validHourPeriod, setValidHourPeriod] = useState(0);
    const [cleanHourPeriod, setCleanHourPeriod] = useState(0);
    const [convertCoefficient, setConvertCoefficient] = useState(0.0);
    const [flowSpeed, setFlowSpeed] = useState(1);
    const [comment, setComment] = useState('');
    useEffect(() => {
        if (isBlankStr(props.toppingTypeCode4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/drinkset/topping/type/{segment}/{segment}/get', ['tenant_001', props.toppingTypeCode4Edit]);
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setToppingTypeCode(response.data.model.toppingTypeCode);
                setToppingTypeName(response.data.model.toppingTypeName);
                setState(response.data.model.state);
                setComment(response.data.model.comment);
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
    }, [props.toppingTypeCode4Edit]);

    // 输入相关
    const onChangeToppingTypeCode = (e) => {
        setToppingTypeCode(e.target.value);
    }
    const onChangeToppingTypeName = (e) => {
        setToppingTypeName(e.target.value);
    }
    const onChangeState = (e) => {
        setState(e == true ? 1 : 0);
    }
    const onChangeComment = (e) => {
        setComment(e.target.value);
    }
 
    return (
        <Modal
            centered
            open={open}
            title="新建物料"
            onOk={handleOk}
            onCancel={handleCancel}
            width={1000}
            style={{border: '0px solid red'}}
            footer={[]}
        >
            <div style={{display: 'flex', alignItems: 'center', justifyItems: 'center', flexDirection: 'column', height: 450, width: '100%'}}>
                <Steps current={curStep} items={steps} />
                <div style={contentStyle}>
                    {curStep == 0 && (
                        <ToppingNewModalBasicInfoPane />
                    )}
                    {curStep == 1 && (
                        <ToppingNewModalActStepPane />
                    )}
                    {curStep == 2 && (
                        <ToppingNewModalCommonPane />
                    )}
                    {curStep == 3 && (
                        <ToppingNewModalSpecPane />
                    )}
                    {curStep == 4 && (
                        <ToppingNewModalSpecRulePane />
                    )}
                </div>
                <div style={{marginTop: 24}}>
                    {curStep > 0 && (
                        <Button style={{margin: '0 8px'}} onClick={() => prevStep()}>
                            上一步
                        </Button>
                    )}
                    {curStep < steps.length - 1 && (
                        <Button type="primary" onClick={() => nextStep()}>
                            下一步
                        </Button>
                    )}
                    {curStep === steps.length - 1 && (
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
    );
};
 
export default ToppingNewModal;