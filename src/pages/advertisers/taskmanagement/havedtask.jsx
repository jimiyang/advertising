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
      loginName: '',
      orderData: [],
      search: {

      },
      pagination: {
        size: 'small',
        total: 0
      }
    }
  }
  componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
    if (!loginInfo) return false;
    //因为setState是异步的，他会在render后才生效,加入一个回调函数
    this.setState({
      loginName: loginInfo.data.loginName
    },()=>{
      this.loadList();
    });
  }
  loadList = () => {
    const params = {
      loginName: this.state.loginName
    };
    window.api.baseInstance('api/ad/mission/list', params).then(rs => {
      console.log(rs);
      const pagination = Object.assign(this.state.pagination, {total: rs.total});
      this.setState({orderData: rs.data, pagination});
    });
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
        key: 'id',
        dataIndex: 'id'
      },
      {
        title: '订单号',
        key: 'missionId',
        dataIndex: 'missionId'
      },
      {
        title: '广告位置',
        key: 'appArticlePosition',
        dataIndex: 'appArticlePosition'
      },
      {
        title: '订单状态',
        key: 'missionStatus',
        dataIndex: 'missionStatus'
      },
      {
        title: '接单公众号',
        key: 'appNickName',
        dataIndex: 'appNickName'
      },
      {
        title: '预计指出金额',
        key: 'adEstimateCost',
        dataIndex: 'adEstimateCost'
      },
      {
        title: '阅读单价',
        key: 'adUnitPrice',
        dataIndex: 'adUnitPrice'
      },
      {
        title: '接单阅读数',
        key: 'missionReadCnt',
        dataIndex: 'missionReadCnt'
      },
      {
        title: '实际阅读',
        key: 'missionRealReadCnt',
        dataIndex: 'missionRealReadCnt'
      },
      {
        title: '活动名称',
        key: 'campaignName',
        dataIndex: 'campaignName'
      },
      {
        title: '操作',
        key: 'opeartion',
        dataIndex: '',
        render: (record) => (
          <div className="opeartion-items">
            <span><Link className="blue-color" to={`/main/advertdetail?id=${record.missionId}`}>查看活动</Link></span>
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
                  <Option key={index} value={index}>{item}</Option>
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
                  <Option key={index} value={index}>{item}</Option>
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
          rowKey={record => record.id}
          pagination={pagination}
          className="table"
        />
      </div>  
    )
  }
}
export default HavedTask;