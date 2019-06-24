import React, {Component} from 'react';
import {DatePicker, Select, Input, Button, Table, message} from 'antd';
import Redirect from 'umi/redirect';
import style from '../style.less';
const Option = Select.Option;
class ActivityList extends Component{
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
        showQuickJumper: true,
        showSizeChanger: true,
        onChange: this.changePage,
        onShowSizeChange: this.onShowSizeChange
      },
      activityData: [],
      activityTotal: 0, //活动总数
      draftTotal: 0 //未投放活动
    };
  }
  async componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
    if (!loginInfo) return false;
    //因为setState是异步的，他会在render后才生效,加入一个回调函数
    await this.setState({loginName: loginInfo.data.loginName});
    this.loadList();
    this.getAdCount();
  }
  loadList = () => {
   let {loginName, pagination, search} = this.state;
   const params = {
    loginName,
    currentPage: pagination.currentPage,
    limit: pagination.limit,
    ...search
   };
   window.api.baseInstance('api/ad/campaign/checkAdCampaignList', params).then(rs => {
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
  //获取任务统计数
  getAdCount = () => {
    window.api.baseInstance('api/ad/campaign/getAdCampaignCountByPostStatus', {loginName: this.state.loginName}).then(rs => {
      //console.log(rs);
      this.setState({activityTotal: rs.data.total, draftTotal: rs.data.draftTotal});
    });
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
      pagination,
      activityTotal,
      draftTotal
    } = this.state;
    const columns = [
      {
        title: '序号',
        key: 'id',
        dataIndex: 'id',
        width: 100,
        fixed: 'left'
      },
      {
        title: '活动周期',
        width: 200,
        fixed: 'left',
        render: (record) => (
          <span>{record.dateStart}-{record.dateEnd}</span>
        )
      },
      {
        title: '广告主账户',
        key: 'merchantCode',
        dataIndex: 'merchantCode',
        width: 150,
        fixed: 'left'
      },
      {
        title: '活动名称',
        key: 'campaignName',
        dataIndex: 'campaignName',
        width: 150
      },
      {
        title: '活动预算',
        key: 'postAmtTotal',
        dataIndex: 'postAmtTotal',
        width: 150
      },
      {
        title: '阅读单价',
        key: 'unitPrice',
        dataIndex: 'unitPrice',
        width: 150
      },
      {
        title: '任务阅读数',
        width: 150,
        render: (record) => (
          <span>{Math.round(record.postAmtTotal / record.unitPrice)}</span>
        )
      },
      {
        title: '已认领比例',
        key: '',
        dataIndex: '',
        width: 150
      },
      {
        title: '已发布文章',
        key: '',
        dataIndex: '',
        width: 150
      },
      {
        title: '距离任务开始',
        key: '',
        dataIndex: '',
        width: 150
      },
      {
        title: '已消耗',
        key: '',
        dataIndex: '',
        width: 200
      },
      {
        title: '活动状态',
        key: 'postStatus',
        dataIndex: 'postStatus',
        width: 150,
        render: (record) => (
          <span>{window.common.postStatus[Number(record) - 20]}</span>
        )
      },
      {
        title: '操作',
        width: 250,
        render: (record) => (
          <div className="opeartion-items">
            <span>查看</span>
            <span>编辑</span>
            <span>取消</span>
          </div>
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
              <h1>活动总数</h1>
              {activityTotal}
            </div>
            <div className={style.lockAmount}>
              <h1>未投放活动(状态:活动草稿)</h1>
              {draftTotal}
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
              <Option value={21}>审核中</Option>
              <Option value={22}>审核驳回</Option>
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
          scroll={{x: 2000}}
        />
      </div>
    );
  }
};
export default ActivityList;