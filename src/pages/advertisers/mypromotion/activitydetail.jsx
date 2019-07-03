import React, {Component} from 'react';
import {Button, message} from 'antd';
import Redirect from 'umi/redirect';
import {
  getDictByType,
  getById
} from '../../../api/api';//接口地址
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
        provinceTypeType: [],
        selmediaValData: [], //选中的行业标签
        selproviceValData: [] //选中的地域标签
    };
  }
  componentWillMount() {
    if (!this.props.location.state.id) return false;
    Promise.all([getDictByType({type: 'mediaType'}), getDictByType({type: 'provinceType'})]).then(rs => {
      this.setState({
        mediaTypeLabel: rs[0].data,
        selmediaValData: new Array(rs[0].data.length),
        provinceTypeType: rs[1].data,
        selproviceValData: new Array(rs[1].data.length)
      });
      this.initForm(this.props.location.state.id);
    });
  }
  initForm = (id) => {
    getById({id}).then(rs => {
      const selmediaValData = this.initLabel('media', rs.data.targetMediaCategory);
      const selproviceValData = this.initLabel('province', rs.data.targetArea);
      this.setState({form: rs.data, selmediaValData, selproviceValData});
    });
  }
  initLabel = (type, data) => {
    if (data === undefined) return false;
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
  //获取行业
  getDictByType = (type) => {
    return new Promise((resolve, reject) => {
      window.api.baseInstance('admin/system/dict/getDictByType', {type}).then(rs => {
        resolve(rs.data);
      });
    });
  }
  goBackEvent = () => {
    window.history.go(-1);
  }
  render() {
    const {form, mediaTypeLabel, provinceTypeType, selmediaValData, selproviceValData, redirect} = this.state;
    if (redirect) return (<Redirect to="/relogin" />);
    return (
      <div className={style.mypromotion}>
        <h1 className="nav-title">我的推广活动 > 活动详情</h1>
        <div className={style.createBlocks}>
          <h2 className="small-title"><em></em>基本信息</h2>
          <ul className={style.detaillist}>
              <li>活动名称：<div>{form.campaignName}</div></li>
              <li>活动日期：<div>{form.dateStart !== '' ? window.common.getDate(form.dateStart, false) : null}至{form.dateEnd !== '' ? window.common.getDate(form.dateEnd, false) : null}</div></li>
              <li>活动形式：<div>{window.common.getAdType(form.adType)}</div></li>
              <li>
                条件设置：
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
                活动素材：
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
              <li>计费方式：<div>{form.billingType === 1 ? 'CPC' : '万粉'}</div></li>
            </ul>
            <h2 className="small-title"><em></em>价格信息</h2>
            <ul className={style.detaillist}>
              <li>阅读单价：<div>{form.unitPrice}元/次阅读</div></li>
              <li>活动预算：<div>{form.postAmtTotal}元</div></li>
              <li>
                活动效果：
                <div>预计您的广告将实现<em className="red-color m5">{window.common.formatNumber(Math.round(form.postAmtTotal / form.unitPrice))}</em>次有效阅读</div>
              </li>
              <li className="mt30"><Button onClick={this.goBackEvent.bind(this)}>返回</Button></li>
            </ul>
        </div>
      </div>
    )
  }
};
export default ActivityDetail;