import React, {Component} from 'react';
import {Table, Input, Button, Select, message, Popconfirm, Modal, DatePicker} from 'antd';
import Link from 'umi/link';
import Redirect from 'umi/redirect';
import style from '../style.less';
const Option = Select.Option;
class TransferList extends Component{
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={style.administrator}>
        <h1 className="nav-title">转账充值审核</h1>
        <div>开发中......</div>
      </div>
    )
  }
}
export default TransferList;