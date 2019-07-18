import React, {Component} from 'react'
import {Button, message, Table} from 'antd'
import {
  getDictByType,
  getById,
  missionList
} from '../../../api/api'//接口地址
import style from './style.less'
class ActivityDetail extends Component{
  constructor(props) {
    super(props)
    this.state = {
        loginName: false,
        campaignId: '',
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
        provinceTypeType: [],
        selmediaValData: [], //选中的行业标签
        selproviceValData: [], //选中的地域标签
        pagination: {
          size: 'small',
          showSizeChanger: true,
          total: 0,
          currentPage: 1,
          current: 1,
          limit: 10,
          pageSize: 10,
          onChange: this.changePage,
          onShowSizeChange: this.onShowSizeChange
        },
        missionData: []
    }
  }
  componentWillMount() {
    if (!this.props.location.state.id) return false
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'))
    Promise.all([getDictByType({type: 'mediaType'}), getDictByType({type: 'provinceType'})]).then(rs => {
      this.setState({
        mediaTypeLabel: rs[0].data,
        selmediaValData: new Array(rs[0].data.length),
        provinceTypeType: rs[1].data,
        selproviceValData: new Array(rs[1].data.length)
      })
      this.setState({campaignId: this.props.location.state.id, loginName: loginInfo.data.loginName})
      this.initForm()
      this.loadList()
    })
  }
  initForm = () => {
    getById({id: this.state.campaignId}).then(rs => {
      const selmediaValData = this.initLabel('media', rs.data.targetMediaCategory)
      const selproviceValData = this.initLabel('province', rs.data.targetArea)
      this.setState({form: rs.data, selmediaValData, selproviceValData})
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
  //获取行业
  getDictByType = (type) => {
    return new Promise((resolve, reject) => {
      window.api.baseInstance('admin/system/dict/getDictByType', {type}).then(rs => {
        resolve(rs.data)
      })
    })
  }
  loadList = () => {
    const {pagination, campaignId, loginName} = this.state
    const params = {
      currentPage: pagination.currentPage,
      limit: pagination.limit,
      campaignId,
      loginName
    }
    missionList(params).then(rs => {
      if (rs.success) {
        const p = Object.assign(pagination, {total: rs.total})
        this.setState({missionData: rs.data, pagination: p})
      } else {
        message.error(rs.message)
      }
    })
  }
  changePage = (page) => {
    page = page === 0 ? 1 : page
    const pagination = Object.assign(this.state.pagination, {currentPage: page, current: page})
    this.setState({pagination})
    this.loadList()
  }
  //改变每页条数事件
  onShowSizeChange = (current, size) => {
    let p = this.state.pagination
    p = Object.assign(p, {currentPage: current, current, limit: size, pageSize: size})
    this.setState({pagination: p})
    this.loadList()
  }
  goBackEvent = () => {
    window.history.go(-1)
  }
  render() {
    const {form, missionData, mediaTypeLabel, provinceTypeType, selmediaValData, selproviceValData, pagination} = this.state
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
      <div className={style.mypromotion}>
        <h1 className="nav-title">我的推广活动 > 活动详情</h1>
        <div className={style.createBlocks}>
          <h2 className="small-title"><em></em>基本信息</h2>
          <ul className={style.detaillist}>
              <li>活动名称：<div style={{width: '60%'}}>{form.campaignName}</div></li>
              <li>活动ID：<div>{form.campaignId}</div></li>
              <li>活动日期：<div>{form.dateStart !== '' ? window.common.getDate(form.dateStart, false) : null}至{form.dateEnd !== '' ? window.common.getDate(form.dateEnd, false) : null}</div></li>
              <li>活动形式：<div>{window.common.getAdType(form.adType)}</div></li>
              <li>
                条件设定：
                <div>
                  <ul>
                    <li>
                      <span className={style.stitle}>男女比例-{window.common.targetGender[Number(form.targetGender)]}</span>
                    </li>
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
              <li>
                <div>
                  活动素材：
                  {
                    form.postContent === undefined ? <div className={style.coverimg}><p>暂未绑定活动素材</p></div>
                    :
                    <div className={style.coverimg}>
                      <a href={`${form.postContent === '' ? 'javascript:' : `${window.common.articleUrl}fshstatic/view.html?id=${form.postContent}`}`} target="_blank">
                        <img src={form.impImage} />
                        <span>{form.extrendJson}</span>
                      </a>
                    </div>
                  }
                </div>
              </li>
              <li>计费方式：<div>{form.billingType === 1 ? 'CPC' : '万粉'}</div></li>
            </ul>
            <h2 className="small-title"><em></em>价格信息</h2>
            <ul className={style.detaillist}>
              <li>阅读单价：<div>{form.unitPrice}元/次阅读</div></li>
              <li>活动预算：<div>{form.postAmtTotal}元</div></li>
              <li>
                活动效果：
                <div>预计您的广告将实现<em className="red-color m5">{window.common.formatNumber(parseInt(form.postAmtTotal * 100 / form.unitPrice * 100) / 10000)}</em>次有效阅读</div>
              </li>
              <li style={{width: '100%'}} className={style.tableBox}>
                <Table
                  dataSource={missionData}
                  columns={columns}
                  pagination={pagination}
                  className="table"
                />
              </li>
              <li className="mt30"><Button onClick={this.goBackEvent.bind(this)}>返回</Button></li>
            </ul>
        </div>
      </div>
    )
  }
}
export default ActivityDetail