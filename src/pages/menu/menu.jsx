import React, {Component} from 'react';
import {Menu, Icon} from 'antd';
import {Link} from  'react-router';
const SubMenu = Menu.SubMenu;
class MenuApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            menuPanes: [
                {
                    id: '1',
                    name: '商户管理',
                    children: [
                        {id: '10', name: '商户总部', url: '/components/option1'}
                    ]
                },
                {
                    id: '2',
                    name: '代理商管理',
                    children: [
                        {id: '20', name: '代理商管理', url: '/components/option3'}
                    ]
                },
                {
                    id: '4',
                    name: '帮助中心',
                    url: '/components/help',
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
            <div>
                <Menu
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={this.state.collapsed}
                    selectedKeys={[this.state.selectedKey]}
                >
                {
                    this.state.menuPanes.map((item, index) => (
                        (item.children.length === 0) ?
                        <Menu.Item key={item.id} onClick={() => this.handleClick(item)}>
                            <Icon type="mail" />
                            <span>{item.name}</span>
                        </Menu.Item>
                        :
                        <SubMenu key={index} title={<span><Icon type="mail" /><span>{item.name}</span></span>}>
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