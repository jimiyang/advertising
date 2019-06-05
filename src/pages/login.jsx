import React, {Component} from 'react';
import {Input, Button} from 'antd';
import router from 'umi/router';
class Login extends Component {
  login = () => {
    window.localStorage.setItem('checkLogin', '1000');
    //router.push('/enter');
    router.push('/main');
  }
  regEvent = () => {
    router.push('/register');
  }
  render() {
    return(
      <div className="login-blocks">
        <h1 className="g-tc">联拓推</h1>
        <ul>
          <li><label>用户名：</label><Input  placeholder="请输入登录名"/></li>
          <li><label>密码：</label><Input  type="password" placeholder="请输入密码"/></li>
        </ul>
        <div className="g-tc">
          <Button type="primary" onClick={this.login.bind(this)} className="ml10">登录</Button>
          <Button onClick={this.regEvent.bind(this)} className="ml10">注册</Button>
        </div>
      </div>
    );
  }
}
export default Login;