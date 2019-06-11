import React, {Component} from 'react';
import{Input} from 'antd';
import style from './component.less';
class PayModel extends Component{
  render() {
    return(
      <ul className={style.add}>
       <li>
          <em className={style.name}>汇款单号</em>
          <Input/>
        </li>
      </ul>
    )
  }
}
export default PayModel;