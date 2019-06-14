import React, {Component} from 'react';
import {DatePicker, Table, Select, Input, Button, message, Popconfirm} from 'antd';
import Link from 'umi/link';
import Redirect from 'umi/redirect';
import style from './style.less';

const {Option} = Select;
class HavedTask extends Component{
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      loginName: '',
      orderData: [],
      search: {
        dateStart: '',
        dateEnd: '',
        missionStatus: '', //订单状态
        campaignName: '', //活动名称
        missionId: '', //订单号
        appArticlePosition: '' //广告位置
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
    const {pagination, search} = this.state;
    const params = {
      loginName: this.state.loginName,
      currentPage: pagination.currentPage,
      limit: pagination.limit,
      ...search
    };
    window.api.baseInstance('api/ad/mission/list', params).then(rs => {
      const pagination = Object.assign(this.state.pagination, {total: rs.total});
      this.setState({orderData: rs.data, pagination});
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
  changeFormEvent = (type, e, value2) => {
    let search = this.state.search;
    let obj = {};
    switch(typeof e) {
      case 'object':
        if (type === 'dateStart' || type === 'dateEnd') {
          obj = {[type]: value2};
        } else{
          obj = {[type]: e.target.value};
        }
        break;
      case 'number':
        obj = {[type]: e};
        break;
      default:
        obj = {[type]: e};
        break;
    }
    search = Object.assign(search, obj);
    this.setState({search});
  }
  //搜索
  searchEvent = () => {
    this.loadList();
  }
  //结算
  settleEvent = (id) => {
    const params = {
      missionId: id,
      loginName: this.state.loginName
    };
    window.api.baseInstance('flow/mission/settle', params).then(rs => {
      message.success(rs.message);
      this.loadList();
    }).catch(err => {
      if (err.code === 100000) {
        this.setState({redirect: true});
        window.localStorage.removeItem('login_info');
      } else {
        message.error(err.message);
      }
    });
  }
  render() {
    const {
      redirect,
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
        dataIndex: 'appArticlePosition',
        render: (record) => (
          <span>{window.common.advertLocal[record-1]}</span>
        )
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
            <Link className="blue-color" to={`/main/advertdetail?id=${record.id}&type=${0}`}>查看活动</Link>
            {record.missionStatus === 11 ? <Link className="blue-color ml10" to={`/main/advertdetail?id=${record.id}&type=${1}`}>审核接单</Link> : null}
            {
              record.missionStatus === 13 ?
                <Popconfirm
                  title="是否要进行结算?"
                  onConfirm={this.settleEvent.bind(this, record.id)}
                  okText="是"
                  cancelText="否"
                >
                <span>结算</span>
              </Popconfirm> : null
            }
          </div>
        )
      }
    ];
    if (redirect) return (<Redirect to="/relogin" />);
    return(
      <div className={style.task}>
        <h1 className="nav-title">账户管理</h1>
        <dl className={style.search}>
          <dt style={{width: '100%'}}>
            订单时间
            <DatePicker className="ml10" format="YYYY-MM-DD" onChange={this.changeFormEvent.bind(this, 'dateStart')} />
            <DatePicker className="ml10" format="YYYY-MM-DD" onChange={this.changeFormEvent.bind(this, 'dateStart')} />   
          </dt>
          <dd>
            订单选择
            <Select defaultValue={search.missionStatus} onChange={this.changeFormEvent.bind(this, 'missionStatus')} className="w180 ml10">
              <Option value="">全部</Option>
              {
                window.common.orderStatus.map((item, index) => (<Option key={index} value={index + 10}>{item}</Option>))
              }
            </Select>
          </dd>
          <dd>
            广告位置
            <Select defaultValue={search.appArticlePosition} onChange={this.changeFormEvent.bind(this, 'appArticlePosition')} className="w180 ml10">
              <Option value="">全部</Option>
              {
                window.common.advertLocal.map((item, index) => (<Option key={index} value={index + 1}>{item}</Option>))
              }
            </Select>
          </dd>
          <dd>
            订单号<Input className="w180 ml10" value={search.missionId} onChange={this.changeFormEvent.bind(this, 'missionId')} />
          </dd>
          <dd>
            活动名称<Input className="w180 ml10" value={search.campaignName} onChange={this.changeFormEvent.bind(this, 'campaignName')} />
          </dd>
          <dd>
            <Button type="primary" onClick={this.searchEvent.bind(this)}>查询</Button>
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