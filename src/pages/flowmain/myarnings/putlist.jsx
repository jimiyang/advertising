import React, {Component} from "react";
import {Input, Select, DatePicker, Button, Table} from 'antd';
import style from './style.less';
const Option = Select.Option;
class PutList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      withDrawData: []
    };
  }
  render() {
    const {
      withDrawData
    } = this.state;
    const columns = [
      {
        title: '提现单号',
        key: '',
        dataIndex: ''
      },
    ];
    return (
      <div className={style.arnings}>
        <ul className={style.search}>
          <li>申请时间：<DatePicker /> 至<DatePicker /></li>
          <li>提现单号：<Input /></li>
          <li>状态：
            <Select value={null}>
              <Option value={null}>请选择</Option>
            </Select>
          </li>
          <li>
            <Button type="primary">查询</Button>
            <Button className="ml10">清空</Button>
          </li>
        </ul>
        <Table
          dataSource={withDrawData}
        />
      </div>
    )
  }
}
export default PutList;