import React, {Component} from 'react';
import Link from 'umi/link';
class ReLogin extends Component{
  render() {
    return(
      <div className="relogin-blocks">
        <img src={require('../assets/relogin-ico.jpg')} />
        <p>登录超时，请您重新<Link to="/" className="blue-color">登录</Link></p>
      </div>
    )
  }
};
export default ReLogin;