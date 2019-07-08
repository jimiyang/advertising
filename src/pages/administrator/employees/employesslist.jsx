import React, {Component} from 'react';
import {Table, Popconfirm, message, Button, Input, Select, Modal} from 'antd';
import Redirect from 'umi/redirect';
import style from './style.less';
import AddEmployess from '../../components/addemployess';
import {
  employeeList,
  employeeGetById,
  employeeEdit,
  employeeAdd
} from '../../../api/api';
const Option = Select.Option;
const aas =employeeAdd;
class EmployessList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      operatorLoginName: '',
      employessData: [],
      isAddVisible: false,
      search: {
        name: null,
        loginName: null,
        status: null
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
      addForm: {
        name: null,
        mobile: null,
        loginName: null,
        password: null
      },
      type: 'add', //用来区分是添加员工弹层or编辑员工弹层
    };
  }
  async componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
    if (!loginInfo) return false;
    await this.setState({operatorLoginName: loginInfo.data.loginName});
    this.loadList();
  }
  loadList = () => {
    const {operatorLoginName, search, pagination} = this.state;
    const params = {
      currentPage: pagination.currentPage,
      limit: pagination.limit,
      operatorLoginName,
      ...search
    };
    employeeList(params).then(rs => {
      const p = Object.assign(pagination, {total: rs.total});
      this.setState({employessData: rs.data, pagination: p});
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
  changeFormEvent = (type, e) => {
    let search = this.state.search;
    let obj = {};
    switch (type) {
      case 'name':
        obj = {[type]: e.target.value};
        break;
      case 'loginName':
        obj = {[type]: e.target.value};
        break;
      case 'status':
        obj = {[type]: e};
        break;
      default:
        obj = {[type]: e.target.value};
        break;
    }
    search = Object.assign(search, obj);
    this.setState({search});
  }
  searchEvent = () => {
    const pagination = Object.assign(this.state.pagination, {currentPage: 1});
    this.setState(pagination);
    this.loadList();
  }
  clearEvent = () => {
    let search = this.state.search;
    search = Object.assign(
      search, {
        name: null,
        loginName: null,
        status: null
      }
    );
    this.setState({search});
  }
  addEvent = (type, item) => {
    let addForm = this.state.addForm;
    if (type === 'edit') {
      const params = {
        id: item.id,
        operatorLoginName: this.state.operatorLoginName
      };
      employeeGetById(params).then(rs => {
        this.setState({addForm: rs.data});
      });
    } else {
      addForm = Object.assign(addForm, {name: null, mobile: null});
      this.setState({addForm});
    }
    this.setState({type, isAddVisible: true});
  }
  //添加员工事件change
  changeValueEvent = (type, e) => {
    let addForm = this.state.addForm;
    let obj = {[type]: e.target.value};
    addForm = Object.assign(addForm, obj);
    this.setState({addForm});
  }
  saveEvent = () => {
    let {operatorLoginName, addForm, type} = this.state
    let params = {
      operatorLoginName,
      ...addForm
    };
    let employee;
    if (type === 'add') {
      employee = employeeAdd;
      delete params.id;
    } else {
      employee = employeeEdit;
      params = Object.assign(params, {employeeId: params.id});
    }
    employee(params).then(rs => {
      message.success(rs.message);
      this.setState({isAddVisible: false});
      this.loadList();
    });
  }
  resetPwdEvent = (item) => {
    const params = {
      password: '111qqq',
      employeeId: item.id,
      operatorLoginName: this.state.operatorLoginName
    };
    employeeEdit(params).then(rs => {
      message.success(rs.message);
      this.loadList();
    });
  }
  confirm = (item) => {
    console.log(item);
    const status = item.status === 1 ? 2 : 1; //1启用，2停用
    const params = {
      status,
      employeeId: item.id,
      operatorLoginName: this.state.operatorLoginName
    };
    window.api.baseInstance('api/employee/edit', params).then(rs => {
      message.success(rs.message);
      this.loadList();
    });
  }
  closeEvent = () => {
    this.setState({isAddVisible: false});
  }
  render() {
    const {
      redirect,
      employessData,
      isAddVisible,
      type,
      addForm,
      search
    } = this.state;
    const columns = [
      {
        title: '姓名',
        key: 'name',
        dataIndex: 'name'
      },
      {
        title: '登录名',
        key: 'loginName',
        dataIndex: 'loginName'
      },
      {
        title: '电话',
        key: 'mobile',
        dataIndex: 'mobile'
      },
      {
        title: '创建时间',
        key: 'gmtCreate',
        dataIndex: 'gmtCreate'
      },
      {
        title: '操作',
        key: 'opeartion',
        dataIndex: '',
        render: (record) => (
          <div className="opeartion-items">
            <span className="blue-color" onClick={this.addEvent.bind(this, 'edit', record)}>编辑</span>
            <Popconfirm
              title="是否要重置密码"
              onConfirm={this.resetPwdEvent.bind(this, record)}
              okText="是"
              cancelText="否"
            >
              <span className="ml10 blue-color">重置密码</span>
            </Popconfirm>
            {
              /*<Popconfirm
                title={`是否要${Number(record.status) === 1 ? '停用' : '启用'}此员工账号`}
                onConfirm={this.confirm.bind(this, record)}
                okText="是"
                cancelText="否"
              >
                <span className="ml10 blue-color">{Number(record.status) === 1 ? '停用' : '启用'}</span>
              </Popconfirm>*/
            }
          </div>
        )
      }
    ];
    if (redirect) return (<Redirect to="/relogin" />);
    return(
      <div className={style.employess}>
        <Modal
          visible={isAddVisible}
          onCancel={this.closeEvent.bind(this)}
          width={510}
          footer={
            <div>
              <Button type="primary" onClick={this.saveEvent.bind(this)}>保存</Button>
              <Button style={{marginLeft: '22px'}} onClick={this.closeEvent.bind(this)}>返回</Button>
            </div>
          }
        >
          <AddEmployess changeValueEvent={this.changeValueEvent} type={type} addForm={addForm} />
        </Modal>
        <h1 className="nav-title">员工管理<Button type="primary" onClick={this.addEvent.bind(this, 'add', null)}>添加员工</Button></h1>
        <ul className={style.search}>
          <li>
            员工姓名
            <Input className="ml10" onChange={this.changeFormEvent.bind(this, 'name')} />
          </li>
          <li>
            登录名
            <Input className="ml10" onChange={this.changeFormEvent.bind(this, 'loginName')} />
          </li>
          <li>
            状态
            <Select value={search.status} className="ml10" onChange={this.changeFormEvent.bind(this, 'status')}>
              <Option value={null}>请选择</Option>
              <Option value={2}>停用</Option>
              <Option value={1}>启用</Option>
            </Select>
          </li>
          <li>
            <Button type="primary" onClick={this.searchEvent.bind(this)}>查询</Button>
            <Button className="ml10" onClick={this.clearEvent.bind(this)}>重置</Button>
          </li>
        </ul>
        <Table
          dataSource={employessData}
          columns={columns}
          rowKey={record => record.id}
          className="table"
        />
      </div>
    );
  }
}
export default EmployessList;