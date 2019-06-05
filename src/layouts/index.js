import styles from './index.css';
import React, {Component} from 'react';
import router from 'umi/router';
import {Layout} from 'antd';
import common from '../untils/common';
import Menu from  '../pages/menu'; //左侧菜单
import Header from '../pages/header'; //头部
import Main from '../pages/main'; //主页面
import Login from '../pages/login'; //登录页
import Register from '../pages/register'; //注册页
const {Sider, Content} = Layout;
window.common = common;
class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    }
  }
  componentWillMount() {
    //console.log(this.props.location.pathname);
  }
  handleClick = (pane) => {
    router.push(pane.url);
  }
  render() {
    return (
      <div className="section">
        { window.localStorage.getItem('checkLogin') === null  ? 
          <Login /> :
          <Layout>
            <Sider className="sider">
              <div className="logo">
                <img src={require('../assets/logo.png')} />
              </div>
              <Menu handleClick={this.handleClick.bind(this)}/>
            </Sider>
            <Layout>
              <Header />
              <Content className="content-blocks">
                {this.props.location.pathname === '/main' ? <Main /> : this.props.children}
              </Content>
            </Layout>
          </Layout>
        }
      </div>
    );
  }
}

export default BasicLayout;
