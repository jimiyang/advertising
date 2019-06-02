import React, {Component} from 'react';
import {Button} from 'antd';
import router from 'umi/router';
class Login extends Component {
  login = () => {
    window.localStorage.setItem('checkLogin', '1000');
    router.push('/');
  }
  render() {
    return(
      <div style={{textAlign: 'center'}}>
        <Button type="primary" onClick={this.login}>登录</Button>
      </div>
    );
  }
}
export default Login;