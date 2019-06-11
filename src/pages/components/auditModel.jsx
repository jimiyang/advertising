import React, {Component} from 'react';
import{Input} from 'antd';
import style from './component.less';
class AuditModel extends Component{
  render() {
    return(
      <ul className={style.detail}>
       <li>
          <em className={style.name}>商户名称：</em>
          <div>哈哈哈哈哈哈哈哈哈哈哈</div>
        </li>
        <li>
          <em className={style.name}>商户类型：</em>
          <div></div>
        </li>
        <li>
          <em className={style.name}>联系人：</em>
          <div></div>
        </li>
        <li>
          <em className={style.name}>电话：</em>
          <div></div>
        </li> 
        <li>
          <em className={style.name}>结算账户金额：</em>
          <div></div>
        </li> 
        <li>
          <em className={style.name}>结算账户冻结金额：</em>
          <div></div>
        </li>
        <li>
          <em className={style.name}>提现金额：</em>
          <div></div>
        </li>
        <li>
          <em className={style.name}>银行卡号：</em>
          <div></div>
        </li>
        <li>
          <em className={style.name}>开户行：</em>
          <div></div>
        </li>
        <li>
          <em className={style.name}>户主姓名：</em>
          <div></div>
        </li>
      </ul>
    )
  }
}
export default AuditModel;