import styles from './index.css';
import React, {Component} from 'react';
import router from 'umi/router';
import {Layout, Icon} from 'antd';
import Menu from  '../pages/menu/menu';
import Main from '../pages/main/main';
import Login from '../login';
import Redirect from 'umi/redirect';
import Link from 'umi/link';
const {Header, Sider, Content} = Layout;
class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    }
  }
  componentWillMount() {
  }
  handleClick = (pane) => {
    console.log(this.props.location.pathname);
    router.push(pane.url);
  } 
  loginout = () => {
    window.localStorage.removeItem('checkLogin');
    router.push('/login');
  }
  render() {
    return (
      <div>
        { window.localStorage.getItem('checkLogin') === null  ? 
          <Login /> :
          <Layout>
            <Sider  width={220} style={{minHeight: '100vh', color: 'white'}}>
              <Menu handleClick={this.handleClick}/>
            </Sider>
            <Layout>
              <Header style={{background: '#fff', textAlign: 'center', padding: 0}}>
              Header<Icon
                      className={styles.trigger}
                      type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                      onClick={this.loginout}
                    />
              </Header>
              <Content style={{margin: '24px 16px 0'}}>
                <div style={{padding: 24, background: '#fff', minHeight: 360}}>
                  {this.props.location.pathname === '/' ? <Main /> : this.props.children}
                </div>
              </Content>
            </Layout>
          </Layout>
        }
      </div>
    );
  }
}

export default BasicLayout;
