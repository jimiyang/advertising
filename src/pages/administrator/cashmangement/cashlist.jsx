import React, {Component} from 'react'
import {Button, Input, DatePicker, Select, Table, Modal, Popconfirm} from 'antd'
import Link from 'umi/link'
import moment from 'moment'
import style from '../style.less'
import {
  queryWithdrawManager
} from '../../../api/api'
const Option = Select.Option
class CashList extends Component{
  constructor(props) {
    super(props)
    this.state = {
      loginName: null,
      flowOfMainData: [],
      statusData: ['待审核', '驳回审核', '待支付', '成功', '付款失败'],
      isVisible: false,
      isPayVisible: false,
      search: {
        merchantName: null,
        merchantCode: null,
        orderNo: null,
        orderStatus: null,
        dateStart: null,
        dateEnd: null
      },
      pagination: {
        size: 'small',
        showSizeChanger: true,
        total: 0,
        currentPage: 1,
        limit: 10,
        current: 1,
        onChange: this.changePage,
        onShowSizeChange: this.onShowSizeChange
      }
    }
  }
  async componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'))
    await this.setState({loginName: loginInfo.data.loginName})
    this.loadList()
  }
  loadList = () => {
    const {loginName, search, pagination} = this.state
    const params = {
      loginName,
      currentPage: pagination.currentPage,
      limit: pagination.limit,
      ...search
    }
    queryWithdrawManager(params).then(rs => {
      const p = Object.assign(pagination, {total: rs.total})
      this.setState({flowOfMainData: rs.data})
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
  changeFormEvent = (type, e, value) => {
    let {search} = this.state
    let obj = {}
    switch(type) {
      case 'merchantName':
        obj = {[type]: e.target.value}
        break
      case 'merchantCode':
        obj = {[type]: e.target.value}
        break
      case 'orderNo':
        obj = {[type]: e.target.value}
        break
      case 'orderStatus':
        obj = {[type]: e}
        break
      case 'dateStart':
        obj = {[type]: value}
        break  
      case 'dateEnd':
        obj = {[type]: value}
        break 
    }
    search = Object.assign(search, obj)
    this.setState({search})
  }
  searchEvent = () => {
    const {pagination} = this.state
    const p = Object.assign(pagination, {currentPage: 1, current: 1})
    this.setState({pagination: p})
    this.loadList()
  }
  clearEvent = () => {
    let search = this.state.search
    search = Object.assign(
      search,
      {
        merchantName: null,
        merchantCode: null,
        orderNo: null,
        orderStatus: null,
        dateStart: null,
        dateEnd: null
      }
    )
    const {pagination} = this.state
    const p = Object.assign(pagination, {currentPage: 1, current: 1})
    this.setState({search, pagination: p})
    this.loadList()
  }
  closeEvent = () => {
    this.setState({
      isVisible: false,
      isPayVisible: false
    })
  }
  render() {
    const {
      flowOfMainData,
      pagination,
      statusData,
      search
    } = this.state
    const columns = [
      {
        title: '提现单号',
        key: 'orderNo',
        dataIndex: 'orderNo'
      },
      {
        title: '时间',
        key: 'applyTime',
        dataIndex: 'applyTime'
      },
      {
        title: (<div><p>商户名称</p><p>商户编码</p></div>),
        key: 'merchantName',
        render: (record) => (
          <div>
            <p>{record.merchantName}</p>
            <p>{record.merchantCode}</p>
          </div>
        )
      },
      {
        title: '商户类型',
        key: 'merchantType',
        dataIndex: 'merchantType',
        render: (record) => (
          <span>{record === 1 ? '广告主' : '流量主'}</span>
        )
      },
      {
        title: '申请金额',
        key: 'orderAmt',
        dataIndex: 'orderAmt'
      },
      {
        title: (<div><p>状态</p><p>操作</p></div>),
        key: 'orderStatus',
        render: (record) => (
          <div>
            <p>{statusData[record.orderStatus - 1]}</p>
            <div className="opeartion-items">
              {record.orderStatus === 1 ? <Link to={{pathname: '/main/cashdetail', state: {type: 'audit', orderNo: record.orderNo}}} className="blue-color">审核</Link> : null}
              {record.orderStatus === 3 ? 
                <Link to={{pathname: '/main/cashdetail', state: {type: 'pay', orderNo: record.orderNo}}} className="blue-color">付款</Link>
                : null
              }
              <Link to={{pathname: '/main/cashdetail', state: {type: 'detail', orderNo: record.orderNo}}} className="blue-color">详情</Link>
            </div>
          </div>
        )
      }
    ]
    return (
      <div>
        <h1 className="nav-title">提现管理</h1>
        <div className={style.administrator}>
          <div className={style.cash}>
            <ul className={style.search}>
              <li>商户名称：<Input className="iptxt" value={search.merchantName} onChange={this.changeFormEvent.bind(this, 'merchantName')} /></li>
              <li>商户编码：<Input value={search.merchantCode} onChange={this.changeFormEvent.bind(this, 'merchantCode')} /></li>
              <li>提现单号：<Input value={search.orderNo} onChange={this.changeFormEvent.bind(this, 'orderNo')} /></li>
              <li>提现状态：
                <Select value={search.orderStatus} onChange={this.changeFormEvent.bind(this, 'orderStatus')}>
                  <Option value={null}>请选择</Option>
                  {
                    statusData.map((item, index) => (
                      <Option key={index} value={index + 1}>{item}</Option>
                    ))
                  }
                </Select>
              </li>
              <li>提现时间：
                <DatePicker format="YYYY-MM-DD" value={search.dateStart === null || search.dateStart === '' ? null : moment(search.dateStart)} onChange={this.changeFormEvent.bind(this, 'dateStart')} />
                <DatePicker format="YYYY-MM-DD" value={search.dateEnd === null || search.dateEnd === '' ? null : moment(search.dateEnd)} className="ml10" onChange={this.changeFormEvent.bind(this, 'dateEnd')}/></li>
              <li>
                <Button type="primary" onClick={this.searchEvent.bind(this)}>查询</Button>
                <Button className="ml10" onClick={this.clearEvent.bind(this)}>清空</Button>
              </li>
            </ul>
            <Table
              dataSource={flowOfMainData}
              columns={columns}
              pagination={pagination}
              rowKey={record => record.id}
              className="table"
            />
          </div>
        </div>
      </div>
    )
  }
}
export default CashList