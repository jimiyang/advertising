import React, {Component} from 'react';
import {DatePicker, Input, Table, Button, message} from 'antd';
import Redirect from 'umi/redirect';
import style from './style.less';
class ArningsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginName: '',
      earningsData: [],
      search: {

      },
      pagination: {

      }
    };
  }
  async componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
    if (!loginInfo) return false;
    await this.setState({loginName: loginInfo.data.loginName});
    this.loadList();
  }
  loadList = () => {
    const {loginName} = this.state;
    const params = {
      loginName
    };
    window.api.baseInstance('admin/flow/finance/list', params).then(rs => {
      console.log(rs);
    });
  }
  changeFormEvent = (type, e) => {

  }
  searchEvent = () => {
    console.log(this.state.search);
  }
  //提现弹窗
  widthdrawEvent = () => {
    //this.setState({isDrawVisible: true});
    message.warning('功能正在开发中....');
  }
  render () {
    const {
      redirect,
      search,
      earningsData,
      pagination
    } = this.state;
    const columns = [
      {
        title: '结算单号',
        key: 'missionId',
        dataIndex: 'missionId'
      },
      {
        title: '结算金额',
        key: 'orderAmt',
        dataIndex: 'orderAmt'
      },
      {
        title: '活动名称',
        key: 'campaignName',
        dataIndex: 'campaignName'
      },
      {
        title: '接单单号',
        key: 'orderNo',
        dataIndex: 'orderNo'
      },
      {
        title: '到账时间',
        key: 'createDate',
        dataIndex: 'createDate',
        render: (record) => (
          <span>{window.common.getDate(record, true)}</span>
        )
      },
      {
        title: '结算后余额',
        key: '',
        dataIndex: ''
      }
    ];
    if (redirect) return (<Redirect to="/relogin" />);
    return(
      <div className={style.arnings}>
        <div className={style.accountAmount}>
          <div>
            <div className={style.accountItems}>
              10.00
              <h1>账户可用余额</h1>
            </div>
            <div className={style.lockAmount}>
              0.00
              <h1>账户冻结余额</h1>
            </div>
          </div>
          <p>
            <span onClick={this.widthdrawEvent.bind(this)}>提现</span>
          </p>
        </div>
        <ul className={style.search}>
          <li>
            创建时间
            <DatePicker className="ml10" formate="YYYY-MM-DD" onChange={this.changeFormEvent.bind(this, 'dateStart')} />
            <DatePicker className="ml10" formate="YYYY-MM-DD" onChange={this.changeFormEvent.bind(this, 'dateEnd')} />
          </li>
          <li className="ml30">
            结算单号
            <Input className="w180 ml10" value={search.orderNo} onChange={this.changeFormEvent.bind(this, 'orderNo')} />
          </li>
          <li className="ml30">
            <Button type="primary" onClick={this.searchEvent.bind(this)}>查询</Button>
          </li>
        </ul>
        <Table
          dataSource={earningsData}
          columns={columns}
          rowKey={record => record.id}
          pagination={pagination}
          className="table"
        />
      </div>
    )
  }
};
export default ArningsList;