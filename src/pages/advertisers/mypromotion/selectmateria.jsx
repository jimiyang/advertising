import React, {Component} from 'react';
import router from 'umi/router';
import Redirect from 'umi/redirect';
import style from './style.less';
import { Radio, Button, Modal, message, Popconfirm, Table} from 'antd';

class SelectMateria extends Component{
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      isActive: 0,
      type: null,
      id: null, //活动id
      loginName: null,
      postStatus: null, //状态
      isVisible: false,
      item: null, //选取的素材内容信息
      materiaData: [],
      iframeHeight: '800',
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
      },
      form: {
        postContent: null, //素材id
        impImage: null, //封面
        postUrl: null, //预览路径
        extrendJson: null, //标题
      }
    };
  }
  async componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
    console.log(loginInfo);
    const state = this.props.location.state;
    if (state) {
      this.setState({type: state.type, id: state.id});
    }
    await this.setState({loginName: loginInfo.data.loginName, iframeHeight: document.documentElement.clientHeight - 130});
    this.loadList();
    //console.log(window.screen.height - 100);
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
  //选择素材
  selMarteiaEvent = (item) => {
    const form = {
      postContent: item.id,
      impImage: item.thumbMediaUrl,
      postUrl: '',
      extrendJson: item.title,
    };
    this.setState({form});
  }
  promoteSaveEvent = (status) => {
    const {loginName, form, id} = this.state;
    if (!form.postContent) {
      message.error('请选择素材');
      return false;
    }
    const params = {
      ...form,
      id,
      loginName,
      postStatus: status, //21提交审核中，20活动草稿
    };
    //console.log(params);
    window.api.baseInstance('api/ad/campaign/updatePostContentById', params).then(rs => {
      message.success(rs.message);
      router.push('/main/myactivity');
    }).catch(err => {
      if (err.code === 100000) {
        this.setState({redirect: true});
        window.localStorage.removeItem('login_info');
      } else {
        message.error(err.message);
      }
    });
  }
  selectEvent = () => {
    router.push('/main/editor');
  }
  //上一步
  goPrevEvent = () => {
    router.push({pathname: '/main/editactivity', state: {id: this.state.id}});
  }
  render() {
    const {
      isActive,
      type,
      isVisible,
      materiaData,
      pagination,
      form,
      redirect,
      iframeHeight
    } = this.state;
    const columns = [
      {
        key: '选择',
        render: (record) => (
          <Radio checked={form.postContent === record.id ? true : false} onChange={this.selMarteiaEvent.bind(this, record)} />
        )
      },
      {
        title: '标题',
        key: 'title',
        render: (record) => (
          <div className={style.titleinfo}>
            <img src={record.contentSourceUrl} />
            <div className="g-tl">
              {record.title}
              <p>{record.digest}</p>
            </div>
          </div>
        )
      },
      {
        title: '创建时间',
        key: 'createDate',
        dataIndex: 'createDate',
        render: (record) => (
          <span>{window.common.getDate(record, true)}{}</span>
        )
      }
    ];
    if (redirect) return (<Redirect to="/relogin" />);
    return(
      <div className={style.mypromotion}>
        <div className={style.selectmateriaitems}>
          <h1 className="nav-title">新建活动 > 选择素材</h1>
          <div className={style.type}>
            <span className={`${style.items} ${isActive === 0 ? style.active : null}`} onClick={this.selectEvent.bind(this)}>新建素材</span>
          </div>
          <div className={style.content}>
            <Table
              dataSource={materiaData}
              columns={columns}
              pagination={pagination}
              rowKey={record => record.id}
              className="table"
            />
          </div>
          <div className={style.buttons}>
            <Button type="primary" onClick={this.promoteSaveEvent.bind(this, 21)}>提交推广</Button>
            <Button type="primary" onClick={this.promoteSaveEvent.bind(this, 20)}>保存草稿</Button>
            <Button onClick={this.goPrevEvent.bind(this)}>上一步</Button>
          </div>
        </div>
      </div>
    );
  }
}
export default SelectMateria;