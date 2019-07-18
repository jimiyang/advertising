import React, {Component} from 'react'
import {DatePicker, Table, Select, Input, Button, message, Popconfirm} from 'antd'
import Link from 'umi/link'
import {
  missionList
} from '../../../api/api'//接口地址
import style from './style.less'
import moment from 'moment'

const {Option} = Select
class HavedTask extends Component{
  constructor(props) {
    super(props)
    this.state = {
      loginName: '',
      orderData: [],
      search: {
        dateStart: null,
        dateEnd: null,
        missionStatus: null, //订单状态
        campaignName: null, //活动名称
        missionId: null, //订单号
        appArticlePosition: null //广告位置
      },
      pagination: {
        size: 'small',
        showSizeChanger: true,
        total: 0,
        currentPage: 1,
        current: 1,
        limit: 10,
        pageSize: 10,
        onChange: this.changePage,
        onShowSizeChange: this.onShowSizeChange
      }
    }
  }
  async componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'))
    if (!loginInfo) return false
    //因为setState是异步的，他会在render后才生效,加入一个回调函数
    await this.setState({loginName: loginInfo.data.loginName})
    this.loadList()
  }
  loadList = () => {
    const {pagination, search} = this.state
    const params = {
      loginName: this.state.loginName,
      currentPage: pagination.currentPage,
      limit: pagination.limit,
      ...search
    }
    missionList(params).then(rs => {
      const p = Object.assign(pagination, {total: rs.total})
      this.setState({orderData: rs.data, pagination: p})
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
    p = Object.assign(p, {currentPage: current, current, limit: size, pageSize: size})
    this.setState({pagination: p})
    this.loadList()
  }
  changeFormEvent = (type, e, value2) => {
    let search = this.state.search
    let obj = {}
    switch(type) {
      case 'dateStart':
        obj = {[type]: value2}
        break
      case 'dateEnd':
        obj = {[type]: value2}
        break
      case 'missionStatus':
        obj = {[type]: e}
        break
      case 'appArticlePosition':
        obj = {[type]: e}
        break
      case 'campaignName':
        obj = {[type]: e.target.value}
        break
      case 'missionId':
        obj = {[type]: e.target.value}
        break
      default:
        break
    }
    search = Object.assign(search, obj)
    this.setState({search})
  }
  //搜索
  searchEvent = () => {
    const pagination = Object.assign(this.state.pagination, {currentPage: 1, current: 1})
    this.setState({pagination})
    this.loadList()
  }
  clearEvent = () => {
    let search = this.state.search
    search = Object.assign(
      search, {
        missionStatus: null,
        campaignName: null,
        missionId: null,
        appArticlePosition: null,
        dateStart: null,
        dateEnd: null
      }
    )
    const pagination = Object.assign(this.state.pagination, {currentPage: 1, current: 1})
    this.setState({pagination, search})
    this.loadList()
  }
  render() {
    const {
      orderData,
      search,
      pagination
    } = this.state
    const columns = [
      {
        title: '任务ID',
        key: 'missionId',
        dataIndex: 'missionId',
      },
      {
        title: (<div><p>活动名称</p><p>活动时间</p></div>),
        key: 'createDates',
        render: (record) => (
          <div>
            <p>{record.campaignName}</p>
            <p>{window.common.getDate(record.dateStart, false)}-{window.common.getDate(record.dateEnd, false)}</p>
            
          </div>
        )
      },
      {
        title: (<div>接单公众号<p>广告位置</p></div>),
        key: 'appNickName',
        render: (record) => (
          <div>
            <p>{record.appNickName}</p>
            <p>{window.common.advertLocal[record.appArticlePosition - 1]}</p>
          </div>
        )
      },
      {
        title: (<div><p>接单阅读量</p><p>实际阅读量</p></div>),
        key: 'missionReadCnt',
        render: (record) => (
          <div>
            <p>{record.missionReadCnt === undefined ? '--' : record.missionReadCnt}</p>
            <p>{record.missionRealReadCnt === undefined ? '--' : record.missionRealReadCnt}</p>
          </div>
        )
      },
      {
        title: (<div><p>CPC单价</p><p>预计支出</p></div>),
        key: 'adUnitPrice',
        render: (record) => (
          <div>
            <p>{record.adUnitPrice}</p>
            <p>{record.adEstimateCost}</p>
          </div>
        )
      },
      {
        title: (<div><p>任务状态</p><p>操作</p></div>),
        key: 'missionStatus',
        render: (record) => (
          <div>
            <span>{window.common.orderStatus[record.missionStatus - 10]}</span>
            <div className="opeartion-items">
              <Link className="blue-color" to={{pathname: '/main/advertdetail', state: {id: record.id, type: 1}}}>查看任务</Link>
              {
                record.missionStatus === 10 ? 
                  <Link className="blue-color ml10" to={{pathname: '/main/advertdetail', state: {id: record.id, type: 1}}}>审核接单</Link> : null
              }
            </div>
          </div>
        )
      }
    ]
    return(
      <div className={style.task}>
        <h1 className="nav-title">已接单任务</h1>
        <dl className={style.search}>
          <dt style={{width: '100%'}}>
            接单时间：
            <DatePicker className="ml10" value={search.dateStart === null || search.dateStart === '' ? null : moment(search.dateStart)} format="YYYY-MM-DD" onChange={this.changeFormEvent.bind(this, 'dateStart')} />
            <DatePicker className="ml10" value={search.dateEnd === null || search.dateEnd === '' ? null : moment(search.dateEnd)} format="YYYY-MM-DD" onChange={this.changeFormEvent.bind(this, 'dateEnd')} />   
          </dt>
          <dd>
            任务状态：
            <Select value={search.missionStatus} onChange={this.changeFormEvent.bind(this, 'missionStatus')} className="w180 ml10">
              <Option value={null}>全部</Option>
              {
                window.common.orderStatus.map((item, index) => (<Option key={index} value={index + 10}>{item}</Option>))
              }
            </Select>
          </dd>
          <dd>
            广告位置：
            <Select value={search.appArticlePosition} onChange={this.changeFormEvent.bind(this, 'appArticlePosition')} className="w180 ml10">
              <Option value={null}>全部</Option>
              {
                window.common.advertLocal.map((item, index) => (<Option key={index} value={index + 1}>{item}</Option>))
              }
            </Select>
          </dd>
          <dd>
            任务号：<Input className="w180 ml10" value={search.missionId} onChange={this.changeFormEvent.bind(this, 'missionId')} />
          </dd>
          <dd>
            活动名称：<Input className="w180 ml10" value={search.campaignName} onChange={this.changeFormEvent.bind(this, 'campaignName')} />
          </dd>
          <dd>
            <Button type="primary" onClick={this.searchEvent.bind(this)}>查询</Button>
            <Button className="ml10" onClick={this.clearEvent.bind(this)}>重置</Button>
          </dd>
        </dl>
        <Table
          dataSource={orderData}
          columns={columns}
          pagination={pagination}
          rowKey={record => record.id}
          className="table"
        />
      </div>  
    )
  }
}
export default HavedTask