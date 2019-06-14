import React, {Component} from 'react';
import {DatePicker, Table, Select, Input, Button, message} from 'antd';
import style from './style.less';
import { race } from 'redux-saga/effects';
const {Option} = Select; 
class ConsumeList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      depositData: [],
      pagination: {
        size: 'small',
        limit: 10, //每页显示多少条
        currentPage: 1,
        total: 0,
        showQuickJumper: true,
        showSizeChanger: true,
        onChange: this.changePage
      },
      search: {

      }
    };
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
    window.api.baseInstance('admin/ad/finance/list', params).then(rs => {
      this.setState({depositData: rs.data});
    }).catch(err => {
      if (err.code === 100000) {
        this.setState({redirect: true});
        window.localStorage.removeItem('login_info');
      } else {
        message.error(err.message);
      }
    });;
  }
  changePage = (page) =>  {
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
  render(){
    const {
      depositData,
      pagination
    } = this.state;
    const columns = [
      {
        title: '结算单号',
        key: 'deposit_number',
        dataIndex: 'deposit_number'
      },
      {
        title: '消费金额',
        key: 'deposit_money',
        dataIndex: 'deposit_money'
      },
      {
        title: '消费时间',
        key: 'deposit_type',
        dataIndex: 'deposit_type'
      },
      {
        title: '活动ID',
        key: 'order_status',
        dataIndex: 'order_status'
      },
      {
        title: '活动名称',
        key: 'gmt_time',
        dataIndex: 'gmt_time'
      },
      {
        title: '状态',
        key: 'success_time',
        dataIndex: 'success_time'
      }
    ];
    return(
      <div className={style.financialModel}>
        <ul className={style.search}>
          <li>
            创建时间
            <DatePicker className="w150 ml10" />
            <DatePicker className="ml10 w150" />
          </li>
          <li>
            充值单号
            <Input className="w180 ml10" />
          </li>
          <li>
            订单状态
            <Select defaultValue="" className="w180 ml10">
              <Option value="">全部</Option>
              <Option value={0}>线上充值</Option>
            </Select>
          </li>
          <li>
            <Button type="primary">查询</Button>
          </li>
        </ul>
        <Table
          dataSource={depositData}
          columns={columns}
          rowKey={record => record.id}
          pagination={pagination}
          className="table"
        />
      </div>
    )
  }
}
export default ConsumeList;