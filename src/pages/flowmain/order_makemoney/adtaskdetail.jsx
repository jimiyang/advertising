import React, {Component} from 'react'
import {Button, message} from 'antd'
import Redirect from 'umi/redirect'
import {isNull} from 'util'
import style from './style.less'
import {
  detail,
  getDictByType
} from '../../../api/api'
class AdTaskDetail extends Component{
  constructor(props){
    super(props)
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
      },
      mediaTypeLabel: [],
      provinceLabelType: [],
      selmediaValData: [], //选中的行业标签
      selproviceValData: [] //选中的地域标签
    }
  }
  async componentWillMount() {
    if (isNull(this.props.location.state)) return false
    await this.setState({campaignId: this.props.location.state.id})
    Promise.all([getDictByType({type: 'mediaType'}), getDictByType({type: 'provinceType'})]).then(rs => {
      this.setState({
        mediaTypeLabel: rs[0].data,
        selmediaValData: new Array(rs[0].data.length),
        provinceLabelType: rs[1].data,
        selproviceValData: new Array(rs[1].data.length)
      })
      this.initForm(this.props.location.state.id)
    })
    this.initForm()
  }
  initForm = () => {
    const params = {
      campaignId: this.state.campaignId
    }
    detail(params).then(rs => {
      const selmediaValData = this.initLabel('media', rs.data.campaign.targetMediaCategory)
      const selproviceValData = this.initLabel('province', rs.data.campaign.targetArea)
      this.setState({form: rs.data.campaign, selmediaValData, selproviceValData})
    })
  }
  initLabel = (type, data) => {
    if (data === undefined) return false
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
        const provinceLabel = this.state.provinceLabelType
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
  goBackEvent = () => {
    window.history.go(-1)
  }
  render() {
    const {
      redirect,
      form,
      selmediaValData,
      mediaTypeLabel,
      selproviceValData,
      provinceLabelType
    } = this.state
    if (redirect) return (<Redirect to="/relogin" />)
    return(
      <div className={style.pubAccount}>
        <h1 className="nav-title">我的任务 > 任务详情</h1>
        <div className={style.contentItems}>
          <dl className={style.editItems}>
            <dd>任务id<div></div></dd>
            <dd>接单公众号<div></div></dd>
            <dd>公众号id<div></div></dd>
            <dd>发文位置<div></div></dd>
            <dd>计费方式<div></div></dd>
            <dd>阅读单价<div></div></dd>
            <dd>接单数量（阅读）<div></div></dd>
            <dd>接单时间<div></div></dd>
            <dd>预计发文时间<div></div></dd>
            <dd>实际发文时间<div></div></dd>
          </dl>
          <dl className={style.editItems}>
            <dd className={style.pb20}>
              <em className={style.name}>活动名称</em>
              <div>{form.campaignName}</div>
            </dd>
            <dd className={style.pb20}>
              <em className={style.name}>活动形式</em>
              <div>{window.common.getAdType(form.adType)}</div>
            </dd>
            <dd>
              <em className={style.name}>行业标签</em>
              <div>
                <span className={style.stitle}>选择行业-{form.targetMediaCategory === '[]' ? '不限(默认)' : '自定义'}</span>
                <div className={`${style.tags} ${form.targetMediaCategory === '[]' ? 'hide' : null}`}>
                  {
                    mediaTypeLabel.map((item, index) => (
                      <label key={index} className={Number(item.value) === selmediaValData[index] ? style.active : null}>{item.label}</label>
                    ))
                  } 
                </div>
              </div>
            </dd>
            <dd>
              <em className={style.name}>男女比例</em>
              <div>{window.common.targetGender[form.targetGender]}</div>
            </dd>
            <dd>
              <em className={style.name}>所在区域</em>
              <div>
                <span className={style.stitle}>选择行业-{form.targetArea === '[]' ? '不限(默认)' : '自定义'}</span>
                <div className={`${style.tags} ${form.targetArea === '[]' ? 'hide' : null}`}>
                  {
                    provinceLabelType.map((item, index) => (
                      <label key={index} className={Number(item.value) === selproviceValData[index] ? style.active : null}>{item.label}</label>
                    ))
                  } 
                </div>
              </div>
            </dd>
            <dd>
              <div>
                活动素材：
                {
                  form.postContent === undefined ? <div className={style.coverimg}><p>暂未绑定活动素材</p></div>
                  :
                  <div className={style.coverimg}>
                    <a href={`${form.postContent === "" ? 'javascript:' : `${window.common.articleUrl}fshstatic/view.html?id=${form.postContent}`}`} target="_blank">
                      <img src={form.impImage} />
                      <span>{form.extrendJson}</span>
                    </a>
                  </div>
                }
              </div>
            </dd>
            <dd>
              <em className={style.name}>活动时间</em>
              <div>{window.common.getDate(form.dateStart)}至{window.common.getDate(form.dateEnd)}</div>
            </dd>
            <dd>
              <em className={style.name}>计费方式</em>
              <div>{window.common.billingTypesData[form.billingType]}</div>
            </dd>
            <dd>
              <em className={style.name}>阅读单价</em>
              <div>{form.unitPrice}元 / 次阅读</div>
            </dd>
            <dd>
              <em className={style.name}>商户Code码</em>
              <div>{form.merchantCode}</div>
            </dd>
            
          </dl>
          
        </div>
        <div>
            <Button className="ml40" onClick={this.goBackEvent.bind(this)}>返回</Button>
          </div>
      </div>
    )
  }
}
export default AdTaskDetail