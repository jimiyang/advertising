import React, {Component} from 'react';
import {DatePicker, Select, Input, Button, Table, message, Popconfirm} from 'antd';
import style from './style.less';
import Redirect from 'umi/redirect';
import Link from 'umi/link';
import router from 'umi/router';

const {Option} = Select;
class MyActivity extends Component{
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      loginName: '',
      activityData: [],
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
      search: {
        campaignName: '',
        dateStart: '',
        dateEnd: '',
        postStatus: ''
      },
      draftTotal: 0,
      total: 0
    }
  }
  async componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
    if (!loginInfo) return false;
    //因为setState是异步的，他会在render后才生效,加入一个回调函数
    await this.setState({
      loginName: loginInfo.data.loginName
    });
    this.loadList();
    this.getCount(loginInfo.data.loginName);
  }
  loadList = () => {
    const {pagination, search, loginName} = this.state;
    const params = {
      ...search,
      loginName,
      currentPage: pagination.currentPage,
      limit: pagination.limit
    };
    window.api.baseInstance('api/ad/campaign/list', params).then(rs => {
      const p = Object.assign(pagination, {total: rs.total});
      this.setState({activityData: rs.data, pagination: p});
    }).catch(err => {
      if (err.code === 100000) {
        this.setState({redirect: true});
        window.localStorage.removeItem('login_info');
      } else {
        message.error(err.message);
      }
    });
  }
  //获取统计总数
  getCount = (loginName) => {
    window.api.baseInstance('api/ad/campaign/getAdCampaignCountByPostStatus', {loginName}).then(rs => {
      this.setState({total: rs.data.total, draftTotal: rs.data.draftTotal});
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
  cancelActivityEvent = (item) => {
    const params = {
      id: item.id,
      loginName: this.state.loginName,
      postStatus: 25
    };
    window.api.baseInstance('api/ad/campaign/updatePostStatusById', params).then(rs => {
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
  changeFormEvent = (type, e, value) => {
    let search = this.state.search;
    let obj = {};
    switch (typeof e) {
      case 'objec':
        if (type === 'dateStart' || type === 'dateEnd') {
          obj = {[type]: value};
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
  searchEvent = () => {
    this.loadList();
  }
  //创建活动
  createEvent = () => {
    router.push('/main/createactivity')
  }
  render() {
    const {
      redirect,
      activityData,
      pagination,
      total,
      draftTotal,
      search
    } = this.state;
    const columns = [
      {
        title: '序号',
        key: 'id',
        dataIndex: 'id'
      },
      {
        title: '活动周期',
        render: (record) => (
          <span>{window.common.getDate(record.dateStart, false)}-{window.common.getDate(record.dateStart, false)}</span>
        )
      },
      {
        title: '活动名称',
        key: 'campaignName',
        dataIndex: 'campaignName'
      },
      {
        title: '活动预算',
        key: 'postAmtTotal',
        dataIndex: 'postAmtTotal',
        render: (record) => (
          <span>{window.common.formatNumber(record)}</span>
        )
      },
      {
        title: '阅读单价',
        key: 'unitPrice',
        dataIndex: 'unitPrice'
      },
      {
        title: '任务阅读数',
        render: (record) => (
          <span>{window.common.formatNumber(Math.round(record.postAmtTotal / record.unitPrice))}</span>
        )
      },
      {
        title: '已消耗',
        render: (record) => (
          <span>{window.common.formatNumber(Math.abs(Math.round(record.postAmtTotal / record.unitPrice) - record.availableCnt))}</span>
        )
      },
      {
        title: '活动状态',
        key: 'postStatus',
        dataIndex: 'postStatus',
        render: (record) => (
          <span>{window.common.postStatus[record - 20]}</span>
        )
      },
      {
        title: '操作',
        key: 'opeartion',
        dataIndex: '',
        render: (record) => (
          <div className="opeartion-items">
            <Link className="blue-color" to={{pathname: '/main/activitydetail', state: {id: record.id}}}>查看</Link>
            {
              //Number(record.postStatus) !== 20 ? null : <Link className="blue-color ml10" to={{pathname: '/main/editactivity', state: {id: record.id}}}>编辑</Link>
              [20, 22].map((item, index) => (
                record.postStatus === item ? 
                <Link key={index} className="blue-color ml10" to={{pathname: '/main/editactivity', state: {id: record.id}}}>编辑</Link>
                :
                null
              ))
            }
            {
              [20, 21, 23].map((item, index) => (
                record.postStatus === item ?
                <Popconfirm
                  key={index}
                  title="是否要取消此活动?"
                  onConfirm={this.cancelActivityEvent.bind(this, record)}
                  okText="是"
                  cancelText="否"
                >
                  <span >取消</span>
                </Popconfirm>
                :
                null
              ))
            }
          </div>
        )
      }
    ];
    if (redirect) return (<Redirect to="/relogin" />);
    return(
      <div className={style.mypromotion}>
        <h1 className="nav-title">我的推广活动<Button className="button" onClick={this.createEvent.bind(this)}>新建推广活动</Button></h1>
        <ul className={style.activitynumber}>
            <li>
                <div></div>
                <div>
                  <h1>活动总数</h1>{total}
                </div>
            </li>
            <li>
                <div></div>
                <div>
                  <h1>未投放活动</h1>{draftTotal}
                </div>
            </li>
        </ul>
        <ul className={style.search}>
          <li>
            <label>活动日期</label>
            <DatePicker className="w150 radius2" onChange={this.changeFormEvent.bind(this, 'dateStart')} format="YYYY-MM-DD" />
            <DatePicker className="w150 ml10" onChange={this.changeFormEvent.bind(this, 'dateEnd')} format="YYYY-MM-DD" />
          </li>
          <li>
            <label>活动状态</label>
            <Select placeholder="请选择" defaultValue={search.postStatus} className="w180 select" onChange={this.changeFormEvent.bind(this, 'postStatus')}>
              <Option value="">请选择</Option>
              {
                window.common.postStatus.map((item, index) => (
                  <Option key={index} value={20 + index}>{item}</Option>
                ))
              }
            </Select>
          </li>
          <li>
            <label>活动名称</label>
            <Input className="w180" value={search.campaignName} onChange={this.changeFormEvent.bind(this, 'campaignName')} />
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
        />
      </div>
    );
  }
}
export default MyActivity;