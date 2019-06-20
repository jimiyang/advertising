import React, {Component} from 'react';
import {Button, message} from 'antd';
import Redirect from 'umi/redirect';
import {isNull} from 'util';
import style from './style.less';
class AdTaskDetail extends Component{
  constructor(props){
    super(props);
    this.state = {
      redirect: false,
      form: {
        adType: '',
        advertiserName: '',
        availableCnt: 0,
        billingType: 0,
        campaignId: '',
        campaignName: '',
        createDate: '',
        dateEnd: '',
        dateStart: '',
        merchantCode: '',
        postAmtTotal: '',
        postStatus: '',
        targetArea: '',
        targetGender: '',
        targetMediaCategory: '',
        unitPrice: 0
      }
    };
  }
  componentWillMount() {
    if (isNull(this.props.location.state)) return false;
    new Promise((resolve, reject) => {
      window.api.baseInstance('flow/campaign/detail', {campaignId: this.props.location.state.id}).then(rs => {
        resolve(rs.data);
      }).catch(err => {
        if (err.code === 100000) {
          this.setState({redirect: true});
          window.localStorage.removeItem('login_info');
        } else {
          message.error(err.message);
        }
      });
    }).then(res => {
      this.setState({form: res.campaign});
    });
  }
  goBackEvent = () => {
    window.history.go(-1);
  }
  render() {
    const {
      redirect,
      form
    } = this.state;
    if (redirect) return (<Redirect to="/relogin" />);
    return(
      <div className={style.pubAccount}>
        <h1 className="nav-title">我的任务 > 任务详情</h1>
        <dl className={style.editItems}>
          <dd className={style.pb20}>
            <em className={style.name}>公众号名称</em>
            <div>万物生活派</div>
          </dd>
          <dd className={style.pb20}>
            <em className={style.name}>活动名称</em>
            <div>{form.campaignName}</div>
          </dd>
          <dd>
            <em className={style.name}>媒体标签</em>
            <div>{form.targetMediaCategory}</div>
          </dd>
          <dd>
            <em className={style.name}>男女比例</em>
            <div>{form.targetGender}</div>
          </dd>
          <dd>
            <em className={style.name}>时间范围</em>
            <div>{window.common.getDate(form.dateStart, true)}至{window.common.getDate(form.dateEnd, true)}</div>
          </dd>
          <dd>
            <em className={style.name}>阅读单价</em>
            <div>{form.unitPrice}</div>
          </dd>
          <dd>
            <em className={style.name}>商户Code码</em>
            <div>{form.merchantCode}</div>
          </dd>
          <dt>
            <Button className="ml40" onClick={this.goBackEvent.bind(this)}>返回</Button>
          </dt>
        </dl>
      </div>
    )
  }
};
export default AdTaskDetail;