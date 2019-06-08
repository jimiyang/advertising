import React, {Component} from 'react';
import {Button} from 'antd';
import Link from 'umi/link';
class Header extends Component{
  //loginout = () => {
    //window.localStorage.removeItem('checkLogin');
    //router.push('/');
  //}
  changeRolesEvent = () => {
    this.props.changeRolesEvent();
  }
  render() {
    return(
      <div className="header-blocks">
        <Button type="primary" onClick={this.changeRolesEvent}>广告主</Button>
        <div>
          <label><img src={require('../../assets/user.jpg')} /></label>
          <span className="username">哈哈哈发货单煽风点火撒范德萨h复合大师范德萨</span>
          <Link to="/">[退出]</Link>
        </div>
      </div>
    );
  }
};
export default Header;