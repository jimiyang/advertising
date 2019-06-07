import React, {Component} from 'react';
import {DatePicker, Table, Select, Input, Button, Modal, Radio} from 'antd';
import style from './style.less';
import WithdrawList from './withdrawallist'; //提现记录
import ConsumeList from './consumelist'; //消费记录
import RechargeModel from '../components/rechargeModel'; //充值modal
const {Option} = Select; 
class DepositList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isActive: 0,
      depositData: [
        {
          id: 1,
          deposit_number: 23432143124312,
          deposit_money: 34231,
          deposit_type: 0,
          order_status: 0,
          gmt_time: '2019-11-20 10:10:10',
          success_time: '2019-11-20 10:10:10',
          deposit_balance: '312431',
          third_voucher: '421343124312432'
        }
      ],
      pagination: {
        size: 'small'
      },
      isVisible: true
    }
  }
  //切换记录列表
  accountTypeEvent = (index) => {
    this.setState({isActive: index});
  }
  //充值
  SaveMoneyEvent = () => {
    alert(1);
  }
  closeEvent = () => {
    this.setState({
      isVisible: false
    });
  }
  render(){
    const {
      isActive,
      depositData,
      pagination,
      isVisible
    } = this.state;
    const columns = [
      {
        title: '充值单号',
        key: 'deposit_number',
        dataIndex: 'deposit_number'
      },
      {
        title: '充值金额',
        key: 'deposit_money',
        dataIndex: 'deposit_money'
      },
      {
        title: '充值方式',
        key: 'deposit_type',
        dataIndex: 'deposit_type'
      },
      {
        title: '订单状态',
        key: 'order_status',
        dataIndex: 'order_status'
      },
      {
        title: '创建时间',
        key: 'gmt_time',
        dataIndex: 'gmt_time'
      },
      {
        title: '成功时间',
        key: 'success_time',
        dataIndex: 'success_time'
      },
      {
        title: '充值后余额',
        key: 'deposit_balance',
        dataIndex: 'deposit_balance'
      },
      {
        title: '第三方凭证号',
        key: 'third_voucher',
        dataIndex: 'third_voucher'
      }
    ];
    return(
      <div className={style.financialModel}>
        <Modal
          visible={isVisible}
          width={510}
          onCancel={this.closeEvent}
          footer={
            <Button type="primary">确定</Button>
          }
        >
          <RechargeModel />
        </Modal>
        <h1 className="nav-title">账户详情</h1>
        <div className={style.accountAmount}>
          <div>
            <div className={style.accountItems}>
              4
              <h1>账户可用余额</h1>
            </div>
            <div className={style.lockAmount}>
              4327849
              <h1>账户可用余额</h1>
            </div>
          </div>
          <p>
            <span onClick={this.SaveMoneyEvent.bind(this)}>充值</span>
            <span>提现</span>
          </p>
        </div>
        <ul className={style.accountType}>
          <li className={isActive === 0 ? style.active : null} onClick={this.accountTypeEvent.bind(this, 0)}>充值记录</li>
          <li className={isActive === 1 ? style.active : null} onClick={this.accountTypeEvent.bind(this, 1)}>提现记录</li>
          <li className={isActive === 2 ? style.active : null} onClick={this.accountTypeEvent.bind(this, 2)}>消费记录</li>
        </ul>
        <div className={isActive === 1 ? null : 'hide'}>
          <WithdrawList />
        </div>
        <div className={isActive === 2 ? null : 'hide'}>
          <ConsumeList />
        </div>
        <div className={isActive === 0 ? null : 'hide'}>
          <ul className={style.search}>
            <li>
              创建时间
              <DatePicker className="w150 ml10" />
              <DatePicker className="ml10 w150" />
            </li>
            <li>
              充值单号
              <Input className="w180 ml10" />
            </li>
            <li>
              创建时间
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
      </div>
    )
  }
}
export default DepositList;