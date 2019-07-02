import React, {Component} from 'react';
import {DatePicker, Select, Input, Button, Table, message, Popconfirm} from 'antd';
import Redirect from 'umi/redirect';
class ActivitySettlement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      loginName: null,
      search: {
        dateStart: null,
        dateEnd: null
      },
      pagination: {
        size: 'small',
        showSizeChanger: true,
        total: 0,
        currentPage: 1,
        limit: 10,
        pageSize: 10,
        onChange: this.changePage,
        onShowSizeChange: this.onShowSizeChange
      },
      settlementData: []
    };
  }
  async componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
    await this.setState({loginName: loginInfo.data.loginName});
    this.loadList();
  }
  loadList = () => {
    let {loginName, search, pagination} = this.state;
    const params = {
      loginName,
      ...search,
      currentPage: pagination.currentPage,
      limit: pagination.limit
    };
    window.api.baseInstance('api/ad/mission/listallMission', params).then(rs => {
      const p = Object.assign(pagination, {total: rs.total});
      this.setState({settlementData: rs.data, pagination: p});
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
    p = Object.assign(p, {currentPage: current, limit: size, pageSize: size});
    this.setState({pagination: p});
    this.loadList();
  }
  render() {
    const {
      redirect,
      pagination,
      settlementData
    } = this.state;
    const columns = [
      {
        title: '序号',
        key: 'id',
        dataIndex: 'id'
      },
      {
        title: '时间',
        key: 'createDate',
        dataIndex: 'createDate'
      },
      {
        title: '活动id',
        key: 'campaignId',
        dataIndex: 'campaignId'
      },
      {
        title: '活动名称',
        key: 'campaignName',
        dataIndex: 'campaignName'
      },
      {
        title: '活动时间',
        key: 'planPostArticleTime',
        dataIndex: 'planPostArticleTime'
      },
      {
        title: '活动预算',
        key: 'flowEstimateIncome',
        dataIndex: 'flowEstimateIncome'
      },
      {
        title: '单价',
        key: 'flowUnitPrice',
        dataIndex: 'flowUnitPrice'
      },
      {
        title: '完成比例',
        key: '',
        dataIndex: ''
      },
      {
        title: '状态',
        key: 'missionStatus',
        dataIndex: 'missionStatus'
      },
      {
        title: '操作',
        key: 'opeartion',
        render: (record) => (
          <div className="opeartion-items">
            <a href="">查看</a>
          </div>
        )
      }
    ];
    if (redirect) return (<Redirect to="/relogin" />);
    return (
      <div>
        <h1 className="nav-title">待审核活动结算单</h1>
        <Table
          dataSource={settlementData}
          pagination={pagination}
          columns={columns}
          rowKey={record => record.id}
          className="table"
        />
      </div>
    );
  }
};
export default ActivitySettlement;