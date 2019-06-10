import React, {Component} from 'react';
import {Input, Button, Table} from 'antd';
import style from './style.less';
class AccountInfo extends Component{
  constructor(props) {
    super(props);
    this.state = {
      accountData: [
        {
          id: 1,
          order_num: 243214312431431,
          order_amount: 34214321,
          name: '哈哈哈哈哈哈哈哈',
          order_num2: 32132143214312,
          gmt_time: '2030-04-34',
          sum: 43214321
        }
      ]
    }
  }
  render() {
    const {
      accountData
    } = this.state;
    const columns = [
      {
        title: '结算单号',
        key: 'order_num',
        dataIndex: 'order_num'
      },
      {
        title: '结算金额',
        key: 'order_amount',
        dataIndex: 'order_amount'
      },
      {
        title: '活动名称',
        key: 'name',
        dataIndex: 'name'
      },
      {
        title: '接单单号',
        key: 'order_num2',
        dataIndex: 'order_num2'
      },
      {
        title: '到账时间',
        key: 'gmt_time',
        dataIndex: 'gmt_time'
      },
      {
        title: '结算后余额',
        key: 'sum',
        dataIndex: 'sum'
      },
    ];
    return (
      <div className={style.flowMain}>
        <h1 className="nav-title">账户详情<Button type="primary">添加</Button></h1>
        <div className={style.accountAmount}>
          <div>
            <div className={style.accountItems}>
              4.66
              <h1>账户可用余额</h1>
            </div>
            <div className={style.lockAmount}>
              432.7849
              <h1>账户可用余额</h1>
            </div>
          </div>
        </div>
        <Table
          dataSource={accountData}
          columns={columns}
          rowKey={record => record.id}
          className="table"
        />
      </div>
    );
  }
};
export default AccountInfo;