import React, {Component} from 'react';
import {Button} from 'antd';
import style from '../style.less';
class CashDetail extends Component{
  render() {
    return(
      <div className={style.cash}>
        <h1 className="nav-title">
          提现管理 > 详情
          <Button type="primary">添加</Button>
        </h1>
        <ul className={style.detail}>
          <li>
            <label>商户名称：</label>
            <div>撒范德萨发大水</div>
          </li>
          <li>
            <label>结算账户余额：</label>
            <div></div>
          </li>
          <li>
            <label>结算账户冻结余额：</label>
            <div></div>
          </li>
          <li>
            <label>提现金额：</label>
            <div></div>
          </li>
          <li>
            <label>银行卡号：</label>
            <div></div>
          </li>
          <li>
            <label>开户行：</label>
            <div></div>
          </li>
          <li>
            <label>户主姓名：</label>
            <div></div>
          </li>
          <li>
            <label>汇款单号：</label>
            <div></div>
          </li>
          <li>
            <label>备注：</label>
            <div></div>
          </li>
        </ul>
      </div>
    );
  }
};
export default CashDetail;