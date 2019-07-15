import React, {Component} from 'react';
import {Button, message, Input, Popconfirm, Form} from 'antd';
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
      thirdOrderNo: null,
      type: null,
      isHide: false,
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
  changeEvent = (type, e) => {
    const reg = /[^\d]/g;
    let flag = false;
    if (reg.test(e.target.value)) {
      flag = true;
    }
    this.setState({[type]: e.target.value, isHide: flag});
  }
  auditEvent = (status) => {
    const {form, loginName, auditRemark, thirdOrderNo, type, isHide}  = this.state;
    let obj = {};
    let methods;
    if (type === 'pay') {
      if (isNull(thirdOrderNo)) {
        message.error('请输入汇款单号');
        return false;
      }
      obj = {thirdOrderNo};
      methods = withdrawPay;
    } else {
      if (isNull(auditRemark)) {
        message.error('请填写审核备注信息');
        return false;
      }
      obj = {auditRemark};
      methods = withdrawAudit;
    }
    const params = {
      orderNo: form.orderNo,
      loginName: loginName,
      orderStatus: status,
      ...obj
    };
    methods(params).then(rs => {
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
      type,
      isHide
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
              <label>订单单号：</label>
              <div>{form.orderNo}</div>
            </li>
            <li>
              <label>备注：</label>
              <div>{type === 'audit' ? <TextArea rows={4} onChange={this.changeEvent.bind(this, 'auditRemark')} style={{width: '300px'}} /> : form.auditRemark }</div>
            </li>
            {
              type === 'pay' ?
              <li>
                <label>汇款单号：</label>
                <div>
                  <Input className={style.ipttxt} onChange={this.changeEvent.bind(this, 'thirdOrderNo')}/>
                  <p className={`red-color ${isHide === true ? null : 'hide'}`}>汇款单号只能输入数字</p>
                </div>
              </li>
              : null
            }
            <li>
              {
                type === 'audit' ?
                <div>
                  <Popconfirm
                    title="是否要通过审核?"
                    onConfirm={this.auditEvent.bind(this, 2)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="primary">通过</Button>
                  </Popconfirm>
                  <Popconfirm
                    title="是否要驳回审核?"
                    onConfirm={this.auditEvent.bind(this, 4)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button className="ml30">驳回</Button>
                  </Popconfirm>
                </div>
                : 
                <div>
                  <Popconfirm
                    title="是否要进行付款?"
                    onConfirm={this.auditEvent.bind(this, 3)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="primary">确定</Button>
                  </Popconfirm>
                </div>
              }
              <Button className="ml30" onClick={this.goBack.bind(this)}>返回</Button>
            </li> 
          </ul>
        </div>
      </div>
    );
  }
};
export default CashDetail;