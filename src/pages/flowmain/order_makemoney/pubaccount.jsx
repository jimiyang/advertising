import React, {Component} from 'react';
import {Button, Table} from 'antd';
import Link from 'umi/link';
import style from './style.less';
class PubAccount extends Component{
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
          account_status: 0
        }
      ]
    };
  }
  render() {
    const {
      pubAccountData
    } = this.state;
    const columns = [
      {
        title: '序号',
        key: 'id',
        dataIndex: 'id'
      },
      {
        title: '公众号',
        key: 'pub_account',
        dataIndex: 'pub_account'
      },
      {
        title: '粉丝数量',
        key: 'fans_count',
        dataIndex: 'fans_count'
      },
      {
        title: '男粉比例',
        key: 'boy_scale',
        dataIndex: 'boy_scale'
      },
      {
        title: '女粉比例',
        key: 'girl_scale',
        dataIndex: 'girl_scale'
      },
      {
        title: '头条阅读',
        key: 'firs_reading',
        dataIndex: 'firs_reading'
      },
      {
        title: '词条阅读',
        key: 'words_reading',
        dataIndex: 'words_reading'
      },
      {
        title: '媒体标签',
        key: 'media_label',
        dataIndex: 'media_label'
      },
      {
        title: '状态',
        key: 'account_status',
        dataIndex: 'account_status'
      },
      {
        title: '操作',
        key: 'opeartion',
        render: (record) => (
          <Link to="/main/edit">编辑</Link>
        )
      }
    ];
    return(
      <div className={style.pubAccount}>
        <h1 className="nav-title">我授权的公众号
          <Button type="primary">授权新公众号</Button>
        </h1>
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
export default PubAccount;