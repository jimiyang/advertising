import React, {Component} from 'react';
import {Input, Button, message} from 'antd';
import router from 'umi/router';
import Link from 'umi/link';
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginName: 'topup20190520',
      password: '111qqq'
    }
  }
  login = () => {
    window.api('/base/login', this.state).then(rs => {
      if (rs.success === true) {
        message.success(rs.message);
        window.localStorage.setItem('login_info', rs.success);
        window.localStorage.setItem('login_name', this.state.loginName);
        router.push('/main');
      }
    }).catch(error => {
      message.error(error.message);
    });
  }
  ChangeFormEvent = (type, e) => {
    let text = '';
    if (e === undefined) return false;
    switch(typeof e) {
      case 'object':
        text = e.target.value;
        break;
      case 'string':
        text = e;
        break;
      default:
        text = e.target.value;
        break;
    }
    this.setState({[type]: text});
  }
  regEvent = () => {
    router.push('/register');
  }
  render() {
    const {
      loginName,
      password
    } = this.state;
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
        <div className="login-blocks">
          <h1><img src={require('../assets/logo2.png')} /></h1>
          <ul>
            <li><Input  placeholder="请输入登录名" onChange={this.ChangeFormEvent.bind(this, 'loginName')} value={loginName} /></li>
            <li><Input  type="password" placeholder="请输入密码" onChange={this.ChangeFormEvent.bind(this, 'password')}  value={password} /></li>
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
      </div>
    );
  }
}
export default Login;