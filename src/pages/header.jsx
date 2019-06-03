import React, {Component} from 'react';
import {Icon} from 'antd';
import router from 'umi/router';
class Header extends Component{
  loginout = () => {
    window.localStorage.removeItem('checkLogin');
    router.push('/login');
  }
  render() {
    return(
      <div className="header-blocks">
          Header<Icon
                  type='menu-unfold'
                  onClick={this.loginout}
                />
      </div>
    );
  }
};
export default Header;