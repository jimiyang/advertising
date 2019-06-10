import React, {Component} from 'react';
import {Button} from 'antd';
import style from './style.less';
class CashList extends Component{
  render() {
    return (
      <div className={style.cash}>
        <h1 className="nav-title">提现管理</h1>
      </div>
    );
  }
};
export default CashList;