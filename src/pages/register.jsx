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
              <Input
                className="ipttxt"
                placeholder="流量主名称"
                prefix={<Icon component={() => (
                  <img  src={require('../assets/ico-1.png')} />
                  )} />
                }
                allowClear={true}
              />
            </Form.Item>
            <Form.Item>
              <Input
                className="ipttxt"
                placeholder="联系人"
                prefix={<Icon component={() => (
                  <img  src={require('../assets/ico-2.png')} />
                  )} />
                }
              />
            </Form.Item>
            <Form.Item>
              <Input
                className="ipttxt"
                placeholder="联系人电话"
                prefix={<Icon component={() => (
                  <img  src={require('../assets/ico-3.png')} />
                  )} />
                }
              />
            </Form.Item>
            <Form.Item>
              <Input
                className="ipttxt"
                placeholder="登录名"
                prefix={<Icon component={() => (
                  <img  src={require('../assets/ico-4.png')} />
                  )} />
                }
              />
            </Form.Item>
            <Form.Item>
              <Input
                className="ipttxt"
                placeholder="密码"
                prefix={<Icon component={() => (
                  <img  src={require('../assets/ico-5.png')} />
                  )} />
                }
              />
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