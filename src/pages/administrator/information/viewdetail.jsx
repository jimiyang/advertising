import React, {Component} from 'react'
import {Button, Radio, Input, message, Table} from 'antd'
import style from '../style.less'
import {
  updatePostStatusById,
  getById,
  getDictByType
} from '../../../api/api'
const {TextArea} = Input
class ViewDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
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
      type: 0,//判断是查看活动页面[0]还是审核接单页面[1]
      missionData: [],
      pagination: {
        size: 'small',
        showSizeChanger: true,
        total: 0,
        currentPage: 1,
        limit: 10,
        pageSize: 10,
        onChange: this.changePage,
        onShowSizeChange: this.onShowSizeChange
      }
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
    getById({id}).then(rs => {
      if (!rs.data) return false
      const form = Object.assign(this.state.form, rs.data)
      const selmediaValData = this.initLabel('media', form.targetMediaCategory)
      const selproviceValData = this.initLabel('province', form.targetArea)
      const params = Object.assign(this.state.params, {auditRemark: form.auditRemark})
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
  changePage = (page) => {
    page = page === 0 ? 1 : page
    const pagination = Object.assign(this.state.pagination, {currentPage: page})
    this.setState({pagination})
    this.loadList()
  }
  //改变每页条数事件
  onShowSizeChange = (current, size) => {
    let p = this.state.pagination
    p = Object.assign(p, {currentPage: current, limit: size, pageSize: size})
    this.setState({pagination: p})
    this.loadList()
  }
  changeFormEvent = (type, e) => {
    const params = Object.assign(this.state.params, {[type]: e.target.value})
    this.setState({params})
  }
  checkEvent = () => {
    if(!this.state.params.auditRemark) {
      message.error('请填写审核意见')
      return false
    }
    updatePostStatusById(this.state.params).then(rs => {
      message.success(rs.message)
      window.history.go(-1)
    })
  }
  goBackEvent = () => {
    window.history.go(-1)
  }
  render() {
    const {
      form,
      mediaTypeLabel,
      provinceTypeType,
      type,
      params,
      selmediaValData,
      selproviceValData,
      missionData,
      pagination
    } = this.state
    const columns = [
      {
        title: '任务ID',
        key: 'missionId',
        dataIndex: 'missionId'
      },
      {
        title: '公众号',
        key: 'appNickName',
        dataIndex: 'appNickName'
      },
      {
        title: '位置',
        key: 'appArticlePosition',
        dataIndex: 'appArticlePosition'
      },
      {
        title: '接单阅读量',
        key: 'missionReadCnt',
        dataIndex: 'missionReadCnt'
      },
      {
        title: '实际阅读量',
        key: 'missionRealReadCnt',
        dataIndex: 'missionRealReadCnt'
      },
      {
        title: '活动cpc单价',
        key: 'adUnitPrice',
        dataIndex: 'adUnitPrice'
      },
      {
        title: '预计指出',
        key: 'adEstimateCost',
        dataIndex: 'adEstimateCost'
      },
      {
        title: '状态',
        key: 'missionStatus',
        dataIndex: 'missionStatus'
      }
    ]
    return (
      <div className={style.administrator}>
        <h1 className="nav-title">活动详情</h1>
        <h2 className="small-title">基本信息</h2>
        <ul className={style.detaillist}>
            <li>所属广告主：<div>{form.advertiserName}</div></li>
            <li>活动id：<div>{form.campaignId}</div></li>
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
            <li>计费方式：<div>{window.common.billingTypesData[form.billingType]}</div></li>
            <li>
              <div>
                活动素材：
                {
                  form.postContent === undefined ? <div className={style.coverimg}><p>暂未绑定活动素材</p></div>
                  :
                  <div className={style.coverimg}>
                    <a href={`${window.common.articleUrl}fshstatic/view.html?id=${form.postContent}`} target="_blank">
                      <img src={form.impImage} />
                      <span>{form.extrendJson}</span>
                    </a>
                  </div>
                }
              </div>
            </li>
            <li>阅读单价：<div>{form.unitPrice}</div></li>
            <li>活动预算：<div>{form.postAmtTotal}元</div></li>
            <li>推广预告：<div>预计您的广告将实现<em className="red-color m5">{window.common.formatNumber(parseInt(form.postAmtTotal * 100 / form.unitPrice * 100) / 10000)}</em>次有效阅读</div></li>
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
            <li style={{width: '100%'}} className={style.tableBox}>
              <Table
                dataSource={missionData}
                columns={columns}
                pagination={pagination}
                className="table"
              />
            </li> 
            <li>
              <div className="mt30">
                {
                  type === 1 ?
                    <Button type="primary" onClick={this.checkEvent.bind(this)}>提交</Button>
                  : null
                }
                <Button onClick={this.goBackEvent.bind(this)}>返回</Button>
              </div>
            </li>
          </ul>      
      </div>
    ) 
  }
}
export default ViewDetail