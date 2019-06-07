import React, {Component} from 'react';
import {Radio, Input, Button} from 'antd';
import style from './component.less';
class RechargeModel extends Component{
  render() {
    return(
      <ul className={style.rechargeForm}>
        <li>
          <label className={style.name}>请输入充值金额</label>
          <Input className={style.ipttxt}/>
        </li>
        <li>
          <label className={style.name}>充值方式</label>
          <Radio.Group>
            <Radio value={1}><img src={require('../../assets/wx-ico.jpg')} />微信</Radio>
            <Radio value={2}><img src={require('../../assets/alipay-ico.jpg')} />支付宝</Radio>
          </Radio.Group>
        </li>
      </ul>
    )
  }
}
export default RechargeModel;