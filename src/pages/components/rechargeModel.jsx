import React, {Component} from 'react';
import {Radio, Input, Button} from 'antd';
import style from './component.less';
class RechargeModel extends Component{
  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      channelType: 'WX'
    };
  }
  componentWillMount() {
    this.setState({amount: this.props.amount});
  }
  componentWillReceiveProps(props) {
    this.setState({amount: props.amount});
  }
  changeFormEvent = (type, e) => {
    switch(typeof e) {
      case 'object':
        this.setState({[type]: e.target.value});
        break;
      case 'string':
        this.setState({[type]: e});
        break;
      default:
        this.setState({[type]: e.target.value});
        break;
    }
    this.props.changeFormEvent(type, e);
  }
  render() {
    const {
      amount,
      channelType
    } = this.state;
    return(
      <ul className={style.rechargeForm}>
        <li>
          <label className={style.name}>请输入充值金额</label>
          <Input className={style.ipttxt} onChange={this.changeFormEvent.bind(this, 'amount')} value={amount} />
        </li>
        <li>
          <label className={style.name}>充值方式</label>
          <Radio.Group value={channelType} onChange={this.changeFormEvent.bind(this, 'channelType')}>
            <Radio value={'WX'}><img src={require('../../assets/wx-ico.jpg')} />微信</Radio>
            <Radio value={'ALI'}><img src={require('../../assets/alipay-ico.jpg')} />支付宝</Radio>
          </Radio.Group>
        </li>
      </ul>
    )
  }
}
export default RechargeModel;