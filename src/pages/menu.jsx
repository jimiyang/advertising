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
                {id: 30, name: '新建推广活动', url: '/main/option3'}
              ]
            },
            {
              id: 4,
              name: '我的财务支出',
              url: '/main/help',
              ico: 'money-collect',
              children: []
            }
          ]
        };
    }
    handleClick(pane){
        this.props.handleClick(pane);
    }
    render() {
        return (
            <div className="menu-blocks">
                <Menu
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['0']}
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