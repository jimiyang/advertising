import React, {Component} from 'react';
import style from './style.less';
import QRCode from 'qrcode.react'; //二维码
class QrCode extends Component{
  constructor(props) {
    super(props);
    this.state = {
      qrUrl: null
    };
  }
  componentWillMount() {
    console.log(this.props.location.query.url);
    if (!this.props.location.query) return false;
    this.setState({qrUrl: this.props.location.query.url});
  }
  render() {
    return (
      <div className={style.financialModel}>
        <h1 className="nav-title">扫码充值</h1>
        <div className={style.qr}>
          <QRCode
            value={this.state.qrUrl}  //value参数为生成二维码的链接
            size={200} //二维码的宽高尺寸
            fgColor="#000000"  //二维码的颜色
          />
        </div>
      </div>
    )
  }  
};
export default QrCode;