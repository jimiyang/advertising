import React, {Component} from 'react';
import {Button, Table, message, Select} from 'antd';
import Redirect from 'umi/redirect';
import Link from 'umi/link';
import style from './style.less';
const Option = Select.Option;
class AdTask extends Component{
  constructor(props) {
    super(props);
    this.state = {
      redirect: '',
      loginName: '',
      pubAccountData: [],
      appsData: [], //公众号列表
      search: {
        appNickName: null,
        missionStatus: null
      },
      pagination: {
        size: 'small',
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
        currentPage: 1,
        limit: 10,
        onChange: this.changePage,
        onShowSizeChange: this.onShowSizeChange
      },
    };
  }
  async componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
    if (!loginInfo) return false;
    await this.setState({loginName: loginInfo.data.loginName});
    this.loadList();
    this.getListApps(loginInfo.data.loginName);
  }
  loadList = () => {
    const {loginName, pagination, search} = this.state;
    const params = {
      currentPage: pagination.currentPage,
      limit: pagination.limit,
      loginName,
      ...search
    };
    window.api.baseInstance('flow/mission/list', params).then(rs => {
      console.log(rs);
      const p = Object.assign(pagination, {total: rs.total});
      this.setState({pubAccountData: rs.data, pagination: p});
    }).catch(err => {
      if (err.code === 100000) {
        this.setState({redirect: true});
        window.localStorage.removeItem('login_info');
      } else {
        message.error(err.message);
      }
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
  //查询所有公众号
  getListApps = (loginName) => {
    window.api.baseInstance('flow/wechat/listapps', {loginName}).then(rs => {
      this.setState({appsData: rs.data});
    }).catch(err => {
      if (err.code === 100000) {
        this.setState({redirect: true});
        window.localStorage.removeItem('login_info');
      } else {
        message.error(err.message);
      }
    });
  }
  changeFormEvent = (type, e) => {
    let search = this.state;
    const value = type === 'missionStatus' ? e + 10 : e;
    search = Object.assign(search, {[type]: value});
    this.setState({search});
  }
  searchEvent = () => {
    this.loadList();
  }
  render() {
    const {
      redirect,
      pubAccountData,
      appsData,
      search,
      pagination
    } = this.state;
    const columns = [
      {
        title: '投放公众号信息',
        key: 'appNickName',
        dataIndex: 'appNickName'
      },
      {
        title: '文章标题',
        key: 'campaignName',
        dataIndex: 'campaignName'
      },
      {
        title: (<div><p>预计发文时间</p><p>实际发文时间</p></div>),
        render: (record) => (
          <div>
            <p>{record.planPostArticleTime}</p>
            <p>{record.realPostArticleTime}</p>
          </div>
        )
      },
      {
        title: '预计发文位置',
        key: 'appArticlePosition',
        dataIndex: 'appArticlePosition'
      },
      {
        title: '接单数',
        key: 'missionReadCnt',
        dataIndex: 'missionReadCnt'
      },
      {
        title: '阅读单价',
        key: 'flowUnitPrice',
        dataIndex: 'flowUnitPrice'
      },
      {
        title: '预计收入',
        key: 'flowEstimateIncome',
        dataIndex: 'flowEstimateIncome'
      },
      {
        title: '完成量',
        key: 'missionRealReadCnt',
        dataIndex: 'missionRealReadCnt'
      },
      {
        title: '实际收入',
        key: 'flowRealIncome',
        dataIndex: 'flowRealIncome'
      },
      {
        title: '订单状态',
        key: 'missionStatus',
        dataIndex: 'missionStatus',
        render: (record) => (
          <span>{window.common.orderStatus[record - 10]}</span>
        )
      },
      {
        title: '操作',
        key: 'opeartion',
        render: (record) => (
          <div className="opeartion-items">
            <Link to={{pathname: '/main/adtaskdetail', state: {id: record.campaignId}}} className="ml10 blue-color">详情</Link>
          </div>
        )
      }
    ];
    if (redirect) return (<Redirect to="/relogin" />);
    return(
      <div className={style.pubAccount}>
        <h1 className="nav-title">接单赚钱 > 已接任务</h1>
        <ul className={style.search}>
          <li>
            请选择公众号
            <Select defaultValue={search.appNickName} className="w180 ml10" onChange={this.changeFormEvent.bind(this, 'appNickName')}>
              <Option value={null}>请选择</Option>
              {
                appsData.length !== 0 ? 
                  appsData.map((item, index) => (
                    <Option key={index} value={item.appNickName}>{item.appNickName}</Option>
                  )) : null
              }
            </Select>
          </li>
          <li>
            接单状态
            <Select defaultValue={search.missionStatus} className="w180 ml10" onChange={this.changeFormEvent.bind(this, 'missionStatus')}>
              <Option value={null}>请选择</Option>
              {
                window.common.orderStatus.map((item, index) => (
                  <Option key={index} value={index}>{item}</Option>
                ))
              }
            </Select>
          </li>
          <li>
            <Button type="primary" onClick={this.searchEvent.bind(this)}>查询</Button>
          </li>
        </ul>
        <Table 
          dataSource={pubAccountData}
          columns={columns}
          pagination={pagination}
          rowKey={record => record.id}
          className="table"
        />
      </div>
    );
  }
};
export default AdTask;