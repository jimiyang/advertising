import React, {Component} from 'react';
import {DatePicker, Table, Select, Input, Button, message} from 'antd';
import style from './style.less';
import Redirect from 'umi/redirect';
const {Option} = Select; 
class ConsumeList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
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
        dateStart: '',
        dateEnd: '',
        orderStatus: '',
        orderNo: ''
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
    const {search, pagination} = this.state;
    const params = {
      loginName: this.state.loginName,
      currentPage: pagination.currentPage,
      limit: pagination.limit,
      ...search
    };
    window.api.baseInstance('admin/ad/finance/list', params).then(rs => {
      const p = Object.assign(pagination, {total: rs.total});
      this.setState({depositData: rs.data, pagination: p});
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
  changeFormEvent = (type, e, value) => {
    let search = this.state.search;
    let obj = {};
    switch (typeof e) {
      case 'object':
        if (type === 'dateStart' || type === 'dateEnd') {
          obj = {[type]: value};
        } else {
          obj = {[type]: e.target.value};
        }
        break;
      case 'number':
        obj = {[type]: e};
        break;
      default:
        obj = {[type]: e};
        break;
    };
    search = Object.assign(search, obj);
    this.setState({search});
  }
  searchEvent = () => {
    this.loadList();
  }
  render(){
    const {
      depositData,
      pagination,
      search,
      redirect
    } = this.state;
    const columns = [
      {
        title: '结算单号',
        key: 'missionId',
        dataIndex: 'missionId'
      },
      {
        title: '消费金额',
        key: 'orderAmt',
        dataIndex: 'orderAmt'
      },
      {
        title: '消费时间',
        key: 'updateDate',
        dataIndex: 'updateDate'
      },
      {
        title: '活动ID',
        key: 'campaignId',
        dataIndex: 'campaignId'
      },
      {
        title: '活动名称',
        key: 'campaignName',
        dataIndex: 'campaignName'
      },
      {
        title: '状态',
        key: 'orderStatus',
        dataIndex: 'orderStatus'
      }
    ];
    if (redirect) return (<Redirect to="/relogin" />);
    return(
      <div className={style.financialModel}>
        <ul className={style.search}>
          <li>
            创建时间
            <DatePicker className="w150 ml10" formate="YYYY-MM-DD" onChange={this.changeFormEvent.bind(this, 'dateStart')} />
            <DatePicker className="ml10 w150" formate="YYYY-MM-DD" onChange={this.changeFormEvent.bind(this, 'dateEnd')} />
          </li>
          <li>
            充值单号
            <Input className="w180 ml10" value={search.orderNo} onChange={this.changeFormEvent.bind(this, 'orderNo')} />
          </li>
          <li>
            订单状态
            <Select defaultValue={search.orderStatus} className="w180 ml10" onChange={this.changeFormEvent.bind(this, 'orderStatus')}>
              <Option value=''>全部</Option>
              <Option value={10}>未支付</Option>
              <Option value={11}>支付中</Option>
              <Option value={12}>支付完成</Option>
              <Option value={13}>支付失败</Option>
            </Select>
          </li>
          <li>
            <Button type="primary" onClick={this.searchEvent.bind(this)}>查询</Button>
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