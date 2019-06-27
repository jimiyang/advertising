import React, {Component} from 'react';
import {Button, Select, Input, Modal, message, Pagination} from 'antd';
import Redirect from 'umi/redirect';
import Link from 'umi/link';
import router from 'umi/router';
import style from './style.less';
import ReceiveAd from '../../components/receivead'; //确认接此广告模板
import {isNull} from 'util';
const Option = Select.Option;
class MyOrder extends Component{
  constructor(props) {
    super(props);
    this.state = {
      loginName: '',
      redirect: false,
      orderData: [],
      appsData: [], //公众号列表
      isVisible: false,
      pagination: {
        limit: 10,
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      appNickName: null,
      search: {
        adType: null,
        appNickName: null,
        campaignName: null
      }
    };
  }
  async componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
    if (!loginInfo) return false;
    await this.setState({loginName: loginInfo.data.loginName});
    this.loadList();
    this.getListApps(loginInfo.data.loginName);
  }
  loadList = () => {
    const {pagination, search} = this.state;
    const params = {
      currentPage: pagination.currentPage,
      limit: pagination.limit,
      ...search
    };
    window.api.baseInstance('flow/campaign/list', params).then(rs => {
      const p = Object.assign(pagination, {total: Number(rs.total)});
      this.setState({orderData: rs.data, pagination: p});
    }).catch(err => {
      if (err.code === 100000) {
        this.setState({redirect: true});
        window.localStorage.removeItem('login_info');
      } else {
        message.error(err.message);
      }
    });
  }
  //查询所有公众号
  getListApps = (loginName) => {
    window.api.baseInstance('flow/wechat/listapps', {loginName}).then(rs => {
      console.log(rs);
      const appsData = rs.data === undefined ? [] : rs.data;
      this.setState({appsData});
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
  changeFormEvent = (type, e, value) => {
    let obj = {};
    let {search} = this.state;
    switch(type) {
      case 'campaignName':
        if (e === null) {
          obj = {[type]: e};  
        } else {
          obj = {[type]: e.target.value};
        }
        break;
      case 'adType':
        obj = {[type]: e};
      case 'appNickName':
        obj = {[type]: value.props.value};
        //detailForm = Object.assign(detailForm, {appId: value.props.value, appNickName: value.props.children});
        this.setState({appNickName: value.props.children});
        break;
      default: 
        obj = {[type]: e};
        break;
    }
    search = Object.assign(search, obj);
    this.setState({search});
  }
  //搜索
  searchEvent = () => {
    this.loadList();
  }
  //接收此广告
  ReceiveEvent = (item) => {
    let {search, appNickName} = this.state;
    if (!search.appNickName) {
      message.error('请选择公众号');
      return false;
    }
    router.push({
      pathname: '/main/receivead',
      state: {
        campaignId: item.campaignId,
        appNickName
      }
    });
    /*const params = Object.assign(detailForm, {
      articlePosition: null,
      missionReadCnt: null,
      planPostArticleTime: null
    });
    Promise.all([window.api.baseInstance('admin/system/dict/getDictByType', {type: 'mediaType'}), window.api.baseInstance('flow/campaign/detail', {campaignId: item.campaignId}), window.api.baseInstance('admin/system/dict/getDictByType', {type: 'provinceType'})]).then(rs => {
      detailForm = Object.assign(detailForm, {targetData: rs[0].data}, rs[1].data.campaign, {areaData: rs[2].data});
      this.setState({isVisible: true, detailForm: params});
    }).catch(err => {
      if (err.code === 100000) {
        this.setState({redirect: true});
        window.localStorage.removeItem('login_info');
      } else {
        message.error(err.message);
      }
    });*/
  }
  //确定接此广告
  /*creatEvent = () => {
    const {detailForm, loginName, creatForm} = this.state;
    const params = {
      campaignId: detailForm.campaignId,
      appId: detailForm.appId,
      appNickName: detailForm.appNickName,
      adMerchantCode: detailForm.merchantCode,
      appMediaTags: detailForm.targetMediaCategory,
      campaignName: detailForm.campaignName,
      unitPrice: detailForm.unitPrice,
      loginName,
      ...creatForm
    };
    if (isNull(creatForm.articlePosition)) {
      message.error('请选择发文位置');
      return false
    }
    if (isNull(creatForm.missionReadCnt)) {
      message.error('请填写接单阅读量');
      return false;
    }
    if (isNull(creatForm.planPostArticleTime)) {
      message.error('请选择预计发文时间');
      return false;
    }
    let reg = /^\+?[1-9][0-9]*$/;
    if (!reg.test(creatForm.missionReadCnt)) {
      message.error('只能输入整数');
      return false;
    }
    window.api.baseInstance('flow/mission/add', params).then(rs => {
      this.setState({isVisible: false});
      message.success(rs.message);
      this.loadList();
    }).catch(err => {
      if (err.code === 100000) {
        this.setState({redirect: true});
        window.localStorage.removeItem('login_info');
      } else {
        message.error(err.message);
      }
    });
  }*/
  render() {
    const {
      redirect,
      orderData,
      isVisible,
      pagination,
      search,
      appsData,
      detailForm //查询详情
    } = this.state;
    if (redirect) return (<Redirect to="/relogin" />);
    return(
      <div className={style.pubAccount}>
        <h1 className="nav-title">接单赚钱 > 可接任务</h1>
        <ul className={style.search}>
          <li>广告类型
            <Select defaultValue={search.adType} onChange={this.changeFormEvent.bind(this, 'adType')} className="w180 ml10">
              <Option value={null}>请选择</Option>
              <Option value={'article'}>公众号推文</Option>
            </Select>
          </li>
          <li>公众号名称
            <Select defaultValue={search.appNickName} onChange={this.changeFormEvent.bind(this, 'appNickName')} className="w180 ml10">
              <Option value={null}>请选择</Option>
              {
                appsData.length !== 0 ? 
                  appsData.map((item, index) => (
                    <Option key={index} value={item.appId}>{item.appNickName}</Option>
                  )) : null
              }
            </Select>
          </li>
          <li>活动名称
            <Input value={search.campaignName} onChange={this.changeFormEvent.bind(this, 'campaignName')} />
          </li>
          <li>
            <Button type="primary" onClick={this.searchEvent.bind(this)}>查询</Button>
          </li>
        </ul>
        <div className={`${style.noData} table ${orderData.length !== 0 ? 'hide' : null}`}>
          <img src={require('../../../assets/nodata-ico.png')} />
          <p>没有数据!</p>
        </div>
        <div className={orderData.length === 0 ? 'hide' : null}>
          <dl className={style.list}>
            {
              orderData !== null ? 
                orderData.map((item, index) => (
                  <dd key={index}>
                    <div className={style.title}>
                      <img src={item.impImage} />
                      <Link className="blue-color" to="/">{item.campaignName}</Link>
                    </div>
                    <p>阅读单价：{item.unitPrice}元 / 次阅读</p>
                    <p>活动时间：{window.common.getDate(item.dateStart, false)}-{window.common.getDate(item.dateEnd, false)}</p>
                    <div className={style.btn}>剩余{item.availableCnt}次阅读
                      <Button type="primary" onClick={this.ReceiveEvent.bind(this, item)}>接此广告</Button>
                    </div>
                  </dd>
                )) : null
            }
          </dl>
          <div className="g-tr">
            <Pagination
              showSizeChanger
              defaultCurrent={pagination.currentPage}
              defaultPageSize={pagination.limit}
              total={pagination.total}
              size="small"
              onChange={this.changePage.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }
};
export default MyOrder;