import React, {Component} from 'react';
import {Table, Popconfirm, message, Button, Input, Select, Modal} from 'antd';
import Redirect from 'umi/redirect';
import style from './style.less';
import AddEmployess from '../../components/addemployess';
import ReDrawer from 'rc-drawer';
const Option = Select.Option;
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
    console.log(params);
    window.api.baseInstance('api/employee/list', params).then(rs => {
      const p = Object.assign(pagination, {total: rs.total});
      this.setState({employessData: rs.data, pagination: p});
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
    this.loadList();
  }
  clearEvent = () => {
    console.log('clear');
  }
  addEvent = (type, item) => {
    if (item !== null) {
      const params = {
        id: item.id,
        operatorLoginName: this.state.operatorLoginName
      };
      window.api.baseInstance('api/employee/getById', params).then(rs => {
        this.setState({addForm: rs.data});
      }).catch(err => {
        if (err.code === 100000) {
          this.setState({redirect: true});
          window.localStorage.removeItem('login_info');
        } else {
          message.error(err.message);
        }
      });
    }
    this.setState({isAddVisible: true, type});
  }
  //添加员工事件change
  changeValueEvent = (type, e) => {
    let addForm = this.state.addForm;
    let obj = {[type]: e.target.value};
    addForm = Object.assign(addForm, obj);
    this.setState({addForm});
  }
  saveEvent = () => {
    let {operatorLoginName, addForm} = this.state
    const params = {
      operatorLoginName,
      ...addForm
    };
    console.log(this.state.type);
    window.api.baseInstance('api/employee/add', params).then(rs => {
      console.log(rs);
    }).catch(err => {
      if (err.code === 100000) {
        this.setState({redirect: true});
        window.localStorage.removeItem('login_info');
      } else {
        message.error(err.message);
      }
    });
  }
  resetPwdEvent = (item) => {
    const params = {
      password: '123456',
      employeeId: item.id,
      operatorLoginName: this.state.operatorLoginName
    };
    window.api.baseInstance('api/employee/edit', params).then(rs => {
      console.log(rs);
    }).catch(err => {
      if (err.code === 100000) {
        this.setState({redirect: true});
        window.localStorage.removeItem('login_info');
      } else {
        message.error(err.message);
      }
    });
  }
  confirm = (item) => {
    const params = {
      status: 2,
      employeeId: item.id,
      operatorLoginName: this.state.operatorLoginName
    };
    window.api.baseInstance('api/employee/edit', params).then(rs => {
      console.log(rs);
    }).catch(err => {
      if (err.code === 100000) {
        this.setState({redirect: true});
        window.localStorage.removeItem('login_info');
      } else {
        message.error(err.message);
      }
    });
  }
  closeEvent = () => {
    this.setState({
      isAddVisible: false
    })
  }
  render() {
    const {
      redirect,
      employessData,
      isAddVisible,
      type,
      addForm
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
        key: 'gmt_time',
        dataIndex: 'gmt_time'
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
            <Popconfirm
              title="是否要停用"
              onConfirm={this.confirm.bind(this, record)}
              okText="是"
              cancelText="否"
            >
              <span className="ml10 blue-color">停用</span>
            </Popconfirm>
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
            <Select defaultValue="" className="ml10" onChange={this.changeFormEvent.bind(this, 'status')}>
              <Option value="">请选择</Option>
              <Option value={0}>停用</Option>
              <Option value={1}>启用</Option>
            </Select>
          </li>
          <li>
            <Button type="primary" onClick={this.searchEvent.bind(this)}>查询</Button>
            <Button className="ml10" onClick={this.clearEvent.bind(this)}>清空</Button>
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