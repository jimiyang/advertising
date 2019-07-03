import React, {Component} from 'react';
import {Form, Input, Icon, message, Button} from 'antd';
import router from 'umi/router';
import Link from 'umi/link';
import Redirect from 'umi/redirect';
class Register extends Component{
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      form: {
        merchantName: '',
        contactName: '',
        mobile: '',
        loginName: '',
        password: '',
        type: 1
      }
    }
  }
  componentWillMount() {
    const form = Object.assign(this.state.form, {type: Number(this.props.location.state.type)});
    this.setState({form});
  }
  RegisterEvent = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const form = Object.assign(this.state.form, values);
        window.api.baseInstance('api/merchant/add', form).then(rs => {
          message.success(rs.message);
          router.push('/');
        });
      }
    });
  }
  resetEvent = () => {
    //window.history.go(-1);
    router.push('/');
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    const {
      form,
      redirect
    } = this.state;
    if (redirect) return (<Redirect to="/" />);
    return(
      <div className="login-form">
        <div className="header">
          <div className="nav">
            <img src={require('../assets/logo.png')} />
            <div className="nav-reg">
              <Link to="/">登录</Link>
              <Link to="/enter" className="active">注册</Link>
            </div>
          </div>  
        </div>
        <div className="register-blocks">
          <Form onSubmit={this.RegisterEvent} className="form" name="form" id="form">
            <Form.Item>
              {
                getFieldDecorator(
                  'merchantName',
                  {
                    initialValue: form.merchantName || '',
                    rules: [
                      {required: true, message: `${form.type === 1 ? '请输入广告主名称' : '请输入流量主名称'}`}
                    ]
                  }
                )(<Input
                    className="ipttxt"
                    placeholder={form.type === 1 ? '请输入广告主名称' : '请输入流量主名称'}
                    prefix={<Icon component={() => (
                      <img  src={require('../assets/ico-1.png')} />
                      )} />
                    }
                    allowClear={true}
                />)
              }
            </Form.Item>
            <Form.Item>
              {
                getFieldDecorator(
                  'contactName',
                  {
                    initialValue: form.contactName || '',
                    rules: [
                      {required: true, message: '请输入联系人姓名'}
                    ]
                  }
                )(<Input
                    className="ipttxt"
                    placeholder="联系人"
                    prefix={<Icon component={() => (
                      <img  src={require('../assets/ico-2.png')} />
                      )} />
                    }
                />)
              }
            </Form.Item>
            <Form.Item>
              {
                getFieldDecorator(
                  'mobile',
                  {
                    initialValue: form.mobile || '',
                    rules: [
                      {required: true, message: '请输入联系人电话'},
                      {pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/, message: '请输入正确的手机号'}
                    ]
                  }
                )(<Input
                    className="ipttxt"
                    placeholder="联系人电话"
                    prefix={<Icon component={() => (
                      <img  src={require('../assets/ico-3.png')} />
                    )} />
                  }
                />)
              }
            </Form.Item>
            <Form.Item>
              {
                getFieldDecorator(
                  'loginName',
                  {
                    initialValue: form.loginName || '',
                    rules: [
                      {required: true, message: '请输入登录名'}
                    ]
                  }
                )(<Input
                    className="ipttxt"
                    placeholder="登录名"
                    prefix={<Icon component={() => (
                      <img  src={require('../assets/ico-4.png')} />
                    )} />
                  }
                />)
              }
            </Form.Item>
            <Form.Item>
              {
                getFieldDecorator(
                  'password',
                  {
                    initialValue: form.password || '',
                    rules: [
                      {required: true, message: '请输入登录密码'},
                      {pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/, message: '密码格式包含数字、字母'}
                    ]
                  }
                )(<Input
                  type="password"
                  className="ipttxt"
                  placeholder="请输入登录密码"
                  prefix={<Icon component={() => (
                    <img  src={require('../assets/ico-5.png')} />
                    )} />
                  }
                />)
              }
            </Form.Item>
            <Form.Item>
              <div className="g-tc">
                <Button type="primary" className="btn-blue" htmlType="submit">注册</Button>
                <Button className="btn-white" onClick={this.resetEvent}>返回</Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}
//export default Register;
export default Form.create()(Register);