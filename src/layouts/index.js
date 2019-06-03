import styles from './index.css';
import React, {Component} from 'react';
import router from 'umi/router';
import {Layout} from 'antd';
import Menu from  '../pages/menu'; //左侧菜单
import Header from '../pages/header'; //头部
import Main from '../pages/main'; //主页面
import Login from '../login';
const {Sider, Content} = Layout;
class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    }
  }
  componentWillMount() {
    //router.push('/components/option1');
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
              <Menu handleClick={this.handleClick}/>
            </Sider>
            <Layout>
              <Header />
              <Content className="content-blocks">
                {this.props.location.pathname === '/' ? <Main /> : this.props.children}
              </Content>
            </Layout>
          </Layout>
        }
      </div>
    );
  }
}

export default BasicLayout;
