import React, {Component} from 'react';
import Link from 'umi/link';
class Enter extends Component {
  login = () => {
    //window.localStorage.setItem('checkLogin', '1000');
    //router.push('/');
  }
  render() {
    return(
      <div className="login-form">
        <div className="header">
          <div className="nav">
            <img src={require('../../assets/logo.png')} />
            <div className="nav-reg">
              <Link to="/">登录</Link>
              <Link to="/register" className="active">注册</Link>
            </div>
          </div>  
        </div>
        <ul className="type-blocks">
          <li>
            <h1>广告主</h1>
            <p>智能精准匹配，投放真实有效</p>
            <img src={require('../../assets/advert-ico.jpg')} />
            <a href="">发布广告</a>
          </li>
          <li>
            <h1>媒体主</h1>
            <p>广告丰富品相好，价格可观收入多</p>
            <img src={require('../../assets/media-ico.jpg')} style={{marginTop: '60px'}}/>
            <a href="">入住联拓推</a>
          </li>
        </ul>
      </div>
    );
  }
}
export default Enter;