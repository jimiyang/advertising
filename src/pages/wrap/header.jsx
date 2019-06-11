import React, {Component} from 'react';
import {Button} from 'antd';
import router from 'umi/router';
class Header extends Component{
  changeRolesEvent = () => {
    this.props.changeRolesEvent();
  }
  LoginOutEvent = () => {
    window.localStorage.removeItem('login_info');
    window.localStorage.removeItem('login_name');
    router.push('/');
  }
  render() {
    return(
      <div className="header-blocks">
        <Button type="primary" onClick={this.changeRolesEvent}>广告主</Button>
        <div>
          <label><img src={require('../../assets/user.jpg')} /></label>
          <span className="username">{window.localStorage.getItem('login_name')}</span>
          <span className="blue-color" onClick={this.LoginOutEvent.bind(this)}>[退出]</span>
        </div>
      </div>
    );
  }
};
export default Header;