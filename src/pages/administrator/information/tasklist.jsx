import React, {Component} from 'react';
import {DatePicker, Select, Input, Button, Table, message} from 'antd';
import Redirect from 'umi/redirect';
import style from '../style.less';
import Link from 'umi/link';
const Option = Select.Option;
class TaskList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      loginName: null,  
      search: {
        dateStart: null,
        dateEnd: null,
        postStatus: null,
        campaignName: null
      },
      pagination: {
        size: 'small',
        limit: 10, //每页显示多少条
        currentPage: 1,
        total: 0,
        showSizeChanger: true,
        onChange: this.changePage,
        onShowSizeChange: this.onShowSizeChange
      },
      activityData: []
    };
  }
  async componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
    if (!loginInfo) return false;
    //因为setState是异步的，他会在render后才生效,加入一个回调函数
    await this.setState({loginName: loginInfo.data.loginName});
    this.loadList();
  }
  loadList = () => {
   let {loginName, pagination, search} = this.state;
   const params = {
    loginName,
    currentPage: pagination.currentPage,
    limit: pagination.limit,
    ...search
   };
   window.api.baseInstance('api/ad/mission/listallMission', params).then(rs => {
      console.log(rs);
      const p = Object.assign(pagination, {total: rs.total});
      this.setState({activityData: rs.data, pagination: p});
   }).catch(err => {
    if (err.code === 100000) {
      this.setState({redirect: true});
      window.localStorage.removeItem('login_info');
    }
    message.error(err.message);
   });
  }
  changePage = (page) => {
    page = page === 0 ? 1 : page;
    const pagination = Object.assign(this.state.pagination, {currentPage: page});
    this.setState({pagination});
    this.loadList();
  }
  //改变每页条数事件
  onShowSizeChange = (current, size) => {
    let p = this.state.pagination;
    p = Object.assign(p, {currentPage: current, limit: size});
    this.setState({pagination: p});
    this.loadList();
  }
  changeFormEvent = (type, e, value) => {
    let search = this.state.search;
    let obj = {};
    switch(type) {
      case 'dateStart':
        obj = {[type]: value};
        break;
      case 'dateEnd':
        obj = {[type]: value};
        break;
      case 'postStatus':
        obj = {[type]: e};
        break;
      case 'campaignName':
        obj = {[type]: e.target.value};
        break;
      default:
        obj = {[type]: e};
        break;
    }
    search = Object.assign(search, obj);
    this.setState({search});
  }
  searchEvent = () => {
    this.loadList();
  }
  render() {
    const {
      search,
      activityData,
      redirect,
      pagination
    } = this.state;
    const columns = [
      {
        title: '序号',
        key: 'id',
        dataIndex: 'id',
        width: 100,
      },
      {
        title: '任务号',
        key: 'missionId',
        dataIndex: 'missionId',
        width: 150
      },
      {
        title: '任务时间',
        width: 200,
        render: (record) => (
          <span>{window.common.getDate(record.planPostArticleTime, false)}</span>
        )
      },
      {
        title: '广告主账户',
        key: 'adMerchantCode',
        dataIndex: 'adMerchantCode',
        width: 200
      },
      {
        title: '活动名称',
        key: 'campaignName',
        dataIndex: 'campaignName',
        width: 200
      },
      {
        title: '流量主账户',
        key: 'flowMerchantCode',
        dataIndex: 'flowMerchantCode',
        width: 200
      },
      {
        title: (<div>接单公众号<p>分类 & 标签</p></div>),
        key: 'appNickName',
        dataIndex: 'appNickName',
        width: 300
      },
      {
        title: '接单时间',
        key: 'createDate',
        dataIndex: 'createDate',
        width: 200,
        render: (record) => (
          <span>{window.common.getDate(record, false)}</span>
        )
      },
      {
        title: (<div>预计发文时间<p>点 & 段</p></div>),
        key: 'planPostArticleTime',
        dataIndex: 'planPostArticleTime',
        width: 300
      },
      {
        title: '广告位置',
        key: 'appArticlePosition',
        dataIndex: 'appArticlePosition',
        width: 200,
        render: (record) => (
          <span>{window.common.advertLocal[record]}</span>
        )
      },
      {
        title: '接单阅读数',
        key: 'missionReadCnt',
        dataIndex: 'missionReadCnt',
        width: 200,
        render: (record) => (
          <span>{window.common.formatNumber(record)}</span>
        )
      },
      {
        title: '实际结算阅读',
        key: 'missionRealReadCnt',
        dataIndex: 'missionRealReadCnt',
        width: 200,
        render: (record) => (
          <span>{window.common.formatNumber(record)}</span>
        )
      },
      {
        title: '预期支出金额',
        key: 'adEstimateCost',
        dataIndex: 'adEstimateCost',
        width: 200,
        render: (record) => (
          <span>{window.common.formatNumber(record)}</span>
        )
      },
      {
        title: '结算金额',
        key: 'adRealCost',
        dataIndex: 'adRealCost',
        width: 200
      },
      {
        title: '任务状态',
        key: 'missionStatus',
        dataIndex: 'missionStatus',
        width: 200,
        render: (record) => (
          <span>{window.common.orderStatus[Number(record) - 10]}</span>
        )
      }
    ];
    if (redirect) return (<Redirect to="/relogin" />);
    return(
      <div className={style.administrator}>
        <h1 className="nav-title">活动管理</h1>
        <div className={style.accountAmount}>
          <div>
            <div className={style.accountItems}>
              <h1>任务总数</h1>
              {pagination.total}
            </div>
            <div className={style.lockAmount}>
              <h1>未投放任务</h1>
              0
            </div>
          </div>
        </div>
        <ul className={style.search}>
          <li>
            活动时间
            <DatePicker className="ml10" format="YYYY-MM-DD" onChange={this.changeFormEvent.bind(this, 'dateStart')} />
            <DatePicker className="ml10" format="YYYY-MM-DD" onChange={this.changeFormEvent.bind(this, 'dateEnd')} />
          </li>
          <li>
            活动状态
            <Select className="ml10" defaultValue={search.postStatus} onChange={this.changeFormEvent.bind(this, 'postStatus')}>
              <Option value={null}>请选择</Option>
              {
                window.common.taskStatusData.map((item, index) => (
                  <Option key={index} value={index + 10}>{item}</Option>
                ))
              }
            </Select>
          </li>
          <li>
            活动名称
            <Input className="ml10" value={search.campaignName} onChange={this.changeFormEvent.bind(this, 'campaignName')} />
          </li>
          <li>
            <Button type="primary" onClick={this.searchEvent.bind(this)}>查询</Button>
          </li>
        </ul>
        <Table
          dataSource={activityData}
          columns={columns}
          pagination={pagination}
          rowKey={record => record.id}
          className="table"
          scroll={{x: 2800}}
        />
      </div>
    );
  }
};
export default TaskList;