import React, {Component} from 'react';
import {Button, message} from 'antd';
import style from './style.less';
class ActivityDetail extends Component{
  constructor(props) {
    super(props);
    this.state = {
        redirect: false,
        form: {
          campaignName: '', //活动名称
          postStatus: '', //活动状态
          auditRemark: '', //活动审核意见
          dateStart: '', //活动开始时间
          dateEnd: '', //活动结束时间
          targetGender: '', //男女比例
          targetMediaCategory: '', //行业标签
          targetArea: '', //地域
          adType: '', //活动形式
          unitPrice: '', //活动阅读单价
          billingType: 0 //计费方式
        },
        mediaTypeLabel: [],
        provinceTypeType: []
    };
  }
  componentWillMount() {
    if (!this.props.location.query.id) return false;
    this.initForm(this.props.location.query.id);
    this.getDictByType('mediaType').then(rs => {
      this.setState({mediaTypeLabel: rs});
    });
    this.getDictByType('provinceType').then(rs => {
      this.setState({provinceTypeType: rs});
    });
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
    if (!loginInfo) return false;
  }
  initForm = (id) => {
    window.api.baseInstance('api/ad/campaign/getById', {id}).then(rs => {
      console.log(rs);
      this.setState({form: rs.data});
    });
  }
  //获取行业
  getDictByType = (type) => {
    return new Promise((resolve, reject) => {
      window.api.baseInstance('admin/system/dict/getDictByType', {type}).then(rs => {
        resolve(rs.data);
      }).catch(err => {
        if (err.code === 100000) {
          this.setState({redirect: true});
          window.localStorage.removeItem('login_info');
        } else {
          message.error(err.message);
        }
      });
    });
  }
  goBackEvent = () => {
    window.history.go(-1);
  }
  render() {
    const {form, mediaTypeLabel, provinceTypeType} = this.state;
    return (
      <div className={style.mypromotion}>
        <h1 className="nav-title">我的推广活动 > 活动详情</h1>
        <div className={style.createBlocks}>
          <h2 className="small-title"><em></em>基本信息</h2>
          <ul className={style.detaillist}>
              <li>活动名称：<div>{form.campaignName}</div></li>
              <li>活动日期：<div>{window.common.getDate(form.dateStart, true)}至{window.common.getDate(form.dateEnd, true)}</div></li>
              <li>活动形式：<div>{window.common.getAdType(form.adType)}</div></li>
              <li>
                条件设置：
                <div>
                  <ul>
                    <li>
                      <span className={style.stitle}>男女比例-{window.common.targetGender[Number(form.targetGender)]}</span>
                    </li>
                    <li>
                      <span className={style.stitle}>选择行业-{form.targetMediaCategory === "" ? '不限(默认)' : '自定义'}</span>
                      <div className={`${style.tags} ${form.targetMediaCategory === "" ? 'hide' : null}`}>
                        {
                          mediaTypeLabel.map((item, index) => (
                            <label key={index} className={item.value === form.targetMediaCategory ? style.active : null}>{item.label}</label>
                          ))
                        } 
                      </div>
                    </li>
                    <li>
                      <span className={style.stitle}>选择地域-{form.targetArea === "" ? '不限(默认)' : '自定义'}</span>
                      <div className={`${style.tags} ${form.argetArea === "" ? 'hide' : null}`}>
                        {
                          provinceTypeType.map((item, index) => (
                            <label key={index} className={item.value === form.targetArea ? style.active : null}>{item.label}</label>
                          ))
                        } 
                      </div>
                    </li>
                  </ul>  
                </div>
              </li>
              <li>计费方式：<div>{form.billingType === 0 ? 'CPC' : '万粉'}</div></li>
            </ul>
            <h2 className="small-title"><em></em>价格信息</h2>
            <ul className={style.detaillist}>
              <li>阅读单价：<div>{form.unitPrice}元/次阅读</div></li>
              <li>活动预算：<div>{form.postAmtTotal}元</div></li>
              <li>
                活动效果：
                <div>预计您的广告将实现<em className="red-color m5">{form.availableCnt}</em>次有效阅读</div>
              </li>
              <li className="mt30"><Button onClick={this.goBackEvent.bind(this)}>返回</Button></li>
            </ul>
        </div>
      </div>
    )
  }
};
export default ActivityDetail;