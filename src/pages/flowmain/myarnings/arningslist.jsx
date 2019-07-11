import React, {Component} from 'react';
import {DatePicker, Input, Table, Button, message} from 'antd';
import style from './style.less';
import moment from 'moment';
import Link from "umi/link";
import {
  caQuery,
  flowFinanceList
} from '../../../api/api';
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
      },
      isActive: 1
    };
  }
  async componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
    await this.setState({loginName: loginInfo.data.loginName});
    this.loadList();
    this.getCaQuery();
  }
  //获取可用余额和冻结余额
  getCaQuery = () => {
    caQuery({operatorLoginName: this.state.loginName}).then(rs => {
      this.setState({available_balance: rs.data.available_balance, freezen_balance: rs.data.freezen_balance});
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
    flowFinanceList(params).then(rs => {
      const p = Object.assign(pagination, {total: rs.total});
      this.setState({earningsData: rs.data, pagination: p});
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
    const pagination = Object.assign(this.state.pagination, {currentPage: 1});
    this.setState(pagination);
    this.loadList();
  }
  clearEvent = () => {
    let search = this.state.search;
    search = Object.assign(
      search,
      {
        dateStart: null,
        dateEnd: null,
        orderNo: null,
        orderStatus: null
      }
    );
    this.setState({search});
  }
  //提现弹窗
  widthdrawEvent = () => {
    //this.setState({isDrawVisible: true});
    message.warning('功能正在开发中....');
  }
  render () {
    const {
      available_balance,
      freezen_balance,
      earningsData,
      pagination,
      search,
      isActive
    } = this.state;
    const columns = [
      {
        title: '结算单号',
        key: 'orderNo',
        dataIndex: 'orderNo'
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
        key: 'missionId',
        dataIndex: 'missionId'
      },
      {
        title: '到账时间',
        key: 'createDate',
        dataIndex: 'createDate',
        render: (record) => (
          <span>{window.common.getDate(record, true)}</span>
        )
      }
    ];
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
            <DatePicker className="ml10" value={search.dateStart === null || search.dateStart === '' ? null : moment(search.dateStart)} formate="YYYY-MM-DD" onChange={this.changeFormEvent.bind(this, 'dateStart')} />
            <DatePicker className="ml10" value={search.dateEnd === null || search.dateEnd === '' ? null : moment(search.dateEnd)} formate="YYYY-MM-DD" onChange={this.changeFormEvent.bind(this, 'dateEnd')} />
          </li>
          <li className="ml30">
            结算单号
            <Input className="w180 ml10" value={search.orderNo} onChange={this.changeFormEvent.bind(this, 'orderNo')} />
          </li>
          <li className="ml30">
            <Button type="primary" onClick={this.searchEvent.bind(this)}>查询</Button>
            <Button onClick={this.clearEvent.bind(this)} className="ml10">重置</Button>
          </li>
        </ul>
        <ul className={`${style.accountType} mt30`}>
          <li className={isActive === 0 ? style.active : null}><Link to="/main/putlist">提现记录</Link></li>
          <li className={isActive === 1 ? style.active : null}><Link to="/main/arningslist">结算记录</Link></li>
          <li className={isActive === 2 ? style.active : null}>账户记录</li>
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