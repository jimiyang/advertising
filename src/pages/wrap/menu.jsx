import React, {Component} from 'react';
import {Menu, Icon} from 'antd';
const SubMenu = Menu.SubMenu;
class MenuApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
          defaultMenuData: [
            {
              id: 1,
              name: '首页',
              url: '/main',
              ico: 'home',
              children: []
            }
          ],
          advertMenuData: [
            {
              id: 2,
              name: '我要推广',
              ico: 'fund',
              children: [
                {id: 20, name: '新建推广活动', url: '/main/createactivity'},
                {id: 21, name: '我的推广活动', url: '/main/myactivity'},
                {id: 22, name: '素材库', url: '/main/materiallist'}
              ]
            },
            {
              id: 3,
              name: '已接单的任务',
              ico: 'notification',
              children: [
                {id: 30, name: '已接单任务', url: '/main/havedtask'}
              ]
            },
            {
              id: 4,
              name: '我的财务支出',
              ico: 'money-collect',
              children: [
                {id: 40, name: '财务支出记录', url: '/main/depositlist'}
              ]
            }
          ],
          flowofMainMenu: [
            {
              id: 5,
              name: '接单赚钱',
              ico: 'property-safety',
              children: [
                //{id: 50, name: '我授权的公众号', url: '/main/pubaccount'},
                {id: 51, name: '可接任务', url: '/main/myorder'},
                {id: 52, name: '已接任务', url: '/main/adtask'}
              ]    
            },
            {
              id: 40,
              name: '我的收益',
              ico: 'red-envelope',
              children: [
                {id: 401, name: '结算记录', url: '/main/arningslist'}
              ]
            }
          ],
          administoraData: [
            {
              id: 6,
              name: '员工管理',
              ico: 'contacts',
              url: '/main/employesslist',
              children: []    
            },
            {
              id: 7,
              name: '广告主管理',
              ico: 'container',
              url: '/main/adlist',
              children: []    
            },
            {
              id: 8,
              name: '流量主管理',
              ico: 'area-chart',
              url: '/main/flowlist',
              children: []    
            },
            {
              id: 9,
              name: '提现管理',
              ico: 'money-collect',
              url: '/main/cashlist',
              children: []    
            },
            {
              id: 10,
              name: '转账充值审核',
              ico: 'security-scan',
              url: '/main/transferlist',
              children: []    
            },
            {
              id: 11,
              name: '信息管理 ',
              ico: 'info-circle',
              children: [
                {id: 111, name: '活动管理', url: '/main/activitylist'},
                {id: 112, name: '任务管理', url: '/main/tasklist'} 
              ]    
            },
            {
              id: 13,
              name: '活动结算审核',
              ico: 'strikethrough',
              url: '/main/activitysettlement',
              children: []
            },
            {
              id: 12,
              name: '消息发布 ',
              ico: 'message',
              url: '/main/msglist',
              children: []    
            }
          ]
        };
    }
    componentWillMount() {
      const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
      if (window.localStorage.getItem('login_info') === null) return false;
      let data = [];
      switch(loginInfo.data.merchantType) {
        case 0:
          data = this.state.administoraData;
          break;
        case 1:
          data = this.state.advertMenuData;
          break;
        case 2: 
          data = this.state.flowofMainMenu;
          break;
        default:
          data = this.state.advertMenuData;
          break;
      }
      data = this.state.defaultMenuData.concat(data);
      this.setState({defaultmenusData: data});
    }
    handleClick(pane){
      this.props.handleClick(pane);
    }
    render() {
      const {
        defaultmenusData
      } = this.state;
      return (
        <div className="menu-blocks">
          <Menu
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['8']}
            mode="inline"
            theme="dark"
          >
          {
            defaultmenusData.map((item, index) => (
              (item.children.length === 0) ?
              <Menu.Item key={item.id} onClick={() => this.handleClick(item)}>
                <Icon type={item.ico} theme="filled" />
                <span>{item.name}</span>
              </Menu.Item>
              :
              <SubMenu key={item.id} title={<span><Icon type={item.ico} theme="filled" /><span>{item.name}</span></span>}>
                {
                  item.children.map((children) => (
                    <Menu.Item  key={children.id} onClick={() => this.handleClick(children)}>
                      {children.name}
                    </Menu.Item>
                  ))
                }
              </SubMenu>
            ))
          }
          </Menu>
        </div>
      )
    }
}
export default MenuApp;