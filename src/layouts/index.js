import styles from './index.css';
import React, {Component} from 'react';
import router from 'umi/router';
import {Layout} from 'antd';
import Menu from  '../pages/menu/menu';
import Main from '../pages/main/main';
import Redirect from 'umi/redirect';
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
    this.setState({
      redirect: true
    });
  }
  render() {
    if (this.state.redirect) return (<Redirect to="/login" />);
    return (
      <Layout>
        <Sider width={220} style={{minHeight: '100vh', color: 'white'}}>
            <Menu handleClick={this.handleClick}/>
        </Sider>
        <Layout>
          <Header style={{background: '#fff', textAlign: 'center', padding: 0}}>
          Header<span onClick={this.loginout.bind(this)} style={{color: '#f00'}}>退出</span>
          </Header>
          <Content style={{margin: '24px 16px 0'}}>
            <div style={{padding: 24, background: '#fff', minHeight: 360}}>
              {this.props.location.pathname === '/' ? <Main /> : this.props.children}
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default BasicLayout;
