import React, {Component} from 'react';
import {Radio, Input, Button, Table, message} from 'antd';
import Redirect from 'umi/redirect';
import Link from 'umi/link';
import style from './style.less';
class MaterialList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      loginName: null,
      redirect: false,
      articletypeData: ['电商', '广告', '小说', '知识付费', '其他'],
      materiaData: [],
      search: {
        title: null,
        articleType: null
      },
      pagination: {
        size: 'small',
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
        currentPage: 1,
        limit: 10,
        pageSize: 10,
        onChange: this.changePage,
        onShowSizeChange: this.onShowSizeChange
      }
    };
  }
  async componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
    if (!loginInfo) return false;
    await this.setState({
      loginName: loginInfo.data.loginName
    });
    this.loadList();
  }
  loadList = () => {
    let {loginName, search, pagination} = this.state;
    const params = {
      loginName,
      currentPage: pagination.currentPage,
      limit: pagination.limit,
      ...search
    };
    window.api.baseInstance('ad/article/list', params).then(rs => {
      const p = Object.assign(pagination, {total: rs.data.totalNum});
      this.setState({materiaData: rs.data.items, pagination: p});
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
    search = Object.assign(search, {[type]: e.target.value});
    this.setState({search});
  }
  searchEvent = () => {
    this.loadList();
  }
  clearEvent = () => {
    let search = this.state.search;
    search = Object.assign(search, {title: null, articleType: null});
    this.setState({search});
    this.loadList();
  }
  render() {
    const {
      redirect,
      articletypeData,
      materiaData,
      pagination,
      search
    } = this.state;
    const columns = [
      {
        title: '标题',
        render: (record) => (
          <div className={style.titleinfo}>
            <img src={record.contentSourceUrl} />
            <div className="g-tl">
              {record.title}
              <p>{record.createDate}</p>
            </div>
          </div>
        )
      },
      {
        title: '文章类型',
        key: 'articleType',
        dataIndex: 'articleType',
        render: (record) => (
          <span>{articletypeData[record - 1]}</span>
        )
      },
      {
        title: '操作',
        key: 'opeartion',
        dataIndex: '',
        render: (record) => (
          <div className="opeartion-items">
            <Link className="blue-color" to="/">编辑</Link>
          </div>
        )
      },
    ]
    if (redirect) return (<Redirect to="/relogin" />);
    return(
      <div className={style.mypromotion}>
        <h1 className="nav-title">素材库列表</h1>
        <ul className={`${style.search} mt40`}>
          <li>
            <label className={style.name}>标题</label>
            <Input value={search.title} onChange={this.changeFormEvent.bind(this, 'title')} />
          </li>
          <li>
            <label className={style.name}>文章类型</label>
            <div className={style.chks}>
              <Radio.Group onChange={this.onChange} value={search.articleType}>
              {
                articletypeData.map((item, index) => (
                  <Radio key={index} value={index + 1} onChange={this.changeFormEvent.bind(this, 'articleType')}>{item}</Radio>  
                ))
              }
              </Radio.Group>
            </div>
          </li>
          <li>
            <Button type="primary" className="mr20" onClick={this.searchEvent.bind(this)}>查询</Button>
            <Button className="mr20" onClick={this.clearEvent.bind(this)}>重置</Button>
          </li>
        </ul>
        <Table
          dataSource={materiaData}
          columns={columns}
          pagination={pagination}
          rowKey={record => record.id}
          className="table"
        />
      </div>
    )
  }
}
export default MaterialList;