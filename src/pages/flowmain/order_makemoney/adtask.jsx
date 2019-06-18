import React, {Component} from 'react';
import {Button, Table} from 'antd';
import Link from 'umi/link';
import style from './style.less';
class AdTask extends Component{
  constructor(props) {
    super(props);
    this.state = {
      pubAccountData: [
        {
          id: 1,
          pub_account: '生活万物家',
          fans_count: 100,
          boy_scale: '50%',
          girl_scale: '50%',
          firs_reading: 80000,
          words_reading: 2000,
          media_label: '汽车',
          account_status: 0,
          account_status1: 0,
          account_status2: 0
        },
        {
          id: 2,
          pub_account: '生活万物家',
          fans_count: 100,
          boy_scale: '50%',
          girl_scale: '50%',
          firs_reading: 80000,
          words_reading: 2000,
          media_label: '汽车',
          account_status: 0,
          account_status1: 0,
          account_status2: 1
        },
        {
          id: 3,
          pub_account: '生活万物家',
          fans_count: 100,
          boy_scale: '50%',
          girl_scale: '50%',
          firs_reading: 80000,
          words_reading: 2000,
          media_label: '汽车',
          account_status: 0,
          account_status1: 0,
          account_status2: 2
        },
        {
          id: 4,
          pub_account: '生活万物家',
          fans_count: 100,
          boy_scale: '50%',
          girl_scale: '50%',
          firs_reading: 80000,
          words_reading: 2000,
          media_label: '汽车',
          account_status: 0,
          account_status1: 0,
          account_status2: 3
        }
      ],
      statusData: ['待审核', '待执行', '执行中', '待结算', '任务完成', '审核驳回', '任务取消']
    };
  }
  componentWillMount() {
    console.log(this.props.location.query.aa);
  }
  render() {
    const {
      pubAccountData
    } = this.state;
    const columns = [
      {
        title: '投放公众号信息',
        key: 'pub_account',
        dataIndex: 'pub_account'
      },
      {
        title: '文章标题',
        key: 'fans_count',
        dataIndex: 'fans_count'
      },
      {
        title: (<div><p>预计发文时间</p><p>实际发文时间</p></div>),
        key: 'boy_scale',
        dataIndex: 'boy_scale'
      },
      {
        title: '预计发文位置',
        key: 'girl_scale',
        dataIndex: 'girl_scale'
      },
      {
        title: '接单数',
        key: 'firs_reading',
        dataIndex: 'firs_reading'
      },
      {
        title: '单价',
        key: 'words_reading',
        dataIndex: 'words_reading'
      },
      {
        title: '预计收入',
        key: 'media_label',
        dataIndex: 'media_label'
      },
      {
        title: '完成量',
        key: 'account_status',
        dataIndex: 'account_status'
      },
      {
        title: '实际收入',
        key: 'account_status1',
        dataIndex: 'account_status1'
      },
      {
        title: '订单状态',
        key: 'account_status2',
        dataIndex: 'account_status2'
      },
      {
        title: '操作',
        key: 'opeartion',
        render: (record) => (
          <div>
            {
              record.account_status2 === 0 ? <span>取消</span> : null
            }
            {
              record.account_status2 === 1 ? <span>推文</span> : null
            }
            {
              record.account_status2 === 2 ? <span>完成任务</span> : null
            }
            {
              record.account_status2 === 5 ? <span>重新修改</span> : null
            }
            <Link to="/main/edit" className="ml10">详情</Link>
          </div>
        )
      }
    ];
    return(
      <div className={style.pubAccount}>
        <h1 className="nav-title">接单赚钱 > 已接任务列表</h1>
        <Table 
          dataSource={pubAccountData}
          columns={columns}
          rowKey={record => record.id}
          className="table"
        />
      </div>
    );
  }
};
export default AdTask;