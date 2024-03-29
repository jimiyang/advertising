import React, {Component} from 'react'
import {Select, DatePicker, Input, message, Button, Form} from 'antd'
import style from './style.less'
import moment from 'moment'
import {
  detail,
  getDictByType,
  flowMissionAdd
} from '../../../api/api'
const Option = Select.Option
class Receivead extends Component{
  constructor(props) {
    super(props)
    this.state = {
      currentTime: null,
      isDisabled: false,
      loginName: null,
      form: {
       campaignId: null,
       missionReadCnt: null,
       flowMerchantCode: null,
       appId: null,
       appNickName: null,
       adMerchantCode: null,
       targetMediaCategory: null,
       targetArea: null,
       articlePosition: null
      },
      mediaTypeLabel: [],
      provinceLabelType: [],
      selmediaValData: [],
      selprovinceValData: []
    }
  }
  componentWillMount() {
    Promise.all([getDictByType({type: 'mediaType'}), getDictByType({type: 'provinceType'})]).then(rs => {
      this.initForm(this.props.location.state.campaignId)
      let form = this.state.form
      form = Object.assign(form, this.props.location.state)
      const loginInfo = JSON.parse(window.localStorage.getItem('login_info'))
      if (!loginInfo) return false
      this.setState({
        mediaTypeLabel: rs[0].data,
        selmediaValData: new Array(rs[0].data.length),
        provinceLabelType: rs[1].data,
        selprovinceValData: new Array(rs[1].data.length),
        form,
        loginName: loginInfo.data.loginName
      })
    })
  }
  initForm = (campaignId) => {
    detail({campaignId}).then(rs => {
      const form = Object.assign(this.state.form, rs.data.campaign)
      const selmediaValData = this.initLabel('media', form.targetMediaCategory)
      const selprovinceValData = this.initLabel('province', form.targetArea)
      this.setState({form, selmediaValData, selprovinceValData})
    })
  }
   //初始化标签
   initLabel = (type, data) => {
    let arr = data
    switch (type) {
      case 'media':
        const mediaLabel = this.state.mediaTypeLabel
        let selmediaValData = this.state.selmediaValData
        if (arr !== '' || arr.length !== 0) {
          JSON.parse(arr).map((node, i) => {
            mediaLabel.map((item, index) => {
              if (node == Number(item.value)) {
                selmediaValData[index] = item.label
              }
            })
          })
        }
        return selmediaValData
      case 'province':
        const provinceLabel = this.state.provinceLabelType
        let selproviceValData = this.state.selprovinceValData
        if (arr !== '' || arr.length !== 0) {
          JSON.parse(arr).map((node, i) => {
            provinceLabel.map((item, index) => {
              if (node == Number(item.value)) {
                selproviceValData[index] = item.label
              }
            })
          })
        }
        return selproviceValData

      default: 
        break
    }
  }
  changeValueEvent = (type, e, value) => {
    let {form} = this.state
    let obj = {}
    switch(type) {
      case 'articlePosition':
        obj = {[type]: e}
        break
      case 'missionReadCnt':
        obj = {[type]: e.target.value}
        
        break
      case 'planPostArticleTime':
        obj = {[type]: value}
        break
      default:
        break
    }
    form = Object.assign(form, obj)
    this.setState({form})
  }
  //确定接广告提交事件
  createEvent = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {form, loginName} = this.state
        //form = Object.assign(form, values)
        const params = {
          campaignId: form.campaignId,
          appId: form.appId,
          appNickName: form.appNickName,
          adMerchantCode: form.merchantCode,
          appMediaTags: form.targetMediaCategory,
          campaignName: form.campaignName,
          unitPrice: form.unitPrice,
          loginName,
          articlePosition: form.articlePosition,
          missionReadCnt: form.missionReadCnt,
          planPostArticleTime: form.planPostArticleTime
        }
        this.setState({isDisabled: true})
        flowMissionAdd(params).then(rs => {
          this.setState({isDisabled: false})
          if (rs.success) {
            message.success(rs.message)
            window.history.go(-1)
          } else {
            message.error(rs.message)
          }
        })
      }
    })
  }
  goBackEvent = () => {
    window.history.go(-1)
  }
  disabledEndDate = (endValue) => {
    const startValue = this.state.currentTime
    if (!endValue || !startValue) {return false}
    return endValue.valueOf() <= startValue.valueOf()
  }
  handleEndOpenChange = (open) => {
    let me = this
    if(open){
      me.currentTime = moment()
    }
    this.setState({currentTime: moment()})
  }
  render() {
    const {
      form,
      selmediaValData,
      selprovinceValData,
      isDisabled
    } = this.state
    const {getFieldDecorator} = this.props.form
    const passwordValidator = (rule, value, callback) => {
      //const { getFieldValue } = this.props.form
      if (value > form.availableCnt) {
        callback('建议接单数量不能大于最大阅读数')
      } // 必须总是返回一个 callback，否则 validateFields 无法响应
      let reg = /^[1-9]\d*$/
      if (!reg.test(value)) {
        callback('只能输入整数')
      }
      callback() 
    }
    return (
      <div className={style.pubAccount}>
        <ul className={style.receiveAd}>
          <Form onSubmit={this.createEvent}>
            <li><em className={style.name}>接单公众号：</em><div>{form.appNickName}</div></li>
            <li><em className={style.name}>行业标签：</em><div>{form.targetMediaCategory === '[]' ? '不限(默认)' : window.common.removeEmptyArrayEle(selmediaValData).join('、')}</div></li>
            <li>
              <em className={style.name}>发文位置：</em>
              <Form.Item>
                <div>
                  {
                    getFieldDecorator(
                      'articlePosition',
                      {
                        initialValue: form.articlePosition || null,
                        rules: [
                          {required: true, message: '请选择发文位置'}
                        ]
                      }
                    )(<Select className="w260" onChange={this.changeValueEvent.bind(this, 'articlePosition')}>
                      <Option value={null}>请选择</Option>
                      {
                          window.common.advertLocal.map((item, index) => (
                          <Option key={index + 1} value={index + 1}>{item}</Option>
                          ))
                      }
                      </Select>)
                  }
                </div>
              </Form.Item>
            </li>
            <li><em className={style.name}>最大接单阅读量(阅读)：</em><div>{window.common.formatNumber(form.availableCnt)}</div></li>
            <li>
              <em className={style.name}>建议接单数量(阅读)：</em>
              <Form.Item>
                {
                  getFieldDecorator(
                    'missionReadCnt',
                    {
                      initialValue: form.missionReadCnt || '',
                      rules: [
                        {required: true, message: '请输入接单阅读数'},
                        {pattern: /^[1-9]\d*$/ , message: '请输入大于0的整数'},
                        {validator: passwordValidator}
                      ]
                    }
                  )(<div>
                    <Input className={`w260 ${style.ipttxt}`} onChange={this.changeValueEvent.bind(this, 'missionReadCnt')} />
                  </div>)
                }
              </Form.Item>
            </li>
            <li>
              <em className={style.name}>预计发文时间：</em>
              <div>
                <Form.Item>
                {
                  getFieldDecorator(
                    'planPostArticleTime',
                    {
                      initialValue: form.planPostArticleTime,
                      rules: [
                        {required: true, message: '请输入发文时间'}
                      ]
                    }
                  )(<DatePicker
                    disabledDate={this.disabledEndDate}
                    onOpenChange={this.handleEndOpenChange}
                    className="mr10 w260"
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请输入开始时间"
                    onChange={this.changeValueEvent.bind(this, 'planPostArticleTime')}
                  />)
                }
                </Form.Item>
              </div>
            </li>
            <li>
              <em className={style.name}>文章预览：</em>
              {
                form.postContent === undefined ? <div><p>暂未绑定活动素材</p></div>
                :
                <div className={style.coverimg}>
                  <p>展示封面标题，点击可查看详情</p>
                  <a href={`${window.common.articleUrl}fshstatic/view.html?id=${form.postContent}`} target="_blank">
                    <img src={form.impImage} />
                    <span>{form.extrendJson}</span>
                  </a>
                </div>
              }
            </li>
            <li>
            <em className={style.name}>活动名称：</em><div>{form.campaignName}</div>
            </li>
            <li>
            <em className={style.name}>活动日期：</em><div>{window.common.getDate(form.dateStart, false)}-{window.common.getDate(form.dateEnd, false)}</div>
            </li>
            <li><em className={style.name}>活动形式：</em><div>{window.common.getAdType(form.adType)}</div></li>
            <li>
            <em className={style.name}>条件设置：</em>
            <div>
              <p>男女比例-{window.common.targetGender[Number(form.targetGender)]}</p>
              <p>媒体标签-{form.targetMediaCategory === '[]' ? '不限(默认)' : window.common.removeEmptyArrayEle(selmediaValData).join('、')}</p>
              <p>所在区域-{form.targetArea === '[]' ? '不限(默认)' : window.common.removeEmptyArrayEle(selprovinceValData).join('、')}</p>
            </div>
            </li>
            <li><em className={style.name}>计费方式：</em><div>{window.common.billingTypesData[form.billingType]}</div></li>
            <li><em className={style.name}>阅读单价：</em><div>{form.unitPrice}元/次阅读</div></li>
            <li><em className={style.name}>发文时段</em><div>{window.common.getDate(form.createDate, true)}</div></li>
            <li>
              <Form.Item>
                <Button type="primary"  htmlType="submit" disabled={isDisabled}>确定</Button>
                <Button className="ml30" onClick={this.goBackEvent.bind(this)}>返回</Button>
              </Form.Item>
            </li>
            </Form>
        </ul>
      </div>
    )
  }
}
export default Form.create()(Receivead)