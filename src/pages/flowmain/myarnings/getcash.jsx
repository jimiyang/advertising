import React, {Component} from 'react';
import {Alert, Form, Input, Button} from 'antd';
import style from './style.less';
class GetCash extends Component{
  constructor(props) {
    super(props);
    this.state = {
      form: {

      }
    };
  }
  render () {
    const {getFieldDecorator} = this.props.form;
    const {
      form
    } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: {span: 2},
        sm: {span: 2},
      },
      wrapperCol: {
        xs: {span: 5},
        sm: {span: 10},
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 4,
          offset: 0,
        },
        sm: {
          span: 5,
          offset: 0,
        }
      },
    };
    return (
      <div className={style.arnings}>
        <h1 className="nav-title">我的收益 > 提现详情</h1>
        <div className={style.cashArea}>
          <div className={style.notice}>
            <Alert
              message="提现声明"
              description={<div><p>提现有手续费，请阅读提现说明。</p></div>}
              type="warning"
              closable
            />
          </div>
          <div className={style.applyInfo}>
            <Form {...formItemLayout} name="form" id="form" onSubmit={this.applyEvent}>
              <ul>
                <li>
                  <Form.Item label="提现金额" {...tailFormItemLayout}>
                    {
                      getFieldDecorator(
                        'orderAmt',
                        {
                          initialValue: form.unitPrice || '',
                          rules: [
                            {required: true, message: '请输入阅读单价'},
                          ]
                        }
                      )(<div><Input /></div>)
                    }
                  </Form.Item>
                </li>
                <li>
                  <Form.Item label="到账金额" {...tailFormItemLayout}>
                    {
                      (<div>8000000</div>)
                    }
                  </Form.Item>
                </li>
                <li>
                  <Form.Item label="银行卡号" {...tailFormItemLayout}>
                    {
                      getFieldDecorator(
                        'bankCardNo',
                        {
                          initialValue: form.unitPrice || '',
                          rules: [
                            {required: true, message: '请输入阅读单价'},
                          ]
                        }
                      )(<div><Input /></div>)
                    }
                  </Form.Item>
                </li>
                <li>
                  <Form.Item label="开户行" {...tailFormItemLayout}>
                    {
                      getFieldDecorator(
                        'bankName',
                        {
                          initialValue: form.unitPrice || '',
                          rules: [
                            {required: true, message: '请输入阅读单价'},
                          ]
                        }
                      )(<div><Input /></div>)
                    }
                  </Form.Item>
                </li>
                <li>
                  <Form.Item label="开户人" {...tailFormItemLayout}>
                    {
                      getFieldDecorator(
                        'bankCardOwnerName',
                        {
                          initialValue: form.unitPrice || '',
                          rules: [
                            {required: true, message: '请输入阅读单价'},
                          ]
                        }
                      )(<div><Input /></div>)
                    }
                  </Form.Item>
                </li>
                <li>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" className={style.btn}>确认</Button>
                  </Form.Item>
                </li>
              </ul>
            </Form>
            <div>dddfdas</div>
          </div>
        </div>
      </div>
    )
  }
}
export default Form.create()(GetCash);