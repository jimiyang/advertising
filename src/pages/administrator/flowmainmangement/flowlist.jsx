import React, {Component} from 'react'
import {Table, Input, Button, Select, message} from 'antd'
import style from '../style.less'
import AddFlowMain from '../../components/addflowmain' //添加流量主
import {
  merchantList,
  merchantEdit,
  employeeEdit,
  merchantAdd
} from '../../../api/api'
const Option = Select.Option
class FlowList extends Component{
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      adData: [],
      operatorLoginName: '',
      isAddVisible: false,
      search: {
        merchantName: null,
        merchantCode: null,
        status: null,
        type: 2 //流量主类型
      },
      pagination: {
        size: 'small',
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
        currentPage: 1,
        current: 1,
        limit: 10,
        onChange: this.changePage,
        onShowSizeChange: this.onShowSizeChange
      },
      addForm: {
        merchantName: null,
        contactName: null,
        mobile: null,
        loginName: null,
        password: null
      }
    }
  }
  async componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'))
    if (!loginInfo) return false
    await this.setState({operatorLoginName: loginInfo.data.loginName})
    this.loadList()
  }
  loadList = () => {
    const {operatorLoginName, pagination, search} = this.state
    const params = {
      operatorLoginName,
      currentPage: pagination.currentPage,
      limit: pagination.limit,
      ...search
    }
    merchantList(params).then(rs => {
      const p = Object.assign(pagination, {total: rs.total})
      this.setState({adData: rs.data, pagination: p})
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
  changeFormEvent = (type, e) => {
    let search = this.state.search
    let obj = {}
    switch(type) {
      case 'merchantName':
        obj = {[type]: e.target.value}
        break
      case 'merchantCode':
        obj = {[type]: e.target.value}
        break
      case 'status':
        obj = {[type]: e}
        break
      default:
        obj = {[type]: e.target.value}
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
      search,
      {
        merchantName: null,
        merchantCode: null,
        status: null
      }
    )
    const pagination = Object.assign(this.state.pagination, {currentPage: 1, current: 1})
    this.setState({pagination, search})
    this.loadList()
  }
  resetPwdEvent = (item) => {
    const operatorLoginName = this.state.operatorLoginName
    const params = {
      password: '111qqq',
      employeeId: item.employeeId,
      operatorLoginName
    }
    employeeEdit(params).then(rs => {
      message.success(rs.message)
      this.loadList()
    })
  }
  statusEvent = (item) => {
    const status = item.status === 1 ? 2 : 1 //1启用，2停用
    const params = {
      status,
      id: item.id,
      merchantId: item.merchantId,
      operatorLoginName: this.state.operatorLoginName
    }
    merchantEdit(params).then(rs => {
      message.success(rs.message)
      this.loadList()
    })
  }
  //添加流量主
  addEvent = () => {
    this.setState({isAddVisible: true})
  }
  closeEvent = () => {
    this.setState({isAddVisible: false})
  }
  //保存添加员工信息s
  saveEvent = () => {
    const {form} = this.formRef.props
    form.validateFields((err, values) => {
      if (!err) {
        let addForm = this.state.addForm
        addForm = Object.assign(addForm, {type: 2}, values) //2是添加流量主
        merchantAdd(addForm).then(rs => {
          message.success(rs.message)
          this.setState({isAddVisible: false})
          this.loadList()
        })
      }
    })
    
  }
  saveFormRef = formRef => {
    this.formRef = formRef
  }
  render() {
    const {
      redirect,
      adData,
      search,
      pagination,
      isAddVisible
    } = this.state
    const columns = [
      {
        title: '流量主名称',
        key: 'merchantName',
        dataIndex: 'merchantName'
      },
      {
        title: '登录名',
        key: 'loginName',
        dataIndex: 'loginName'
      },
      {
        title: '联系人',
        key: 'contactName',
        dataIndex: 'contactName'
      },
      {
        title: '手机',
        key: 'mobile',
        dataIndex: 'mobile'
      },
      {
        title: '状态',
        key: 'status',
        dataIndex: 'status',
        render: (record) => (
          <span>{record === 1 ? '启用' : '停用'}</span>
        )
      },
      /*{
        title: '操作',
        render: (record) => (
          <div className="opeartion-items">
            <Popconfirm
              title="是否要重置密码"
              onConfirm={this.resetPwdEvent.bind(this, record)}
              okText="是"
              cancelText="否"
            >
              <span className="blue-color">重置密码</span>
            </Popconfirm>
            <Popconfirm
              title={`是否要${record.status === 1 ? '停用' : '启用'}此员工账号`}
              onConfirm={this.statusEvent.bind(this, record)}
              okText="是"
              cancelText="否"
            >
              <span className="blue-color">{Number(record.status) === 1 ? '停用' : '启用'}</span>
            </Popconfirm>
          </div>
        )
      },*/
    ]
    return (
      <div className={style.administrator}>
        <AddFlowMain
          wrappedComponentRef={this.saveFormRef}
          type={search.type}
          isAddVisible={isAddVisible}
          onCancel={this.closeEvent}
          onCreate={this.saveEvent}
        />
        <h1 className="nav-title">流量主管理<Button type="primary" onClick={this.addEvent.bind(this)}>添加</Button></h1>
        <ul className={style.search}>
          <li>
            流量主名称
            <Input placeholder="请输入流量主名称" className="ml10" value={search.merchantName} onChange={this.changeFormEvent.bind(this, 'merchantName')} />
          </li>
          <li>
            流量主编码
            <Input placeholder="请输入流量主编码" className="ml10" value={search.merchantCode} onChange={this.changeFormEvent.bind(this, 'merchantCode')} />
          </li>
          <li>
            流量主状态
            <Select value={search.status} className="ml10" onChange={this.changeFormEvent.bind(this, 'status')}>
              <Option value={null}>请选择</Option>
              <Option value={1}>启用</Option>
              <Option value={2}>停用</Option>
            </Select>
          </li>
          <li>
            <Button type="primary" onClick={this.searchEvent.bind(this)}>查询</Button>
            <Button className="ml10" onClick={this.clearEvent.bind(this)}>重置</Button>
          </li>
        </ul>
        <Table
          dataSource={adData}
          columns={columns}
          pagination={pagination}
          rowKey={record => record.id}
          className="table"
        />
      </div>
    )
  }
}
export default FlowList