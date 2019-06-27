import React, {Component} from 'react';
import {DatePicker, Table, Select, Input, Button, Modal, message} from 'antd';
import style from './style.less';
import Redirect from 'umi/redirect';
import router from 'umi/router';
import WithdrawList from './withdrawallist'; //提现记录
import ConsumeList from './consumelist'; //消费记录
import RechargeModel from '../../components/rechargeModel'; //充值modal
import WidthdrawModel from '../../components/withdrawModel'; //提现model
import RechargeDetailModel from '../../components/rechargeDetailModel'; //查看订单详情
const {Option} = Select; 
class DepositList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isActive: 0,
      loginName: '',
      depositData: [],
      status: ['下单', '成功', '失败'],
      redirect: false,
      isVisible: false, //是否显示充值弹层
      isDrawVisible: false, //是否显示提现弹层
      isDetailVisible: false, //是否显示订单详情
      available_balance: 0, //可用余额
      freezen_balance: 0, //冻结余额
      detailData: {}, //订单详情数据
      qrUrl: '',
      pagination: {
        size: 'small',
        limit: 10, //每页显示多少条
        currentPage: 1,
        total: 0,
        showSizeChanger: true,
        onChange: this.changePage,
        onShowSizeChange: this.onShowSizeChange
      },
      search: {
        dateStart: '',
        dateEnd: '',
        orderNo: '',
        orderStatus: ''
      },
      topup:{
        amount: '',
        channelType: 'WX'
      }
    }
  }
  componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
    if (!loginInfo) return false;
    //因为setState是异步的，他会在render后才生效,加入一个回调函数
    this.setState({
      loginName: loginInfo.data.loginName
    },()=>{
      this.loadList();
      this.getCaQuery();
    });
  }
  loadList = () => {
    const {pagination, search} = this.state;
    const params = {
      loginName: this.state.loginName,
      currentPage: pagination.currentPage,
      limit: pagination.limit,
      ...search
    };
    //console.log(params);
    window.api.baseInstance('/api/topup/list', params).then(rs => {
      const pagination = Object.assign(this.state.pagination, {total: rs.total});
      this.setState({depositData: rs.data, pagination});
    }).catch(err => {
      if (err.code === 100000) {
        this.setState({redirect: true});
        window.localStorage.removeItem('login_info');
      }
      message.error(err.message);
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
  //获取可用余额和冻结余额
  getCaQuery = () => {
    window.api.baseInstance('api/merchant/caQuery', {operatorLoginName: this.state.loginName}).then(rs => {
      //console.log(rs);
      this.setState({available_balance: rs.data.available_balance, freezen_balance: rs.data.freezen_balance});
    }).catch(err => {
      if (err.code === 100000) {
        this.setState({redirect: true});
        window.localStorage.removeItem('login_info');
      }
      message.error(err.message);
    });;
  }
  //切换记录列表
  accountTypeEvent = (index) => {
    this.setState({isActive: index});
  }
  changeFormEvent = (type, e, value2) => {
    let search = this.state.search;
    let obj = {};
    switch(type) {
      case 'dateStart':
        obj = {[type]: value2};
        break;
      case 'dateEnd':
        obj = {[type]: value2};
        break;
      case 'orderNo':
        obj = {[type]: e.target.value};
        break;
      case 'orderStatus':
        obj = {[type]: e};
        break;
      default:
        search = {[type]: e.target.value};
        break;
    }
    search = Object.assign(search, obj);
    this.setState({search});
  }
  searchEvent = () => {
    this.loadList();
  }
  //充值弹窗
  saveMoneyEvent = () => {
    let topup = this.state.topup;
    topup = Object.assign(topup, {amount: ''});
    this.setState({isVisible: true, topup});
  }
  //提现弹窗
  widthdrawEvent = () => {
    //this.setState({isDrawVisible: true});
    message.warning('功能正在开发中....');
  }
  closeEvent = () => {
    this.setState({
      isVisible: false,
      isDrawVisible: false,
      isDetailVisible: false
    });
  }
  //调用子组件的表单事件
  bindValue = (type, e) => {
    let topup = this.state.topup;
    topup = Object.assign(topup, {[type]: e.target.value});
    this.setState({topup});
  }
  //充值事件
  rechargeEvent = () => {
    const params = {
      ...this.state.topup,
      operatorLoginName: this.state.loginName
    };
    const reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
    if (!reg.test(params.amount)) {
      message.error('请输入整数或小数(保留后两位)');
      return false;
    }
    window.api.baseInstance('api/topup/native', params).then(rs => {
      console.log(rs);
      this.setState({qrUrl: rs.data.payUrl});
      router.push({pathname: '/main/qrcode', query: rs.data});
    }).catch(err => {
      if (err.code === 100000) {
        this.setState({redirect: true});
        window.localStorage.removeItem('login_info');
      } else {
        message.error(err.message);
      }
    });
  }
  //查看订单详情
  viewDetailEvent = (id) => {
    const params = {
      operatorLoginName: this.state.loginName,
      orderNo: id
    };
    window.api.baseInstance('api/topup/getByOrderNo', params).then(rs => {
      this.setState({detailData: rs.data, isDetailVisible: true});
    }).catch(err => {
      if (err.code === 100000) {
        this.setState({redirect: true});
        window.localStorage.removeItem('login_info');
      } else {
        message.error(err.message);
      }
    });
  }
  render(){
    const {
      isActive,
      depositData,
      status,
      pagination,
      isVisible,
      isDrawVisible,
      isDetailVisible,
      redirect,
      search,
      available_balance,
      freezen_balance,
      detailData,
      topup
    } = this.state;
    const columns = [
      {
        title: '充值单号',
        key: 'orderNo',
        dataIndex: 'orderNo',
        render: (record) =>  (
          <div className="opeartion-items">
            <span className="blue-color line" onClick={this.viewDetailEvent.bind(this, record)}>{record}</span>
          </div>
        )
      },
      {
        title: '充值金额',
        key: 'orderAmt',
        dataIndex: 'orderAmt'
      },
      {
        title: '充值方式',
        key: 'topupType',
        dataIndex: 'topupType',
        render: (record) => (
          <span>{record === 1 ? '微信' : '支付宝'}</span>
        )
      },
      {
        title: '订单状态',
        key: 'orderStatus',
        dataIndex: 'orderStatus',
        render: (record) => (
          <span>{status[record]}</span>
        )
      },
      {
        title: '创建时间',
        key: 'createDate',
        dataIndex: 'createDate',
        render: (record) => (
          <span>{window.common.getDate(record, true)}</span>
        )
      },
      {
        title: '成功时间',
        key: 'successTime',
        dataIndex: 'successTime',
        render: (record) => (
          <span>{record === undefined ? '-' : window.common.getDate(record, true)}</span>
        )
      }
    ];
    if (redirect) return (<Redirect to="/relogin" />);
    return(
      <div className={style.financialModel}>
        <Modal
          visible={isVisible}
          width={510}
          onCancel={this.closeEvent}
          footer={
            <Button type="primary" onClick={this.rechargeEvent.bind(this)}>确定</Button>
          }
        >
          <RechargeModel changeFormEvent={this.bindValue.bind(this)} amount={topup.amount} />
        </Modal>
        <Modal
          visible={isDrawVisible}
          width={510}
          onCancel={this.closeEvent}
          footer={
            <Button type="primary">确定</Button>
          }
        >
          <WidthdrawModel />
        </Modal>
        <Modal
          visible={isDetailVisible}
          onCancel={this.closeEvent.bind(this)}
          footer={
            <Button onClick={this.closeEvent.bind(this)}>关闭</Button>
          }
        >
          <RechargeDetailModel detailForm={detailData}/>
        </Modal>
        <h1 className="nav-title">我的财务支出 > 支出记录</h1>
        <div className={style.accountAmount}>
          <div>
            <div className={style.accountItems}>
              {available_balance}
              <h1>账户可用余额</h1>
            </div>
            <div className={style.lockAmount}>
              {freezen_balance}
              <h1>账户冻结余额</h1>
            </div>
          </div>
          <p>
            <span onClick={this.saveMoneyEvent.bind(this)}>充值</span>
            <span onClick={this.widthdrawEvent.bind(this)}>提现</span>
          </p>
        </div>
        <ul className={style.accountType}>
          <li className={isActive === 0 ? style.active : null} onClick={this.accountTypeEvent.bind(this, 0)}>充值记录</li>
          <li className={`${isActive === 2 ? style.active : null} hide`} onClick={this.accountTypeEvent.bind(this, 1)}>提现记录</li>
          <li className={isActive === 2 ? style.active : null} onClick={this.accountTypeEvent.bind(this, 2)}>消费记录</li>
        </ul>
        <div className={isActive === 1 ? null : 'hide'}>
          <WithdrawList />
        </div>
        <div className={isActive === 2 ? null : 'hide'}>
          <ConsumeList />
        </div>
        <div className={isActive === 0 ? null : 'hide'}>
          <ul className={style.search}>
            <li>
              创建时间
              <DatePicker className="w150 ml10" format="YYYY-MM-DD" onChange={this.changeFormEvent.bind(this, 'dateStart')} />
              <DatePicker className="ml10 w150" format="YYYY-MM-DD" onChange={this.changeFormEvent.bind(this, 'dateEnd')} />
            </li>
            <li>
              充值单号
              <Input className="w180 ml10" value={search.orderNo} onChange={this.changeFormEvent.bind(this, 'orderNo')} />
            </li>
            <li>
              订单状态
              <Select defaultValue={search.orderStatus} onChange={this.changeFormEvent.bind(this, 'orderStatus')} className="w180 ml10">
                <Option value="">全部</Option>
                {
                  status.map((item, index) => (<Option value={index} key={index}>{item}</Option>))
                }
              </Select>
            </li>
            <li>
              <Button type="primary" onClick={this.searchEvent.bind(this)}>查询</Button>
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
      </div>
    )
  }
}
export default DepositList;