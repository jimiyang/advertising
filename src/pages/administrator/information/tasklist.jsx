import React, {Component} from 'react';
import {DatePicker, Select, Input, Button, Table, message, Checkbox, Popconfirm, notification} from 'antd';
import Redirect from 'umi/redirect';
import style from '../style.less';
import moment from 'moment';
import {
  listallMission,
  settleCampaign
} from '../../../api/api';
const Option = Select.Option;
let rowKeys = [];
class TaskList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      loginName: null,  
      search: {
        dateStart: null,
        dateEnd: null,
        missionStatus: null,
        campaignName: null
      },
      pagination: {
        size: 'small',
        limit: 10, //每页显示多少条
        currentPage: 1,
        total: 0,
        showSizeChanger: true,
        onChange: this.changePage,
        onShowSizeChange: this.onShowSizeChange
      },
      activityData: [],
      selectedRowKeys: [],
      allchk: false,
      ischecked: [],
      isDisabled: false,
      isSubmit: false
    };
  }
  async componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
    if (!loginInfo) return false;
    //因为setState是异步的，他会在render后才生效,加入一个回调函数
    await this.setState({loginName: loginInfo.data.loginName});
    this.loadList();
  }
  loadList = () => {
   let {loginName, pagination, search} = this.state;
   const params = {
    loginName,
    currentPage: pagination.currentPage,
    limit: pagination.limit,
    ...search
   };
   
   listallMission(params).then(rs => {
      const p = Object.assign(pagination, {total: rs.total});
      const data = rs.data === undefined ? [] : rs.data;
      //const rowKeys = this.getSettleData(data);
      this.setState({activityData: data, pagination: p});
   });
  }
  getSettleData = (data) => {
    let arr = [];
    if (data !== undefined || data.length !== 0) {
      data.map((item) => {
        if (item.missionStatus === 13) {
          arr.push(item);
        }
      });
    }
    return arr;
  } 
  changePage = (page) => {
    page = page === 0 ? 1 : page;
    const pagination = Object.assign(this.state.pagination, {currentPage: page});
    this.setState({pagination, ischecked: false, allchk: false});
    this.loadList();
  }
  //改变每页条数事件
  onShowSizeChange = (current, size) => {
    let p = this.state.pagination;
    p = Object.assign(p, {currentPage: current, limit: size});
    this.setState({pagination: p, ischecked: false, allchk: false});
    this.loadList();
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
      case 'missionStatus':
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
    const pagination = Object.assign(this.state.pagination, {currentPage: 1});
    this.setState({pagination});
    this.loadList();
  }
  clearEvent = () => {
    let search = this.state.search;
    search = Object.assign(
      search,
      {
        dateStart: null,
        dateEnd: null,
        missionStatus: null,
        campaignName: null
      }
    );
    const pagination = Object.assign(this.state.pagination, {currentPage: 1});
    this.setState({search, pagination});
    this.loadList();
  }
  //全选反选
  onSelectChange = (e) => {
    let {activityData} = this.state;
    let rowKeys = [];
    if (e.target.checked === true) {
      rowKeys =  this.getSettleData(activityData);
    } else {
      rowKeys = [];
    }
    this.setState({allchk: e.target.checked, ischecked: e.target.checked, selectedRowKeys: rowKeys});
  }
  openNotification = (str)=>{
    //使用notification.success()弹出一个通知提醒框 
    notification.info({
      message:"结算状态",
      description: (str),
      duration: 10, //1秒
    }); 
  }
  //单条结算
  settleEvent = (item) => {
    const loginName = this.state.loginName;
    const params = {
      settleMissions: [
        {
          missionId: item.missionId,
          settleReadCnt: item.settleReadCnt
        }
      ],
      loginName
    };
    this.setState({isSubmit: true});
    if (this.state.isSubmit === true) {
      message.error('请勿重复结算!');
      return false;
    }
    settleCampaign(params).then(rs => {
      let color='';
      let msg;
      if(rs.data[0].code === 1) {
        color = 'red-color';
        msg = '结算失败';
      } else {
        color = 'green-color';
        msg = rs.data[0].data;
      }
      this.openNotification(<div><p className={`${color}`}>{msg}</p></div>);
      const pagination = Object.assign(this.state.pagination, {currentPage: 1});
      this.setState({pagination, isSubmit: false});
      this.loadList();
    });
  }
  singleEvent = (item, index, e) => {
    let ischecked = this.state.ischecked;
    if (e.target.checked === true) {
      rowKeys[index] = item;
      ischecked[index] = true;
    } else {
      rowKeys.splice(index, 1);
      ischecked[index] = false;
    }
    this.setState({ischecked, selectedRowKeys: rowKeys});
  }
  //批量结算
  batchSettleEvent = () => {
    let {selectedRowKeys, loginName} = this.state;
    let settleMissions = [];
    selectedRowKeys.map((item) => {
      settleMissions.push({missionId: item.missionId, settleReadCnt: item.settleReadCnt, title: item.adCampaign.advertiserName});
    });
    if (selectedRowKeys.length === 0) {
      message.error('请选择需要结算的数据');
      return false;
    }
    this.setState({isDisabled: true});
    const params = {
      loginName,
      settleMissions
    };
    console.log(params);
    let arr = [];
    settleCampaign(params).then(rs => {
      this.setState({isDisabled: false});
      rs.data.map((item, index) => {
        if (item.data === undefined) {
          arr.push(<p key={index}>结算失败</p>);
        } else {
          arr.push(<p key={index}>{item.data}</p>);
        }
      });
      this.openNotification(<div>{arr}</div>);
      const pagination = Object.assign(this.state.pagination, {currentPage: 1});
      this.setState({pagination});
      this.loadList();
    });
  }
  render() {
    const {
      search,
      activityData,
      pagination,
      allchk,
      ischecked,
      selectedRowKeys,
      isDisabled
    } = this.state;
    const columns = [
      {
        title: (<div>{<Checkbox checked={allchk} onChange={this.onSelectChange.bind(this)}/>}</div>),
        key: 'status',
        render: (text, record, index) => (
          <div>
            <p>{record.id}</p>
            {record.missionStatus === 13 ? <Checkbox checked={ischecked[index]} onChange={this.singleEvent.bind(this, record, index)} /> : null}
          </div>
        )
      },
      {
        title: (<div><p>活动名称</p><p>活动时间</p><p>广告主名称</p></div>),
        key: 'campaignName',
        width: 400,
        render: (record) => (
          <div>
            <p>{record.campaignName}</p>
            <p>{record.adCampaign.dateStart !== undefined ? window.common.getDate(record.adCampaign.dateStart) : '--'}至{record.adCampaign.dateEnd !== undefined ? window.common.getDate(record.adCampaign.dateEnd) : '--'}</p>
            <p>{record.adCampaign.advertiserName === undefined ? '--' : record.adCampaign.advertiserName}</p>
          </div>
        )
      },
      {
        title: (<div><p>公众号名称</p><p>广告位置</p><p>流量主名称</p></div>),
        key: 'appNickName',
        width: 300,
        render: (record) => (
          <div>
            <p>{record.appNickName}</p>
            <p>{window.common.advertLocal[record.appArticlePosition]}</p>
            <p>{record.flowMerchantName}</p>
          </div>
        )
      },
      {
        title: (<div><p>活动cpc单价</p><p>任务cpc单价</p></div>),
        key: 'adUnitPrice',
        width: 200,
        render: (record) => (
          <div>
            <p>{record.adUnitPrice}</p>
            <p>{record.flowUnitPrice}</p>
          </div>
        )
      },
      {
        title: (<div><p>接单时间</p><p>预计发文时间</p><p>实际发文时间</p></div>),
        key: 'createDate',
        width: 300,
        render: (record) => (
          <div>
            <p>{record.createDate !== undefined ? window.common.getDate(record.createDate, true) : '--'}</p>
            <p>{record.planPostArticleTime !== undefined ? window.common.getDate(record.planPostArticleTime, true) : '--'}</p>
            <p>{record.realPostArticleTime !== undefined ? window.common.getDate(record.realPostArticleTime, true) : '--'}</p>
          </div>
        )
      },
      {
        title: (<div><p>接单阅读量</p><p>实际完成阅读量</p></div>),
        key: 'missionReadCnt',
        width: 200,
        render: (record) => (
          <div>
            <p>{record.missionReadCnt}</p>
            <p>{record.missionRealReadCnt}</p>
          </div>
        )
      },
      {
        title: '结算阅读量',
        key: 'settleReadCnt',
        dataIndex: 'settleReadCnt',
        width: 200,
        render: (record) => (
          <Input disabled={true} value={record} style={{width: '80px', textAlign: 'center'}} />
        )
      },
      {
        title: (<div><p>广告主支出</p><p>流量主收入</p></div>),
        key: 'adEstimateCost',
        width: 200,
        render: (record) => (
          <div>
            <p>{record.adCost}</p>
            <p>{record.flowIncome}</p>
          </div>
        )
      },
      {
        title: '平台利润',
        key: 'tmProfit',
        dataIndex: 'tmProfit',
        width: 200
      },
      {
        title: '任务状态',
        key: 'missionStatus',
        width: 200,
        render: (record) => (
          <div>
            <span>{window.common.orderStatus[Number(record.missionStatus) - 10]}</span>
            {record.missionStatus === 13 ?
              <Popconfirm
                title="是否要结算此任务?"
                onConfirm={this.settleEvent.bind(this, record)}
                okText="是"
                cancelText="否"
              >
                <span className="blue-color ml10">结算</span> 
              </Popconfirm>
              : null
            }
          </div>
        )
      }
    ];
    return(
      <div className={style.administrator}>
        <h1 className="nav-title">活动管理</h1>
        <div className={style.accountAmount}>
          <div>
            <div className={style.accountItems}>
              <h1>任务总数</h1>
              {pagination.total}
            </div>
            <div className={style.lockAmount}>
              <h1>未投放任务</h1>
              0
            </div>
          </div>
        </div>
        <ul className={style.search}>
          <li>
            任务时间
            <DatePicker className="ml10" value={search.dateStart === null || search.dateStart === '' ? null : moment(search.dateStart)} format="YYYY-MM-DD" onChange={this.changeFormEvent.bind(this, 'dateStart')} />
            <DatePicker className="ml10" value={search.dateEnd === null || search.dateEnd === '' ? null : moment(search.dateEnd)} format="YYYY-MM-DD" onChange={this.changeFormEvent.bind(this, 'dateEnd')} />
          </li>
          <li>
            任务状态
            <Select className="ml10" value={search.missionStatus} onChange={this.changeFormEvent.bind(this, 'missionStatus')}>
              <Option value={null}>请选择</Option>
              {
                window.common.orderStatus.map((item, index) => (
                  <Option key={index} value={index + 10}>{item}</Option>
                ))
              }
            </Select>
          </li>
          <li>
            活动名称
            <Input className="ml10" value={search.campaignName} onChange={this.changeFormEvent.bind(this, 'campaignName')} />
          </li>
          <li>
            <Button type="primary" onClick={this.searchEvent.bind(this)}>查询</Button>
            <Button className="ml10" onClick={this.clearEvent.bind(this)}>重置</Button>
          </li>
        </ul>
        <div className={style.all}><Button type="primary" disabled={isDisabled} onClick={this.batchSettleEvent.bind(this)}>批量结算</Button></div>
        <Table
          dataSource={activityData}
          columns={columns}
          pagination={pagination}
          rowKey={record => record.id}
          scroll={{x: 1500}}
          className="table"
        />
      </div>
    );
  }
};
export default TaskList;