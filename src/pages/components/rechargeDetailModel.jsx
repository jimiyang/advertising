import React, {Component} from 'react';
import {Select, DatePicker, Input} from 'antd';
import style from './component.less';
const Option = Select.Option;
class RechargeDetailModel extends Component{
  constructor(props) {
    super(props);
    this.state = {
      form: {},
      status: ['下单', '成功', '失败']
    };
  }
  componentWillMount() {
    if (!this.props.detailForm) return false;
    this.setState({
      form: this.props.detailForm
    });
  }
  componentWillReceiveProps(props) {
    if (!props.detailForm) return false;
    this.setState({
      form: props.detailForm
    });
  }
  render() {
    const {form, status} = this.state;
    return (
      <ul className={style.detail}>
        <li>
          <em className={style.name}>充值商户名称：</em><div>{form.merchantName}</div>
        </li>
        <li>
          <em className={style.name}>联系人：</em><div>{form.contactName}</div>
        </li>
        <li>
          <em className={style.name}>联系手机：</em><div>{form.contactTel}</div>
        </li>
        <li>
          <em className={style.name}>订单创建时间：</em><div>{window.common.getDate(form.createDate, true)}</div>
        </li>
        <li>
          <em className={style.name}>充值到的CA账号：</em><div>{form.merchantCa}</div>
        </li>
        <li>
          <em className={style.name}>充值商户code：</em><div>{form.merchantCode}</div>
        </li>
        <li>
          <em className={style.name}>订单金额：</em><div>{form.orderAmt}</div>
        </li>
        <li>
          <em className={style.name}>订单状态：</em><div>{status[form.orderStatus]}</div>
        </li>
        <li>
          <em className={style.name}>充值方式：</em><div>{form.topupType === 'WX' ? '微信' : '支付宝'}</div>
        </li>
      </ul>
    );
  }
};
export default RechargeDetailModel;