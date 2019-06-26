import React, {Component} from 'react';
import {message} from 'antd';
import style from './style.less';
import QRCode from 'qrcode.react'; //二维码
import Redirect from 'umi/redirect';
import router from 'umi/router';
let timer;
class QrCode extends Component{
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      operatorLoginName: null,
      qrUrl: null,
      orderNo: null,
      messageTip: null
    };
  }
  async componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
    if (!loginInfo) return false;
    const rechargeInfo = this.props.location.query;
    if (!rechargeInfo) return false;
    await this.setState({operatorLoginName: loginInfo.data.loginName, qrUrl: rechargeInfo.payUrl, orderNo: rechargeInfo.orderNo});
    const {operatorLoginName, orderNo} = this.state;
    const params = {
      operatorLoginName,
      orderNo
    };
    //this.getOrderQuery(params);
    //this.orderStatus(params);
    timer=window.setInterval(this.orderStatus(params), 1000);
  }
  orderStatus = (params) => {
    window.api.baseInstance('api/topup/orderQuery', params).then(rs => {
      if (rs.data.status === 1) {
        console.log(33333);
        message.success(rs.message);
        router.push('/main/depositlist');
        clearTimeout(timer);
      } else if(rs.code === 300107 || rs.data.status === 2){
        console.log(11111);
        timer=window.setInterval(this.orderStatus(params), 3000);
      }
    }).catch(err => {
      if (err.code === 100000) {
        this.setState({redirect: true});
        window.localStorage.removeItem('login_info');
      } else {
        console.log('fail');
        timer=window.setInterval(this.orderStatus(params), 3000);
        this.setState({messageTip: err.message});
      }
    });
  }
  /*getOrderQuery = (params) => {
    window.api.baseInstance('api/topup/orderQuery', params).then(rs => {
      if (rs.data.status === 1) {
        console.log(rs);
        message.success(rs.message);
        router.push('/main/depositlist');
        clearTimeout(timer);
      } else if(rs.code === 300107 || rs.data.status === 2){
        timer =  setTimeout(()=>{this.getOrderQuery(params)}, 1000);
      }
    }).catch(err => {
      if (err.code === 100000) {
        this.setState({redirect: true});
        window.localStorage.removeItem('login_info');
      } else {
        console.log('fail');
        timer =  setTimeout(()=>{this.getOrderQuery(params)}, 1000);
        this.setState({messageTip: err.message});
      }
    });
  }*/
  componentWillUnmount() {
    //clearTimeout(timer);
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
        <div style={{marginTop: '20px'}}>{messageTip}</div>
      </div>
    )
  }  
};
export default QrCode;