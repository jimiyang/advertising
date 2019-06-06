import React, {Component} from 'react';
import {DatePicker, Table, Select, Input, Button} from 'antd';
import Link from 'umi/link';
import style from './style.less';

const {Option} = Select;
class HavedTask extends Component{
  constructor(props) {
    super(props);
    this.state = {
      orderStatus: ['审核中', '审核驳回', '任务执行中', '任务取消', '任务结算中', '任务完成'],
      advertLocal: ['多图文第一条', '多图文第二条', '多图文第三条', '多图文第四条', '多图文第五条', '多图文第六条', '多图文第七条', '多图文第八条'],
      orderData: [
        {
          order_id: 1,
          order_number: 238903428140312,
          advert_local: 0,
          order_status: 1,
          public_account: '好物指南针',
          out_amount: 10000.20,
          reading_price: '23213',
          reading_number: 9999,
          real_reading_number: 10100,
          activity_name: '回复回复华鸿大厦回复的挥洒恢复大师'
        }
      ],
      search: {

      },
      pagination: {
        size: 'small'
      }
    }
  }
  render() {
    const {
      orderStatus,
      advertLocal,
      orderData,
      search,
      pagination
    } = this.state;
    const columns = [
      {
        title: '序号',
        key: 'order_id',
        dataIndex: 'order_id'
      },
      {
        title: '订单号',
        key: 'order_number',
        dataIndex: 'order_number'
      },
      {
        title: '广告位置',
        key: 'advert_local',
        dataIndex: 'advert_local'
      },
      {
        title: '订单状态',
        key: 'order_status',
        dataIndex: 'order_status'
      },
      {
        title: '接单公众号',
        key: 'public_account',
        dataIndex: 'public_account'
      },
      {
        title: '预计指出金额',
        key: 'out_amount',
        dataIndex: 'out_amount'
      },
      {
        title: '阅读单价',
        key: 'reading_price',
        dataIndex: 'reading_price'
      },
      {
        title: '接单阅读数',
        key: 'reading_number',
        dataIndex: 'reading_number'
      },
      {
        title: '实际阅读',
        key: 'real_reading_number',
        dataIndex: 'real_reading_number'
      },
      {
        title: '实际阅读',
        key: 'activity_name',
        dataIndex: 'activity_name'
      },
      {
        title: '操作',
        key: 'opeartion',
        dataIndex: '',
        render: (record) => (
          <div className="opeartion-items">
            <span><Link to={`/main/advertdetail?id=${record.order_id}`}>查看活动</Link></span>
            <span>审核接单</span>
          </div>
        )
      }
    ];
    return(
      <div className={style.task}>
        <h1 className="nav-title">账户管理</h1>
        <dl className={style.search}>
          <dt style={{width: '100%'}}>
            订单时间
            <DatePicker className="ml10" />
            <DatePicker className="ml10"/>   
          </dt>
          <dd>
            订单选择
            <Select defaultValue="" className="w180 ml10">
              <Option value="">全部</Option>
              {
                orderStatus.map((item, index) => (
                  <Option value={index}>{item}</Option>
                ))
              }
            </Select>
          </dd>
          <dd>
            广告位置
            <Select defaultValue="" className="w180 ml10">
              <Option value="">全部</Option>
              {
                advertLocal.map((item, index) => (
                  <Option value={index}>{item}</Option>
                ))
              }
            </Select>
          </dd>
          <dd>
            订单号<Input className="w180 ml10" />
          </dd>
          <dd>
            活动名称<Input className="w180 ml10" />
          </dd>
          <dd>
            <Button type="primary">查询</Button>
          </dd>
        </dl>
        <Table
          dataSource={orderData}
          columns={columns}
          pagination={pagination}
          className="table"
        />
      </div>  
    )
  }
}
export default HavedTask;