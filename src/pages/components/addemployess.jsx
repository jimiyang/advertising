import React, {Component} from 'react';
import {Input} from 'antd';
import style from './component.less';
class AddEmployess extends Component{
  render() {
    return (
      <ul className={style.add}>
        <li>
          <em className={style.name}>姓名</em>
          <Input placeholder="请输入姓名" />
        </li>
        <li>
          <em className={style.name}>手机</em>
          <Input placeholder="请输入手机号" />
        </li>
        <li>
          <em className={style.name}>登录名</em>
          <Input placeholder="请输入登录名" />
        </li>
        <li>
          <em className={style.name}>密码</em>
          <Input placeholder="请输入密码" />
        </li>
      </ul>
    )
  }
};
export default AddEmployess;