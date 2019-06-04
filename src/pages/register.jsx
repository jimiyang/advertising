import React, {Component} from 'react';
import {Form, Input, Icon, Tooltip, Button} from 'antd';
import Link from 'umi/link';
class Register extends Component{
  RegisterEvent = () => {
    console.log(11);
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    return(
      <div className="login-form">
        <div className="header">
          <div className="nav">
            <img src={require('../assets/logo.png')} />
            <div className="nav-reg">
              <Link to="/">登录</Link>
              <Link to="/register" className="active">注册</Link>
            </div>
          </div>  
        </div>
        <div className="register-blocks">
          <Form onSubmit={this.RegisterEvent} className="form" name="form" id="form">
            <Form.Item>
              <Input className="ipttxt ipt-ico-1" placeholder="流量主名称" />
            </Form.Item>
            <Form.Item>
              <Input className="ipttxt ipt-ico-2" placeholder="联系人" />
            </Form.Item>
            <Form.Item>
              <Input className="ipttxt ipt-ico-3" placeholder="联系人电话" />
            </Form.Item>
            <Form.Item>
              <Input className="ipttxt ipt-ico-4" placeholder="登录名" />
            </Form.Item>
            <Form.Item>
              <Input className="ipttxt ipt-ico-5" placeholder="密码" />
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