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
      operatorLoginName: null,
      qrUrl: null,
      orderNo: null,
      amount: null,
      messageTip: '充值订单支付中',
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
    this.orderStatus(params);
  }
  orderStatus = (params) => {
    timer = setTimeout(() => {
      orderQuery(params).then(rs => {
        this.setState({messageTip: rs.message});
        console.log(rs);
        if(rs.success) {
          if (rs.data.status === 1) {
            this.openNotification();
          } else {
            message.error(rs.data.msg);
          }
          router.push('/main/depositlist');
          clearTimeout(timer);
          return false;
        } else {
          this.orderStatus(params);
        }
      })
    }, 2000);
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
  componentWillUnmount() {
    clearTimeout(timer);
  }
  render() {
    const {
      qrUrl,
      messageTip
    } = this.state;
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