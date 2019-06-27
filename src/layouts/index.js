import styles from './index.css';
import React, {Component} from 'react';
import router from 'umi/router';
import {Layout} from 'antd';
import common from '../untils/common';
import Menu from  '../pages/wrap/menu'; //左侧菜单
import Header from '../pages/wrap/header'; //头部
import Main from '../pages/wrap/main'; //主页面
import Login from '../pages/login'; //登录页
import api from '../api/api';
const {Sider, Content} = Layout;
window.common = common; //公共方法
window.api = api; //公共接口方法
class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      id: '',
      type: null
    }
  }
  componentWillMount() {
    const query = this.props.location.query;
    if (query.type !== undefined) {
      let params = {
        data: {
          loginName: query.loginName,
        }
      };
      this.setState({type: query.type});
      window.localStorage.setItem('login_info', JSON.stringify(params));
    } else {
      //console.log(window.localStorage.getItem('login_info'));
    }
  }
  handleClick = (pane) => {
    router.push(pane.url);
  }
  render() {
    const {
      type
    } = this.state;
    return (
      <div className="section">
        { window.localStorage.getItem('login_info') === null  ? 
          <Login /> :
          <Layout>
            {
              type === 'fans' ? null
              :
              <Sider className="sider">
                <div className="logo">
                  <img src={require('../assets/logo.png')} />
                </div>
                <Menu handleClick={this.handleClick.bind(this)} id={this.state.id} />
              </Sider>
            }
            <Layout>
              {type === 'fans' ? null : <Header />}
              <Content className={(this.props.location.pathname === '/main/editor') ? null : "content-blocks"}>
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
