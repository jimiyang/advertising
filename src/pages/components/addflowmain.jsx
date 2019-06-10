import React, {Component} from 'react';
import {Input} from 'antd';
import style from './component.less';
class AddFlowMain extends Component{
  render() {
    return (
      <ul className={style.add}>
        <li>
          <em className={style.name}>流量主名称</em>
          <Input placeholder="请输入流量主名称" />
        </li>
        <li>
          <em className={style.name}>联系人</em>
          <Input placeholder="请输入联系人" />
        </li>
        <li>
          <em className={style.name}>联系人电话</em>
          <Input placeholder="请输入联系人电话" />
        </li>
        <li>
          <em className={style.name}>登录名</em>
          <Input placeholder="请输入输入登录名" />
        </li>
        <li>
          <em className={style.name}>密码</em>
          <Input placeholder="请输入密码" />
        </li>
      </ul>
    )
  }
};
export default AddFlowMain;