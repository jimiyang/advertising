import React, {Component} from 'react'
import {Button, Table, message, Select} from 'antd'
import Redirect from 'umi/redirect'
import Link from 'umi/link'
import style from './style.less'
import {
  flowMissionList,
  listApps
} from '../../../api/api'
const Option = Select.Option
class AdTask extends Component{
  constructor(props) {
    super(props)
    this.state = {
      redirect: '',
      loginName: '',
      pubAccountData: [],
      appsData: [], //公众号列表
      status: null,
      search: {
        appId: null,
        missionStatus: null
      },
      pagination: {
        size: 'small',
        showSizeChanger: true,
        total: 0,
        currentPage: 1,
        current: 1,
        limit: 10,
        onChange: this.changePage,
        onShowSizeChange: this.onShowSizeChange
      }
    }
  }
  async componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'))
    if (!loginInfo) return false
    await this.setState({loginName: loginInfo.data.loginName})
    this.loadList()
    this.getListApps(loginInfo.data.loginName)
  }
  loadList = () => {
    const {loginName, pagination, search} = this.state
    const params = {
      currentPage: pagination.currentPage,
      limit: pagination.limit,
      loginName,
      ...search
    }
    flowMissionList(params).then(rs => {
      const p = Object.assign(pagination, {total: rs.total})
      this.setState({pubAccountData: rs.data, pagination: p})
    })
  }
  changePage = (page) => {
    page = page === 0 ? 1 : page
    const pagination = Object.assign(this.state.pagination, {currentPage: page, current: page})
    this.setState({pagination})
    this.loadList()
  }
  //改变每页条数事件
  onShowSizeChange = (current, size) => {
    let p = this.state.pagination
    p = Object.assign(p, {currentPage: current, current, limit: size})
    this.setState({pagination: p})
    this.loadList()
  }
  //查询所有公众号
  getListApps = (loginName) => {
    listApps({loginName}).then(rs => {
      const appsData = rs.data === undefined ? [] : rs.data
      this.setState({appsData})
    })
  }
  changeFormEvent = (type, e) => {
    let search = this.state.search
    let value
    if (type === 'missionStatus') {
      value = Number(e) + 10
      this.setState({status: e})
    } else {
      value = e
    }
    search = Object.assign(search, {[type]: value})
    this.setState({search})
  }
  searchEvent = () => {
    const pagination = Object.assign(this.state.pagination, {currentPage: 1, current: 1})
    this.setState(pagination)
    this.loadList()
  }
  clearEvent = () => {
    let search = this.state.search
    search = Object.assign(
      search,
      {
        appId: null,
        missionStatus: null
      }
    )
    const pagination = Object.assign(this.state.pagination, {currentPage: 1, current: 1})
    this.setState({search, status: null, pagination})
    this.loadList()
  }
  render() {
    const {
      redirect,
      pubAccountData,
      appsData,
      search,
      pagination,
      status
    } = this.state
    const columns = [
      {
        title: '订单号',
        key: 'missionId',
        dataIndex: 'missionId'
      },
      {
        title: (<div><p>公众号</p><p>位置</p></div>),
        key: 'appNickName',
        render: (record) => (
          <div>
            <p>{record.appNickName}</p>
            <p>{window.common.advertLocal[record.appArticlePosition - 1]}</p>
          </div>
        )
      },
      {
        title: (<div><p>活动标题</p><p>时间</p></div>),
        key: 'campaignName',
        render: (record) => (
          <div>
            <p className="txthide">{record.campaignName}</p>
            <p>{record.createDate}</p>
          </div>
        )
      },
      {
        title: (<div><p>预计发文时间</p><p>实际发文时间</p></div>),
        render: (record) => (
          <div>
            <p>{window.common.getDate(record.planPostArticleTime)}</p>
            <p>{record.realPostArticleTime !== undefined ? window.common.getDate(record.realPostArticleTime, true) : '--'}</p>
          </div>
        )
      },
      {
        title: 'CPC单价',
        key: 'flowUnitPrice',
        dataIndex: 'flowUnitPrice',
        render: (record) => (
          <span>{record !== undefined ? window.common.formatNumber(record) : '--'}</span>
        )
      },
      {
        title: (<div><p>接单数阅读数</p><p>实际阅读数</p></div>),
        key: 'missionReadCnt',
        render: (record) => (
          <div>
            <p>{record !== undefined ? window.common.formatNumber(record.missionReadCnt) : '--'}</p>
            <p>{record.missionRealReadCnt === null ? '--' : record.missionRealReadCnt}</p>
          </div>
        )
      },
      
      {
        title: (<div><p>预计收入</p><p>实际收入</p></div>),
        key: 'flowEstimateIncome',
        render: (record) => (
          <div>
            <p>{record !== undefined ? (record.missionReadCnt * record.flowUnitPrice).toFixed(2) : '--'}</p>
            <p>{record.missionStatus === 14 ? (record.flowUnitPrice * record.missionRealReadCnt).toFixed(2) : '--'}</p>
          </div>
        )
      },
      {
        title: (<div><p>订单状态</p><p>操作</p></div>),
        key: 'missionStatus',
        render: (record) => (
          <div>
            <p>{window.common.orderStatus[record.missionStatus - 10]}</p>
            <div className="opeartion-items">
              <Link to={{pathname: '/main/adtaskdetail', state: {id: record.campaignId}}} className="ml10 blue-color">查看</Link>
            </div>
          </div>
        )
      }
    ]
    if (redirect) return (<Redirect to="/relogin" />)
    return(
      <div className={style.pubAccount}>
        <h1 className="nav-title">接单赚钱 > 已接任务</h1>
        <ul className={style.search}>
          <li>
            请选择公众号
            <Select value={search.appId} className="w180 ml10" onChange={this.changeFormEvent.bind(this, 'appId')}>
              <Option value={null}>请选择</Option>
              {
                appsData.length !== 0 ? 
                  appsData.map((item, index) => (
                    <Option key={index} value={item.appId}>{item.appNickName}</Option>
                  )) : null
              }
            </Select>
          </li>
          <li>
            接单状态
            <Select value={status} className="w180 ml10" onChange={this.changeFormEvent.bind(this, 'missionStatus')}>
              <Option value={null}>请选择</Option>
              {
                window.common.orderStatus.map((item, index) => (
                  <Option key={index} value={index}>{item}</Option>
                ))
              }
            </Select>
          </li>
          <li>
            <Button type="primary" onClick={this.searchEvent.bind(this)}>查询</Button>
            <Button onClick={this.clearEvent.bind(this)} className="ml10">重置</Button>
          </li>
        </ul>
        <Table 
          dataSource={pubAccountData}
          columns={columns}
          pagination={pagination}
          rowKey={record => record.id}
          className="table"
        />
      </div>
    )
  }
}
export default AdTask