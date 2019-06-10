import React, {Component} from 'react';
import {DatePicker, Select, Input, Button, Table} from 'antd';
import style from './style.less';

const {Option} = Select;
class MyActivity extends Component{
  constructor(props) {
    super(props);
    this.state = {
      statusData: ['活动草稿', '审核中', '审核驳回', '待接单', '活动过期', '活动取消', '接单中', '执行中', '执行完成', '活动结束'],
      activityData: [
        {
          activity_id: 1,
          activity_date: '2019/5/10-2019/5/10',
          activity_name: '哈哈哈哈哈哈哈哈哈',
          activity_budget: 1000,
          price: '0.333',
          number: 10000,
          activity_consume: 2000,
          activity_status: 0
        },
        {
          activity_id: 2,
          activity_date: '2019/5/10-2019/5/10',
          activity_name: '哈哈哈哈哈哈哈哈哈',
          activity_budget: 1000,
          price: '0.333',
          number: 10000,
          activity_consume: 2000,
          activity_status: 3
        }
      ],
      pagination: {
        size: 'small'
      }
    }
  }
  render() {
    const {
      statusData,
      activityData,
      pagination
    } = this.state;
    const columns = [
      {
        title: '序号',
        key: 'activity_id',
        dataIndex: 'activity_id'
      },
      {
        title: '活动周期',
        key: 'activity_date',
        dataIndex: 'activity_date'
      },
      {
        title: '活动名称',
        key: 'activity_name',
        dataIndex: 'activity_name'
      },
      {
        title: '活动预算',
        key: 'activity_budget',
        dataIndex: 'activity_budget'
      },
      {
        title: '阅读单价',
        key: 'price',
        dataIndex: 'price'
      },
      {
        title: '任务阅读数',
        key: 'number',
        dataIndex: 'number'
      },
      {
        title: '已消耗',
        key: 'activity_consume',
        dataIndex: 'activity_consume'
      },
      {
        title: '活动状态',
        key: 'activity_status',
        dataIndex: 'activity_status',
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
            <span>查看</span>
            <span>编辑</span>
            <span>取消</span>
          </div>
        )
      }
    ];
    return(
      <div className={style.mypromotion}>
        <h1 className="nav-title">我的推广活动</h1>
        <ul className={style.activitynumber}>
            <li>
                <div></div>
                <div>
                  <h1>活动总数</h1>
                  3
                </div>
            </li>
            <li>
                <div></div>
                <div>
                  <h1>未投放活动</h1>
                  （1）
                </div>
            </li>
        </ul>
        <ul className={style.search}>
          <li>
            <label>活动日期</label>
            <DatePicker className="w150 radius2"/>
            <DatePicker className="w150 ml10"/>
          </li>
          <li>
            <label>活动状态</label>
            <Select placeholder="请选择" defaultValue="" className="w180 select">
              <Option value="">请选择</Option>
            </Select>
          </li>
          <li>
            <label>活动名称</label>
            <Input className="w180" />
          </li>
          <li>
            <Button type="primary">查询</Button>
          </li>
        </ul>
        <Table
          dataSource={activityData}
          columns={columns}
          pagination={pagination}
          rowKey={record => record.activity_id}
          className="table"
        />
      </div>
    );
  }
}
export default MyActivity;