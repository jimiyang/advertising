import React, {Component} from 'react'
import {DatePicker, Select, Input, Button, Table, message, Popconfirm} from 'antd'
import style from '../style.less'
import Link from 'umi/link'
import moment from 'moment'
import {
  checkAdCampaignList,
  getAdCampaignCountByPostStatus,
  updatePostStatusById
} from '../../../api/api'
const Option = Select.Option
class ActivityList extends Component{
  constructor(props) {
    super(props)
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
        current: 1,
        total: 0,
        showQuickJumper: true,
        showSizeChanger: true,
        onChange: this.changePage,
        onShowSizeChange: this.onShowSizeChange
      },
      activityData: [],
      activityTotal: 0, //活动总数
      draftTotal: 0 //未投放活动
    }
  }
  async componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'))
    if (!loginInfo) return false
    //因为setState是异步的，他会在render后才生效,加入一个回调函数
    await this.setState({loginName: loginInfo.data.loginName})
    this.loadList()
    this.getAdCount()
  }
  loadList = () => {
   let {loginName, pagination, search} = this.state
   const params = {
    loginName,
    currentPage: pagination.currentPage,
    limit: pagination.limit,
    ...search
   }
   checkAdCampaignList(params).then(rs => {
      const p = Object.assign(pagination, {total: rs.total})
      this.setState({activityData: rs.data, pagination: p})
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
  //获取活动统计数
  getAdCount = () => {
    getAdCampaignCountByPostStatus({loginName: this.state.loginName}).then(rs => {
      this.setState({activityTotal: rs.data.total, draftTotal: rs.data.draftTotal})
    })
  }
  changeFormEvent = (type, e, value) => {
    let search = this.state.search
    let obj = {}
    switch(type) {
      case 'dateStart':
        obj = {[type]: value}
        break
      case 'dateEnd':
        obj = {[type]: value}
        break
      case 'postStatus':
        obj = {[type]: e}
        break
      case 'campaignName':
        obj = {[type]: e.target.value}
        break
      default:
        obj = {[type]: e}
        break
    }
    search = Object.assign(search, obj)
    this.setState({search})
  }
  searchEvent = () => {
    const pagination = Object.assign(this.state.pagination, {currentPage: 1, current: 1})
    this.setState({pagination})
    this.loadList()
  }
  clearEvent = () => {
    let search = this.state.search
    search = Object.assign(
      search,
      {
        dateStart: null,
        dateEnd: null,
        postStatus: null,
        campaignName: null
      }
    )
    const pagination = Object.assign(this.state.pagination, {currentPage: 1, current: 1})
    this.setState({search, pagination})
    this.loadList()
  }
  //取消
  cancelActivityEvent = (item) => {
    const params = {
      id: item.id,
      loginName: this.state.loginName,
      postStatus: 25
    }
    updatePostStatusById(params).then(rs => {
      message.success(rs.message)
      this.loadList()
    })
  }
  render() {
    const {
      search,
      activityData,
      pagination,
      activityTotal,
      draftTotal
    } = this.state
    const columns = [
      {
        title: '活动ID',
        key: 'campaignId',
        dataIndex: 'campaignId'
      },
      {
        title: <div><p>广告主商户</p></div>,
        key: 'merchantCode',
        render: (record) => (
          <div>
            <p>{record.merchantCode}</p>
          </div>
        )
      },
      {
        title: (<div><p>活动名称</p><p>活动日期</p></div>),
        key: 'campaignName',
        render: (record) => (
          <div>
            <p className="txthide" title={record.campaignName}>{record.campaignName}</p>
            <p>{window.common.getDate(record.dateStart, false)}-{window.common.getDate(record.dateEnd, false)}</p>
          </div>
        )
      },
      {
        title: <div><p>活动预算</p><p>阅读单价</p><p>任务阅读数</p></div>,
        key: 'postAmtTotal',
        render: (record) => (
          <div>
            <p>{record.postAmtTotal}</p>
            <p>{record.unitPrice}</p>
            <p>{Math.round(record.postAmtTotal / record.unitPrice)}</p>
          </div>
        )
      },
      {
        title: <div><p>活动状态</p><p>操作</p></div>,
        key: 'postStatus',
        render: (record) => (
          <div>
            <span>{window.common.postStatus[Number(record.postStatus) - 20]}</span>
            <div className="opeartion-items">
              <Link to={{pathname: '/main/viewdetail', state: {id: record.id, type: 0}}}>查看</Link>
              {record.postStatus === 21 ? <Link className="blue-color ml10" to={{pathname: '/main/viewdetail', state: {id: record.id, type: 1}}}>审核</Link> : null}
              {record.postStatus === 23 ? 
                <Popconfirm
                  title="是否要取消此活动?"
                  onConfirm={this.cancelActivityEvent.bind(this, record)}
                  okText="是"
                  cancelText="否"
                >
                  <span className="ml10">取消</span>
                </Popconfirm> : null}
            </div>
          </div>
        )
      }
    ]
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
            <DatePicker className="ml10" value={search.dateStart === null || search.dateStart === '' ? null : moment(search.dateStart)} format="YYYY-MM-DD" onChange={this.changeFormEvent.bind(this, 'dateStart')} />
            <DatePicker className="ml10" value={search.dateEnd === null || search.dateEnd === '' ? null : moment(search.dateEnd)} format="YYYY-MM-DD" onChange={this.changeFormEvent.bind(this, 'dateEnd')} />
          </li>
          <li>
            活动状态
            <Select className="ml10" value={search.postStatus} onChange={this.changeFormEvent.bind(this, 'postStatus')}>
              <Option value={null}>请选择</Option>
              {
                window.common.postStatus.map((item, index) => (
                  <Option key={index} value={index + 20}>{item}</Option>
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
            <Button className="ml10" onClick={this.clearEvent.bind(this)}>清空</Button>
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
    )
  }
}
export default ActivityList