import React, {Component} from 'react';
import {Button, Radio, Input, message} from 'antd';
import Redirect from 'umi/redirect';
import Link from 'umi/link';
import style from '../style.less';
const {TextArea} = Input;
class ViewDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
    redirect: false,
      form: {
        adCampaign: {
          campaignName: '', //活动名称
          postStatus: '', //活动状态
          auditRemark: '', //活动审核意见
          dateStart: '', //活动开始时间
          dateEnd: '', //活动结束时间
          targetGender: '', //男女比例
          targetMediaCategory: '', //行业标签
          impImage: '', //货送素材
          targetArea: '', //地域
          adType: '', //活动形式
          unitPrice: '', //活动阅读单价
        },
        adMissionOrder: {
          missionId: '', //订单号
          createDate: '', //接单时间
          appArticlePosition: '', //广告位置
          missionStatus: '', //订单状态
          auditRemark: '', //订单审核意见
          appNickName: '', //接单公众号
          missionReadCnt: '', //接单笔数
          adUnitPrice: '', //阅读单价
        },
      },
      params: {
        postStatus: 23,
        loginName: '',
        auditRemark: '',
        id: ''
      },
      mediaTypeLabel: [],
      provinceTypeType: [],
      selmediaValData: [],
      selproviceValData: [],
      type: 0//判断是查看活动页面[0]还是审核接单页面[1]
    };
  }
  componentWillMount() {
    const state = this.props.location.state;
    if (!state.id) return false;
    Promise.all([window.api.baseInstance('admin/system/dict/getDictByType', {type: 'mediaType'}), window.api.baseInstance('admin/system/dict/getDictByType', {type: 'provinceType'})]).then(rs => {
      this.initForm(state.id);
      const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
      if (!loginInfo) return false;
      const params = Object.assign(this.state.params, {loginName: loginInfo.data.loginName, id: state.id});
      this.setState({
        params,
        type: state.type,
        mediaTypeLabel: rs[0].data,
        selmediaValData: new Array(rs[0].data.length),
        provinceTypeType: rs[1].data,
        selproviceValData: new Array(rs[1].data.length)
      });
    }).catch(err => {
      if (err.code === 100000) {
        this.setState({redirect: true});
        window.localStorage.removeItem('login_info');
      }
      message.error(err.message);
    });
  }
  //初始化数据详情
  initForm = (id) => {
    window.api.baseInstance('api/ad/campaign/getById', {id}).then(rs => {
      if (!rs.data) return false;
      const form = Object.assign(this.state.form, rs.data);
      console.log(form);
      const selmediaValData = this.initLabel('media', form.targetMediaCategory);
      const selproviceValData = this.initLabel('province', form.targetArea);
      const params = Object.assign(this.state.params, {auditRemark: form.auditRemark});
      this.setState({form, selmediaValData, selproviceValData, params});
    }).catch(err => {
      if (err.code === 100000) {
        this.setState({redirect: true});
        window.localStorage.removeItem('login_info');
      } else {
        message.error(err.message);
      }
    });
  }
  initLabel = (type, data) => {
    if (data.length === 0) return false;
    let arr = data;
    switch (type) {
      case 'media':
        const mediaLabel = this.state.mediaTypeLabel;
        let selmediaValData = this.state.selmediaValData;
        JSON.parse(arr).map((node, i) => {
          mediaLabel.map((item, index) => {
            if (node == Number(item.value)) {
              selmediaValData[index] = node;
            }
          });
        });
        return selmediaValData;
      case 'province':
        const provinceLabel = this.state.provinceTypeType;
        let selproviceValData = this.state.selproviceValData;
        JSON.parse(arr).map((node, i) => {
          provinceLabel.map((item, index) => {
            if (node == Number(item.value)) {
              selproviceValData[index] = node;
            }
          });
        });
      return selproviceValData;
      default: 
        break;
    }
  }
  changeFormEvent = (type, e) => {
    const params = Object.assign(this.state.params, {[type]: e.target.value});
    this.setState({params});
  }
  checkEvent = () => {
    if(!this.state.params.auditRemark) {
      message.error('请填写审核意见');
      return false;
    }
    window.api.baseInstance('api/ad/campaign/updatePostStatusById', this.state.params).then(rs => {
      message.success(rs.message);
      window.history.go(-1);
    }).catch(err => {
      if (err.code === 100000) {
        this.setState({redirect: true});
        window.localStorage.removeItem('login_info');
      } else {
        message.error(err.message);
      }
    });
  }
  goBackEvent = () => {
    window.history.go(-1);
  }
  render() {
    const {
      redirect,
      form,
      mediaTypeLabel,
      provinceTypeType,
      type,
      params,
      selmediaValData,
      selproviceValData
    } = this.state;
    if (redirect) return (<Redirect to="/relogin" />);
    return (
      <div className={style.administrator}>
        <h1 className="nav-title">活动详情</h1>
        <h2 className="small-title">基本信息</h2>
        <ul className={style.detaillist}>
            <li>所属广告主：<div>{form.advertiserName}</div></li>
            <li>活动名称：<div>{form.campaignName}</div></li>
            <li>活动日期：<div>{window.common.getDate(form.dateStart, false)} 至 {window.common.getDate(form.dateEnd, false)}</div></li>
            <li>
                条件设置：
                <div>
                  <ul>
                    <li><span className={style.stitle}>男女比例-{window.common.targetGender[Number(form.adCampaign.targetGender)]}</span></li>
                    <li>
                      <span className={style.stitle}>选择行业-{form.targetMediaCategory === '[]' ? '不限(默认)' : '自定义'}</span>
                      <div className={`${style.tags} ${form.targetMediaCategory === '[]' ? 'hide' : null}`}>
                        {
                          mediaTypeLabel.map((item, index) => (
                            <label key={index} className={Number(item.value) === selmediaValData[index] ? style.active : null}>{item.label}</label>
                          ))
                        } 
                      </div>
                    </li>
                    <li>
                        <span className={style.stitle}>选择地域-{form.targetArea === '[]' ? '不限(默认)' : '自定义'}</span>
                        <div className={`${style.tags} ${form.targetArea === '[]' ? 'hide' : null}`}>
                          {
                            provinceTypeType.map((item, index) => (
                              <label key={index} className={Number(item.value) === selproviceValData[index] ? style.active : null}>{item.label}</label>
                            ))
                          } 
                        </div>
                      </li>
                    </ul>
                </div>
            </li>
            <li>计费方式：<div>{form.billingType === 0 ? 'CPC' : '万粉'}</div></li>
            <li>活动素材：
              {
                form.postContent === undefined ? <div className={style.coverimg}><p>暂未绑定活动素材</p></div>
                :
                <div className={style.coverimg}>
                  <p>展示封面标题，点击可查看详情</p>
                  <a href={`${window.common.articleUrl}?id=${form.postContent}`} target="_blank">
                    <img src={form.impImage} />
                    <span>{form.extrendJson}</span>
                  </a>
                </div>
              }
            </li>
            <li>阅读单价：<div>{form.unitPrice}</div></li>
            <li>活动预算：<div>{form.postAmtTotal}元</div></li>
            <li>推广预告：<div>预计您的广告将实现<em className="red-color m5">{form.availableCnt}</em>次有效阅读</div></li>
            {
              type === 1 ? <li>审核状态：<div>
                <Radio.Group onChange={this.changeFormEvent.bind(this, 'postStatus')} value={params.postStatus}>
                  <Radio value={23}>通过</Radio>
                  <Radio value={22}>不通过</Radio>
                </Radio.Group>
                </div>
              </li> : null
            }
            {
              type === 1 ? <li>活动审核意见：<div><TextArea rows={4} className={style.textarea} value={params.auditRemark} onChange={this.changeFormEvent.bind(this, 'auditRemark')} /></div></li> : null
            }  
            {
              type === 1 ?
              <li className={style.btnitems}>
                <Button type="primary" onClick={this.checkEvent.bind(this)}>提交</Button>
              </li>
              :
              <li className="mt30"><Button onClick={this.goBackEvent.bind(this)}>返回</Button></li>
            } 
          </ul>      
      </div>
    ) 
  }
}
export default ViewDetail;