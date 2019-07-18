import React, {Component} from 'react'
import {DatePicker, Table, Select, Input, Button, message} from 'antd'
import style from './style.less'
import Redirect from 'umi/redirect'
import moment from 'moment'
import {
  financeList
} from '../../../api/api'//接口地址
const {Option} = Select 
class ConsumeList extends Component{
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      depositData: [],
      pagination: {
        size: 'small',
        limit: 10, //每页显示多少条
        currentPage: 1,
        current: 1,
        total: 0,
        showSizeChanger: true,
        onChange: this.changePage,
        onShowSizeChange: this.onShowSizeChange
      },
      search: {
        dateStart: null,
        dateEnd: null,
        orderStatus: null,
        orderNo: null
      }
    }
  }
  async componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'))
    if (!loginInfo) return false
    await this.setState({loginName: loginInfo.data.loginName})
    this.loadList()
  }
  loadList = () => {
    const {search, pagination} = this.state
    const params = {
      loginName: this.state.loginName,
      currentPage: pagination.currentPage,
      limit: pagination.limit,
      ...search
    }
    financeList(params).then(rs => {
      if (rs.success) {
        const p = Object.assign(pagination, {total: rs.total})
        this.setState({depositData: rs.data, pagination: p})
      } else {
        message.error(rs.message)
      } 
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
  //改变每页条数事件
  onShowSizeChange = (current, size) => {
    let p = this.state.pagination
    p = Object.assign(p, {currentPage: current, limit: size})
    this.setState({pagination: p})
    this.loadList()
  }
  changeFormEvent = (type, e, value) => {
    let search = this.state.search
    let obj = {}
    switch (type) {
      case 'dateStart':
        obj = {[type]: value}
        break
      case 'dateEnd':
        obj = {[type]: value}
        break
      case 'orderNo':
        obj = {[type]: e.target.value}
        break
      case 'orderStatus':
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
      search, {
        dateStart: null,
        dateEnd: null,
        orderNo: null,
        orderStatus: null
      }
    )
    const pagination = Object.assign(this.state.pagination, {currentPage: 1, current: 1})
    this.setState({pagination, search})
    this.loadList()
  }
  render(){
    const {
      depositData,
      pagination,
      search,
      redirect
    } = this.state
    const columns = [
      {
        title: '操作时间',
        key: 'updateDate',
        dataIndex: 'updateDate',
        render: (record) => (
          <span>{window.common.getDate(record, true)}</span>
        )
      },
      {
        title: '项目',
        key: 'orderNo',
        render: (record) =>  (
          <div>
            <span>{record.campaignName}</span>
            <p>{record.appName}</p>
          </div>
        )
      },
      {
        title: '消费金额',
        key: 'orderAmt',
        dataIndex: 'orderAmt'
      },
      {
        title: '账户余额',
        key: 'campaignId',
        dataIndex: 'campaignId'
      }
    ]
    if (redirect) return (<Redirect to="/relogin" />)
    return(
      <div className={style.financialModel}>
        <ul className={style.search}>
          <li>
            创建时间
            <DatePicker className="w150 ml10" value={search.dateStart === null || search.dateStart === '' ? null : moment(search.dateStart)} formate="YYYY-MM-DD" onChange={this.changeFormEvent.bind(this, 'dateStart')} />
            <DatePicker className="ml10 w150" value={search.dateEnd === null || search.dateEnd === '' ? null : moment(search.dateEnd)} formate="YYYY-MM-DD" onChange={this.changeFormEvent.bind(this, 'dateEnd')} />
          </li>
          <li>
            <Button type="primary" onClick={this.searchEvent.bind(this)}>查询</Button>
            <Button className="ml10" onClick={this.clearEvent.bind(this)}>重置</Button>
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
export default ConsumeList