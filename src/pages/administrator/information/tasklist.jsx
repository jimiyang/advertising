import React, {Component} from 'react';
import {Button, Input, DatePicker, Table, Modal} from 'antd';
import Link from 'umi/link';
import AuditModel from '../../components/auditModel'; //审核弹层
import PayModel from '../../components/payModel'; //付款
class CashList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      flowOfMainData: [
        {
          id: 0,
          deposit_number: '回复后是否会的撒谎',
          deposit_money: 23432143124,
          deposit_type: 1,
          order_status: 10000,
          gmt_time: 0
        },
        {
          id: 1,
          deposit_number: '回复后是否会的撒谎',
          deposit_money: 23432143124,
          deposit_type: 1,
          order_status: 10000,
          gmt_time: 1
        },
        {
          id: 2,
          deposit_number: '回复后是否会的撒谎',
          deposit_money: 23432143124,
          deposit_type: 1,
          order_status: 10000,
          gmt_time: 2
        }
      ],
      statusData: ['待审核', '待付款', '已付款'],
      isVisible: false,
      isPayVisible: false
    };
  }
  closeEvent = () => {
    this.setState({
      isVisible: false,
      isPayVisible: false
    });
  }
  CheckEvent = () => {
    this.setState({isVisible: true});
  }
  PayEvent = () => {
    this.setState({isPayVisible: true});
  }
  render() {
    const {
      flowOfMainData,
      statusData,
      isVisible,
      isPayVisible
    } = this.state;
    const columns = [
      {
        title: '商户名称',
        key: 'deposit_number',
        dataIndex: 'deposit_number'
      },
      {
        title: '商户编码',
        key: 'deposit_money',
        dataIndex: 'deposit_money'
      },
      {
        title: '商户类型',
        key: 'deposit_type',
        dataIndex: 'deposit_type'
      },
      {
        title: '提现金额',
        key: 'order_status',
        dataIndex: 'order_status'
      },
      {
        title: '状态',
        key: 'gmt_time',
        dataIndex: 'gmt_time',
        render: (record) => (
          <span>{statusData[record]}</span>
        )
      },
      {
        title: '操作',
        key: 'opeartion',
        dataIndex: '',
        render: (record) => (
          <div className="opeartion-items">
            {record.gmt_time === 0 ? <span className="blue-color" onClick={this.CheckEvent.bind(this)}>审核</span> : null}
            {record.gmt_time === 1 ? <span className="blue-color" onClick={this.PayEvent.bind(this)}>付款</span> : null}
            {record.gmt_time === 2 ? <Link to="/main/cashdetail" className="blue-color">详情</Link> : null}
          </div>
        )
      }
    ];
    return (
      <div>
        <h1 className="nav-title">任务管理</h1>
        <div>开发中.....</div>
      </div>
    );
  }
};
export default CashList;