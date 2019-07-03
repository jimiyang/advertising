import React, {Component} from 'react';
import {DatePicker, Select, Input, Button, Table, message, Popconfirm} from 'antd';
import Redirect from 'umi/redirect';
import style from '../style.less';
class ViewActivity extends Component{
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    };
  }
  render() {
    const {
      redirect
    } = this.state;
    const columns = [
      {
        title: ''
      }
    ];
    if (redirect) return (<Redirect to="/relogin" />);
    return (
      <div className={style.administrator}>
        <h1 className="nav-title">详情</h1>
        <div className={style.settlementItems}>
          <ul>
            <li>活动名称：<div>XXX</div></li>
            <li>活动日期：<div>XXX</div></li>
            <li>活动形式：<div>XXX</div></li>
            <li>活动条件限定：<div>XXX</div></li>
            <li>结算方式：<div>XXX</div></li>
            <li>活动预算：<div>XXX</div></li>
            <li>预计有<span>100,000</span>个有效阅读</li>
          </ul>
          <Table
          
          />
        </div>
      </div>
    )
  }
};
export default ViewActivity;