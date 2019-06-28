import React, {Component} from 'react';
import {DatePicker, Input, Table, Button, message} from 'antd';
import Redirect from 'umi/redirect';
import style from './style.less';
class ArningsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginName: '',
      earningsData: [],
      available_balance: 0, //可用余额
      freezen_balance: 0, //冻结余额
      search: {
        dateStart: null,
        dateEnd: null,
        orderNo: null,
        orderStatus: null
      },
      pagination: {
        size: 'small',
        showSizeChanger: true,
        total: 0,
        currentPage: 1,
        limit: 10,
        onChange: this.changePage,
        onShowSizeChange: this.onShowSizeChange
      }
    };
  }
  async componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
    if (!loginInfo) return false;
    await this.setState({loginName: loginInfo.data.loginName});
    this.loadList();
    this.getCaQuery();
  }
  //获取可用余额和冻结余额
  getCaQuery = () => {
    window.api.baseInstance('api/merchant/caQuery', {operatorLoginName: this.state.loginName}).then(rs => {
      this.setState({available_balance: rs.data.available_balance, freezen_balance: rs.data.freezen_balance});
    }).catch(err => {
      if (err.code === 100000) {
        this.setState({redirect: true});
        window.localStorage.removeItem('login_info');
      }
      message.error(err.message);
    });
  }
  loadList = () => {
    const {loginName, pagination, search} = this.state;
    const params = {
      currentPage: pagination.currentPage,
      limit: pagination.limit,
      loginName,
      ...search
    };
    window.api.baseInstance('admin/flow/finance/list', params).then(rs => {
      const p = Object.assign(pagination, {total: rs.total});
      this.setState({earningsData: rs.data, pagination: p});
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
    switch (type) {
      case 'dateStart':
        obj = {[type]: value};
        break;
      case 'dateEnd':
        obj = {[type]: value};
        break;
      case 'orderNo':
        obj = {[type]: e.target.value};
        break;
      default:
        break;
    }
    search = Object.assign(search, obj);
    this.setState({search});
  }
  searchEvent = () => {
    this.loadList();
  }
  //提现弹窗
  widthdrawEvent = () => {
    //this.setState({isDrawVisible: true});
    message.warning('功能正在开发中....');
  }
  render () {
    const {
      redirect,
      available_balance,
      freezen_balance,
      earningsData,
      pagination
    } = this.state;
    const columns = [
      {
        title: '结算单号',
        key: 'missionId',
        dataIndex: 'missionId'
      },
      {
        title: '结算金额',
        key: 'orderAmt',
        dataIndex: 'orderAmt',
        render: (record) => (
          <span>{record !== undefined ? window.common.formatNumber(record) : null}</span>
        )
      },
      {
        title: '活动名称',
        key: 'campaignName',
        dataIndex: 'campaignName'
      },
      {
        title: '接单单号',
        key: 'orderNo',
        dataIndex: 'orderNo'
      },
      {
        title: '到账时间',
        key: 'createDate',
        dataIndex: 'createDate',
        render: (record) => (
          <span>{window.common.getDate(record, false)}</span>
        )
      }
    ];
    if (redirect) return (<Redirect to="/relogin" />);
    return(
      <div className={style.arnings}>
        <h1 className="nav-title">我的收益 > 结算记录</h1>
        <div className={style.accountAmount}>
          <div>
            <div className={style.accountItems}>
              {available_balance}
              <h1>账户可用余额</h1>
            </div>
            <div className={style.lockAmount}>
              {freezen_balance}
              <h1>账户冻结余额</h1>
            </div>
          </div>
          <p>
            <span onClick={this.widthdrawEvent.bind(this)}>提现</span>
          </p>
        </div>
        <ul className={style.search}>
          <li>
            创建时间
            <DatePicker className="ml10" formate="YYYY-MM-DD" onChange={this.changeFormEvent.bind(this, 'dateStart')} />
            <DatePicker className="ml10" formate="YYYY-MM-DD" onChange={this.changeFormEvent.bind(this, 'dateEnd')} />
          </li>
          <li className="ml30">
            结算单号
            <Input className="w180 ml10" onChange={this.changeFormEvent.bind(this, 'orderNo')} />
          </li>
          <li className="ml30">
            <Button type="primary" onClick={this.searchEvent.bind(this)}>查询</Button>
          </li>
        </ul>
        <Table
          dataSource={earningsData}
          columns={columns}
          rowKey={record => record.id}
          pagination={pagination}
          className="table"
        />
      </div>
    )
  }
};
export default ArningsList;