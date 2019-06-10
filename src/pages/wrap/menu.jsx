import React, {Component} from 'react';
import {Menu, Icon} from 'antd';
const SubMenu = Menu.SubMenu;
class MenuApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
          menuPanes: [
            {
              id: 1,
              name: '首页',
              url: '',
              ico: 'home',
              children: []
            },
            {
              id: 2,
              name: '我要推广',
              ico: 'fund',
              children: [
                {id: 20, name: '新建推广活动', url: '/main/createactivity'},
                {id: 21, name: '我的推广活动', url: '/main/myactivity'},
                {id: 22, name: '素材管理', url: '/main/materiallist'}
              ]
            },
            {
              id: 3,
              name: '已结单的任务',
              ico: 'account-book',
              children: [
                {id: 30, name: '已接单任务', url: '/main/havedtask'}
              ]
            },
            {
              id: 4,
              name: '我的财务支出',
              ico: 'money-collect',
              children: [
                {id: 40, name: '充值记录', url: '/main/depositlist'},
                {id: 41, name: '提现记录', url: '/main/withdrawallist'},
                {id: 42, name: '消费记录', url: '/main/consumelist'}
              ]
            },
            {
              id: 5,
              name: '我的财务支出',
              ico: 'money-collect',
              children: [
                {id: 40, name: '充值记录', url: '/main/depositlist'},
                {id: 41, name: '提现记录', url: '/main/withdrawallist'},
                {id: 42, name: '消费记录', url: '/main/consumelist'}
              ]
            },
            {
              id: 6,
              name: '接单赚钱',
              ico: 'money-collect',
              children: [
                {id: 60, name: '我授权的公众号', url: '/main/pubaccount'},
                {id: 61, name: '我要接单赚钱', url: '/main/myorder'},
                {id: 62, name: '已接广告任务', url: '/main/adtask'}
              ]    
            },
            {
              id: 7,
              name: '员工管理',
              ico: 'money-collect',
              children: [
                {id: 70, name: '添加员工', url: '/main/add'},
                {id: 71, name: '员工列表', url: '/main/employesslist'}
              ]    
            },
            {
              id: 8,
              name: '广告主管理',
              ico: 'money-collect',
              children: []    
            },
            {
              id: 9,
              name: '流量主管理',
              ico: 'money-collect',
              children: [
                {id: 91, name: '流量主管理列表', url: '/main/flowlist'},
                {id: 92, name: '流量主账号信息', url: '/main/accountinfo'}
              ]    
            },
            {
              id: 10,
              name: '提现管理',
              ico: 'money-collect',
              children: [
                {id: 100, name: '提现管理列表', url: '/main/cashlist'},
              ]    
            },
            {
              id: 11,
              name: '活动管理',
              ico: 'money-collect',
              children: []    
            }
          ],
          panes: [
            {
                id: 6,
                name: '接单赚钱',
                ico: 'money-collect',
                children: [
                  {id: 60, name: '我授权的公众号', url: '/main/pubaccount'},
                  {id: 61, name: '我要接单赚钱', url: '/main/myorder'},
                  {id: 62, name: '已接广告任务', url: '/main/adtask'}
                ]    
            }
          ]
        };
    }
    componentWillMount() {
      
    }
    componentWillReceiveProps(props) {
      //console.log(props.id);
      //console.log(`切换了${props.id}`);
      if (props.id === 1) {
        this.setState({menuPanes: this.state.panes});
      }
    }
    handleClick(pane){
        this.props.handleClick(pane);
    }
    render() {
        return (
            <div className="menu-blocks">
                <Menu
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['9']}
                    mode="inline"
                    theme="dark"
                >
                {
                    this.state.menuPanes.map((item, index) => (
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