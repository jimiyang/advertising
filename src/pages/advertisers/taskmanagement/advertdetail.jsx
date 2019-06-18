import React, {Component} from 'react';
import {Button, Radio, Input, message} from 'antd';
import style from './style.less';
import Redirect from 'umi/redirect';
const {TextArea} = Input;
class AdvertDetail extends Component{
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
        missionStatus: 16,
        loginName: '',
        audit_remark: '',
        id: ''
      },
      mediaTypeLabel: [],
      provinceTypeType: [],
      selmediaValData: [],
      selproviceValData: [],
      type: '0'//判断是查看活动页面[0]还是审核接单页面[1]
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
    window.api.baseInstance('api/ad/mission/getById', {id}).then(rs => {
      if (!rs.data) return false;
      const form = Object.assign(this.state.form, rs.data);
      console.log(form);
      const selmediaValData = this.initLabel('media', form.adCampaign.targetMediaCategory);
      const selproviceValData = this.initLabel('province', form.adCampaign.targetArea);
      this.setState({form, selmediaValData, selproviceValData});
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
  changeFormEvent = (e) => {
    const params = Object.assign(this.state.params, {audit_remark: e.target.value});
    this.setState({params});
  }
  //审核
  checkEvent = () => {
    if(!this.state.params.audit_remark) {
      message.error('请填写审核意见');
      return false;
    }
    window.api.baseInstance('api/ad/mission/checkMissionOrderById', this.state.params).then(rs => {
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
  //返回
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
    return(
      <div className={style.task}>
        <h1 className="nav-title">已接单的任务 > 查看推广活动</h1>
        <ul className={style.detaillist}>
          <li>
            订单号：<div>{form.adMissionOrder.missionId}</div>
          </li>
          <li>
            接单时间：<div>{window.common.getDate(form.adMissionOrder.createDate, true)}</div>
          </li>
          <li>
            广告位置：<div>{window.common.advertLocal[form.adMissionOrder.appArticlePosition]}</div>
          </li>
          <li>
            订单状态：<div>{window.common.orderStatus[Number(form.adMissionOrder.missionStatus) - 10]}</div>
          </li>
          <li>
            订单审核意见：<div  className={style.textarea}>{form.adMissionOrder.auditRemark}</div>
          </li>
          <li>
            接单公众号：<div>{form.adMissionOrder.appNickName}</div>
          </li>
          <li>
            接单笔数：<div>{form.adMissionOrder.missionReadCnt}</div>
          </li>
          <li>
            阅读单价：<div>{form.adMissionOrder.adUnitPrice}</div>
          </li>
          <li>
            活动名称：<div>{form.adCampaign.campaignName}</div>
          </li>
          <li>
            活动状态：<div>{window.common.postStatus[20 - Number(form.adCampaign.postStatus)]}</div>
          </li>
          <li>
            活动审核意见：<div className={style.textarea}>{form.adCampaign.auditRemark}</div>
          </li>
          <li>
            活动日期：
            <div>{form.adCampaign.dateStart} 至 {form.adCampaign.dateEnd}</div>
          </li>
          <li>
            条件设置：
            <div>
              <ul>
                <li>
                  <span className={style.stitle}>男女比例-{window.common.targetGender[Number(form.adCampaign.targetGender)]}</span>
                </li>
                <li>
                  <span className={style.stitle}>选择行业-{form.adCampaign.targetMediaCategory === "" ? '不限(默认)' : '自定义'}</span>
                  <div className={`${style.tags} ${form.adCampaign.targetMediaCategory === "" ? 'hide' : null}`}>
                    {
                      mediaTypeLabel.map((item, index) => (
                        <label key={index} className={Number(item.value) === selmediaValData[index] ? style.active : null}>{item.label}</label>
                      ))
                    } 
                  </div>
                </li>
                <li>
                  <span className={style.stitle}>选择地域-{form.adCampaign.targetArea === "" ? '不限(默认)' : '自定义'}</span>
                  <div className={`${style.tags} ${form.adCampaign.targetArea === "" ? 'hide' : null}`}>
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
          <li>
            活动形式：
            <div>{window.common.getAdType(form.adCampaign.adType)}</div>
          </li>
          <li>
            活动素材：
            <div className={style.coverimg}>
              <p>展示封面标题，点击可查看详情</p>
              <img src={form.adCampaign.impImage} />
            </div>
          </li>
          <li>
            阅读单价：
            <div>{form.adCampaign.unitPrice}元/次阅读</div>
          </li>
          <li>
            活动效果：
            <div>预计您的广告将实现<em className="red-color m5">{form.adCampaign.availableCnt}</em>次有效阅读</div>
          </li>
          {
            type === 1 ? <li>审核状态：<div><Radio value={params.missionStatus} defaultChecked={true}>不通过</Radio></div></li> : null
          }
          {
            type === 1 ? <li>活动审核意见：<div><TextArea rows={4} className={style.textarea} value={params.audit_remark} onChange={this.changeFormEvent.bind(this)} /></div></li> : null
          }  
          {
            type === 1 ?
            <li className={style.btnitems}><Button type="primary" onClick={this.checkEvent.bind(this)}>提交</Button></li>
            :
            <li className="mt30"><Button onClick={this.goBackEvent.bind(this)}>返回</Button></li>
          } 
        </ul>
      </div>
    )
  }
}
export default AdvertDetail;