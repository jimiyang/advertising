import React, {Component} from 'react'
import {Button, Radio, Input, message} from 'antd'
import style from './style.less'
import Redirect from 'umi/redirect'
import {
  missiongetById,
  getDictByType,
  checkMissionOrderById
} from '../../../api/api'//接口地址
const {TextArea} = Input
class AdvertDetail extends Component{
  constructor(props) {
    super(props)
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
        missionStatus: 11,
        loginName: '',
        audit_remark: '',
        id: ''
      },
      mediaTypeLabel: [],
      provinceTypeType: [],
      selmediaValData: [],
      selproviceValData: [],
      type: '0'//判断是查看活动页面[0]还是审核接单页面[1]
    }
  }
  componentWillMount() {
    const state = this.props.location.state
    if (!state.id) return false
    Promise.all([getDictByType({type: 'mediaType'}), getDictByType({type: 'provinceType'})]).then(rs => {
      this.initForm(state.id)
      const loginInfo = JSON.parse(window.localStorage.getItem('login_info'))
      if (!loginInfo) return false
      const params = Object.assign(this.state.params, {loginName: loginInfo.data.loginName, id: state.id})
      this.setState({
        params,
        type: state.type,
        mediaTypeLabel: rs[0].data,
        selmediaValData: new Array(rs[0].data.length),
        provinceTypeType: rs[1].data,
        selproviceValData: new Array(rs[1].data.length)
      })
    })
  }
  //初始化数据详情
  initForm = (id) => {
    missiongetById({id}).then(rs => {
      if (!rs.data) return false
      const form = Object.assign(this.state.form, rs.data)
      const selmediaValData = this.initLabel('media', form.adCampaign.targetMediaCategory)
      const selproviceValData = this.initLabel('province', form.adCampaign.targetArea)
      const params = Object.assign(this.state.params, {audit_remark: form.adMissionOrder.auditRemark})
      this.setState({form, selmediaValData, selproviceValData, params})
    })
  }
  initLabel = (type, data) => {
    if (data.length === 0) return false
    let arr = data
    switch (type) {
      case 'media':
        const mediaLabel = this.state.mediaTypeLabel
        let selmediaValData = this.state.selmediaValData
        JSON.parse(arr).map((node, i) => {
          mediaLabel.map((item, index) => {
            if (node == Number(item.value)) {
              selmediaValData[index] = node
            }
          })
        })
        return selmediaValData
      case 'province':
        const provinceLabel = this.state.provinceTypeType
        let selproviceValData = this.state.selproviceValData
        JSON.parse(arr).map((node, i) => {
          provinceLabel.map((item, index) => {
            if (node == Number(item.value)) {
              selproviceValData[index] = node
            }
          })
        })
      return selproviceValData
      default: 
        break
    }
  }
  changeFormEvent = (type, e) => {
    const params = Object.assign(this.state.params, {[type]: e.target.value})
    this.setState({params})
  }
  //审核
  checkEvent = () => {
    if(!this.state.params.audit_remark) {
      message.error('请填写审核意见')
      return false
    }
    checkMissionOrderById(this.state.params).then(rs => {
      message.success(rs.message)
      window.history.go(-1)
    })
  }
  //返回
  goBackEvent = () => {
    window.history.go(-1)
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
    } = this.state
    if (redirect) return (<Redirect to="/relogin" />)
    return(
      <div className={style.task}>
        <h1 className="nav-title">已接单的任务 > 查看任务详情</h1>
        <div className={style.connentItems}>
          <ul className={style.detaillist}>
            <li>任务id：<div>{form.adMissionOrder.missionId}</div></li>
            <li>接单公众号：<div>{form.adMissionOrder.appNickName}</div></li>
            <li>公众号id：<div>{form.adMissionOrder.appId}</div></li>
            <li>发文位置：<div>{window.common.advertLocal[form.adMissionOrder.appArticlePosition]}</div></li>
            <li>计费方式：<div>{window.common.billingTypesData[form.adCampaign.billingType]}</div></li>
            <li>阅读单价：<div>{form.adMissionOrder.adUnitPrice}</div></li>
            <li>接单数量（阅读）：<div>{form.adMissionOrder.missionReadCnt}</div></li>
            <li>接单时间：<div>{window.common.getDate(form.adMissionOrder.createDate, true)}</div></li>
            <li>预计发文时间：<div>{form.adMissionOrder.planPostArticleTime}</div></li>
            <li>实际发文时间：<div>{form.adMissionOrder.realPostArticleTime}</div></li>
            <li>
              活动效果：
              <div>预计您的广告将实现<em className="red-color m5">{window.common.formatNumber(Math.round(form.adCampaign.postAmtTotal / form.adCampaign.unitPrice))}</em>次有效阅读</div>
            </li>
            {
              type === 1 ? <li>审核状态：<div>
                <Radio.Group onChange={this.changeFormEvent.bind(this, 'missionStatus')} value={params.missionStatus}>
                  <Radio value={11}>通过</Radio>
                  <Radio value={16}>不通过</Radio>
                </Radio.Group>
                </div>
              </li> : null
            }
            {
              type === 1 ? <li><TextArea rows={4} className={style.textarea} value={params.audit_remark} onChange={this.changeFormEvent.bind(this, 'audit_remark')} /></li> : null
            }  
            <li>
              <div className="mt30">
                {
                  type === 1 ?
                    <Button type="primary" onClick={this.checkEvent.bind(this)}>提交</Button>
                  : null
                }
                <Button className="ml30" onClick={this.goBackEvent.bind(this)}>返回</Button>
              </div>
            </li>
          </ul>
          <ul className={style.detaillist}>
            <li>活动名称：<div>{form.adCampaign.campaignName}</div></li>
            <li>活动id：<div>{form.adCampaign.campaignId}</div></li>
            <li>
              <div>
                活动素材：
                <div className={style.coverimg}>
                  <a href={`${window.common.articleUrl}fshstatic/view.html?id=${form.adCampaign.postContent}`} target="_blank">
                    <img src={form.adCampaign.impImage} />
                    <span>{form.adCampaign.extrendJson}</span>
                  </a>
                </div>
              </div>
            </li>
            <li>
              活动日期：
              <div>{window.common.getDate(form.adCampaign.dateStart, false)} 至 {window.common.getDate(form.adCampaign.dateEnd, false)}</div>
            </li>
            <li>
              活动形式：
              <div>{window.common.getAdType(form.adCampaign.adType)}</div>
            </li>
            <li>
              条件设置：
              <div>
                <ul>
                  <li>
                    <span className={style.stitle}>男女比例-{window.common.targetGender[Number(form.adCampaign.targetGender)]}</span>
                  </li>
                  <li>
                    <span className={style.stitle}>选择行业-{form.adCampaign.targetMediaCategory === '[]' ? '不限(默认)' : '自定义'}</span>
                    <div className={`${style.tags} ${form.adCampaign.targetMediaCategory === '[]' ? 'hide' : null}`}>
                      {
                        mediaTypeLabel.map((item, index) => (
                          <label key={index} className={Number(item.value) === selmediaValData[index] ? style.active : null}>{item.label}</label>
                        ))
                      } 
                    </div>
                  </li>
                  <li>
                    <span className={style.stitle}>选择地域-{form.adCampaign.targetArea === '[]' ? '不限(默认)' : '自定义'}</span>
                    <div className={`${style.tags} ${form.adCampaign.targetArea === '[]' ? 'hide' : null}`}>
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
          </ul>
        </div>
      </div>
    )
  }
}
export default AdvertDetail