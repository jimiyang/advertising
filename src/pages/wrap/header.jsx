import React, {Component} from 'react';
import {Button} from 'antd';
import router from 'umi/router';
class Header extends Component{
  constructor(props) {
    super(props);
    this.state = {
      loginInfo: {},
      type: ['天目管理员', '广告主', '流量主']
    }
  }
  componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
    if (!loginInfo) return false; 
    this.setState({loginInfo});
  }
  LoginOutEvent = () => {
    window.localStorage.removeItem('login_info');
    router.push('/');
  }
  render() {
    const {
      type,
      loginInfo
    } = this.state;
    return(
      <div className="header-blocks">
        <span className="identity-items orange-color">{type[loginInfo.data.merchantType]}</span>
        <div>
          <span className="username">用户名：{loginInfo.data.loginName}</span>
          <span className="blue-color" onClick={this.LoginOutEvent.bind(this)}>[退出]</span>
        </div>
      </div>
    );
  }
};
export default Header;