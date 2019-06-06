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
        <h1><img src={require('../assets/logo2.png')} /></h1>
        <ul>
          <li><Input  placeholder="请输入登录名"/></li>
          <li><Input  type="password" placeholder="请输入密码"/></li>
          <li className="auth-code">
            <Input />
            <div className="auth-img">
              验证码
            </div>
          </li>
        </ul>
        <div className="g-tc">
          <Button type="primary" onClick={this.login.bind(this)} className="button">登录</Button>
        </div>
        <div className="bottom-blocks">
          <img src={require('../assets/logo-bg-1.png')} />
        </div>
      </div>
    );
  }
}
export default Login;