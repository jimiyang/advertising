import React, {Component} from 'react';
import {DatePicker, Table, Select, Input, Button} from 'antd';
import style from './style.less';
const {Option} = Select; 
class WithdrawList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      depositData: [
        {
          id: 1,
          deposit_number: 23432143124312,
          deposit_money: 34231,
          deposit_type: 0,
          order_status: 0,
          gmt_time: '500000000'
        }
      ],
      pagination: {
        size: 'small'
      }
    };
  }
  componentWillMount() {
    console.log('提现记录');
  }
  render(){
    const {
      depositData,
      pagination
    } = this.state;
    const columns = [
      {
        title: '提现单号',
        key: 'deposit_number',
        dataIndex: 'deposit_number'
      },
      {
        title: '提现金额',
        key: 'deposit_money',
        dataIndex: 'deposit_money'
      },
      {
        title: '申请时间',
        key: 'deposit_type',
        dataIndex: 'deposit_type'
      },
      {
        title: '提现成功时间',
        key: 'order_status',
        dataIndex: 'order_status'
      },
      {
        title: '账户余额',
        key: 'gmt_time',
        dataIndex: 'gmt_time'
      }
    ];
    return(
      <div className={style.financialModel}>
        <ul className={style.search}>
          <li>
            申请时间
            <DatePicker className="w150 ml10" />
            <DatePicker className="ml10 w150" />
          </li>
          <li>
            提现单号
            <Input className="w180 ml10" />
          </li>
          <li>
            状态
            <Select defaultValue="" className="w180 ml10">
              <Option value="">全部</Option>
              <Option value={0}>线上充值</Option>
            </Select>
          </li>
          <li>
            <Button type="primary">查询</Button>
          </li>
        </ul>
        <Table
          dataSource={depositData}
          columns={columns}
          rowKey={record => record.id}
          pagination={pagination}
          className="table"
        />
      </div>
    )
  }
}
export default WithdrawList;