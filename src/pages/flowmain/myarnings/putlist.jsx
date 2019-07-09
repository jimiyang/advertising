import React, {Component} from "react";
import {Input, Select, DatePicker, Button, Table} from 'antd';
import moment from 'moment';
import style from './style.less';
import {historyList, caQuery} from '../../../api/api';
import router from "umi/router";
const Option = Select.Option;
class PutList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      withDrawData: [],
      loginName: null,
      isActive: 0,
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
        pageSize: 10,
        onChange: this.changePage,
        onShowSizeChange: this.onShowSizeChange
      },
      availableBalance: 0
    };
  }
  async componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
    await this.setState({loginName: loginInfo.data.loginName});
    this.loadList();
  }
  //获取可用余额和冻结余额
  getCaQuery = () => {
    caQuery({operatorLoginName: this.state.loginName}).then(rs => {
      this.setState({availableBalance: rs.data.available_balance});
    });
  }
  loadList = () => {
    const {loginName, search, pagination} = this.state;
    const params = {
      loginName,
      ...search,
      currentPage: pagination.currentPage,
      limit: pagination.limit
    };
    historyList(params).then(rs => {
      const p = Object.assign(pagination, {total: rs.total});
      this.setState({withDrawData: rs.data, pagination: p});
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
  //切换记录列表
  accountTypeEvent = (index) => {
    this.setState({isActive: index});
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
      case 'orderNo':
        obj = {[type]: e.target.value};
        break;
      case 'orderStatus':
        obj = {[type]: e};
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
    )
    this.setState({search});
  }
  widthdrawEvent = () => {
    router.push('/main/getcash');
  }
  render() {
    const {
      withDrawData,
      search,
      pagination,
      availableBalance,
      isActive
    } = this.state;
    const columns = [
      {
        title: '提现单号',
        key: 'bankCardNo',
        dataIndex: 'bankCardNo'
      },
      {
        title: '提现渠道',
        key: 'bankName',
        dataIndex: 'bankName'
      },
      {
        title: '提现金额',
        key: 'realWithdrawAmt',
        dataIndex: 'realWithdrawAmt'
      },
      {
        title: '申请时间',
        key: 'applyTime',
        dataIndex: 'applyTime',
        render: (record) => (
          <span>{window.common.getDate(record, true)}</span>
        )
      },
      {
        title: '提现状态',
        key: 'orderStatus',
        dataIndex: 'orderStatus'
      },
      {
        title: '提现成功时间',
        key: 'updateDate',
        dataIndex: 'updateDate',
        render: (record) => (
          <span>{window.common.getDate(record, true)}</span>
        )
      }
    ];
    return (
      <div className={style.arnings}>
        <h1 className="nav-title">我的收益 > 提现记录</h1>
        <div className={style.accountAmount}>
          <div>
            <div className={style.accountItems}>
              {availableBalance}
              <h1>账户可用余额</h1>
            </div>
          </div>
          <p>
            <span onClick={this.widthdrawEvent.bind(this)}>提现</span>
          </p>
        </div>
        <ul className={style.accountType}>
          <li className={isActive === 0 ? style.active : null} onClick={this.accountTypeEvent.bind(this, 0)}>提现记录</li>
          <li className={isActive === 1 ? style.active : null} onClick={this.accountTypeEvent.bind(this, 1)}>结算记录</li>
          <li className={isActive === 2 ? style.active : null} onClick={this.accountTypeEvent.bind(this, 2)}>账户记录</li>
        </ul>
        <ul className={style.search}>
          <li>申请时间：
            <DatePicker formate="YYYY-MM-DD" value={search.dateStart === null || search.dateStart === '' ? null : moment(search.dateStart)} formate="YYYY-MM-DD" onChange={this.changeFormEvent.bind(this, 'dateStart')} />
            <DatePicker formate="YYYY-MM-DD" value={search.dateEnd === null || search.dateEnd === '' ? null : moment(search.dateEnd)} onChange={this.changeFormEvent.bind(this, 'dateEnd')} /></li>
          <li>提现单号：<Input onChange={this.changeFormEvent.bind(this, 'orderNo')} /></li>
          <li>状态：
            <Select value={search.orderStatus} style={{width: '180px'}} onChange={this.changeFormEvent.bind(this, 'orderStatus')}>
              <Option value={null}>请选择</Option>
              <Option value={1}>待审核</Option>
              <Option value={2}>驳回审核</Option>
              <Option value={3}>待支付</Option>
              <Option value={4}>成功</Option>
            </Select>
          </li>
          <li>
            <Button type="primary" onClick={this.searchEvent.bind(this)}>查询</Button>
            <Button className="ml10" onClick={this.clearEvent.bind(this)}>清空</Button>
          </li>
        </ul>
        <Table
          dataSource={withDrawData}
          columns={columns}
          rowKey={record => record.id}
          pagination={pagination}
          className="table"
        />
      </div>
    )
  }
}
export default PutList;