import React, {Component} from 'react';
import {Button, message, Input} from 'antd';
import style from '../style.less';
import {
  withdrawDetail,
  withdrawAudit,
  withdrawPay
} from '../../../api/api';
import { isNull } from 'util';
const {TextArea} = Input;
class CashDetail extends Component{
  constructor(props) {
    super(props);
    this.state = {
      loginName: null,
      orderNo: null,
      orderStatus: null,
      auditRemark: null,
      type: null,
      form: {}
    };
  }
  async componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
    const state = this.props.location.state;
    await this.setState({loginName: loginInfo.data.loginName, type: state.type, orderNo: state.orderNo});
    this.initForm();
  }
  initForm = () => {
    const {loginName, orderNo, form} = this.state;
    const params = {
      loginName,
      orderNo
    };
    withdrawDetail(params).then(rs => {
      const f = Object.assign(form, rs.data, rs.account);
      this.setState({form: f});
    });
  }
  changeEvent = (e) => {
    this.setState({auditRemark: e.target.value});
  }
  auditEvent = (status) => {
    const {form, loginName, auditRemark}  = this.state;
    if (isNull(auditRemark)) {
      message.error('请填写审核备注信息');
      return false;
    }
    const params = {
      orderNo: form.orderNo,
      loginName: loginName,
      orderStatus: status,
      auditRemark: auditRemark
    };
    console.log(params);
    withdrawAudit(params).then(rs => {
      console.log(rs);
      if (rs.success) {
        message.success(rs.message);
        window.history.go(-1);
      } else {
        message.error(rs.message);
      }
    });
  }
  goBack = () => {
    window.history.go(-1);
  }
  render() {
    const {
      form,
      type
    } = this.state;
    return(
      <div className={style.administrator}>
        <h1 className="nav-title">提现管理 > 详情</h1>
        <div className={style.cash}>
          <ul className={style.detail}>
            <li>
              <label>商户名称：</label>
              <div>{form.merchantName}</div>
            </li>
            <li>
              <label>商户类型：</label>
              <div>{form.merchantType === 1 ? '广告主' : '流量主'}</div>
            </li>
            <li>
              <label>联系人：</label>
              <div>{form.contactName}</div>
            </li>
            <li>
              <label>电话：</label>
              <div>{form.contactTel}</div>
            </li>
            <li>
              <label>结算账户余额：</label>
              <div>{form.available_balance}元</div>
            </li>
            <li>
              <label>结算账户冻结余额：</label>
              <div>{form.freezen_balance}元</div>
            </li>
            <li>
              <label>提现金额：</label>
              <div>{form.realWithdrawAmt}元</div>
            </li>
            <li>
              <label>银行卡号：</label>
              <div>{form.bankCardNo}</div>
            </li>
            <li>
              <label>开户行：</label>
              <div>{form.bankName}</div>
            </li>
            <li>
              <label>户主姓名：</label>
              <div>{form.bankCardOwnerName}</div>
            </li>
            <li>
              <label>汇款单号：</label>
              <div>{form.orderNo}</div>
            </li>
            <li>
              <label>备注：</label>
              <div>{type === 'audit' ? <TextArea rows={4} onChange={this.changeEvent.bind(this)} style={{width: '300px'}} /> : form.auditRemark }</div>
            </li>
            <li>
              {
                type === 'audit' ?
                <div>
                  <Button type="primary" onClick={this.auditEvent.bind(this, 2)}>通过</Button>
                  <Button className="ml30" onClick={this.auditEvent.bind(this, 4)}>驳回</Button>
                </div>
                : <Button onClick={this.goBack.bind(this)}>返回</Button>
              }
              
            </li>  
          </ul>
          
        </div>
      </div>
    );
  }
};
export default CashDetail;