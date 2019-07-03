import React, {Component} from 'react';
import {message, notification} from 'antd';
import style from './style.less';
import QRCode from 'qrcode.react'; //二维码
import Redirect from 'umi/redirect';
import router from 'umi/router';
import {
  orderQuery
} from '../../../api/api';//接口地址
let timer;
class QrCode extends Component{
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      operatorLoginName: null,
      qrUrl: null,
      orderNo: null,
      amount: null,
      messageTip: null,
      type: 'WX'
    };
  }
  
  async componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
    if (!loginInfo) return false;
    const rechargeInfo = this.props.location.query;
    if (!rechargeInfo) return false;
    await this.setState({
      operatorLoginName: loginInfo.data.loginName,
      qrUrl: rechargeInfo.payUrl,
      orderNo: rechargeInfo.orderNo,
      amount: rechargeInfo.amount,
      type: rechargeInfo.channelType
    });
    const {operatorLoginName, orderNo} = this.state;
    const params = {
      operatorLoginName,
      orderNo
    };
    //this.getOrderQuery(params);
    //this.orderStatus(params);
    timer=window.setInterval(this.orderStatus(params), 3000);
  }
  openNotification = ()=>{
    //使用notification.success()弹出一个通知提醒框 
    notification.success({
      message:"充值成功",
      description: (
        <div>
          <p>充值金额：{this.state.amount} 元</p>
          <p>充值时间：{window.common.getTime()}</p>
          <p>充值单号：{this.state.orderNo}</p>
        </div>
      ),
      duration: 2, //1秒
    }); 
  }
  orderStatus = (params) => {
    orderQuery(params).then(rs => {
      console.log(rs);
      if (rs.data.status === 1) {
        this.openNotification();
        router.push('/main/depositlist');
        clearTimeout(timer);
      } else if(rs.code === 300107 || rs.data.status === 2){
        timer=window.setInterval(this.orderStatus(params), 500);
      }
    }).catch(error => {
      this.setState({messageTip: error.message});
    });
  }
  componentWillUnmount() {
    clearInterval(timer);
  }
  render() {
    const {
      redirect,
      qrUrl,
      messageTip
    } = this.state;
    if (redirect) return (<Redirect to="/relogin" />);
    return (
      <div className={style.financialModel}>
        <h1 className="nav-title">扫码充值</h1>
        <div className={style.qr}>
          <QRCode
            value={qrUrl}  //value参数为生成二维码的链接
            size={200} //二维码的宽高尺寸
            fgColor="#000000"  //二维码的颜色
          />
        </div>
        <div style={{marginTop: '20px'}}>温馨提示：{messageTip}</div>
      </div>
    )
  }  
};
export default QrCode;