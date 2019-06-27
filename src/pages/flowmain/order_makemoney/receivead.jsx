import React, {Component} from 'react';
import {Select, DatePicker, Input, message} from 'antd';
import style from './style.less';
import moment from 'moment';
const Option = Select.Option;
class Receivead extends Component{
  constructor(props) {
    super(props);
    this.state = {
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
      selmediaValData: [],
      selprovinceValData: []
    };
  }
  componentWillMount() {
    Promise.all([window.api.baseInstance('admin/system/dict/getDictByType', {type: 'mediaType'}), window.api.baseInstance('admin/system/dict/getDictByType', {type: 'provinceType'})]).then(rs => {
      const campaignId = this.props.location.state.campaignId;
      const appNickName = this.props.location.state.appNickName;
      let form = this.state.form;
      form = Object.assign(form, {campaignId, appNickName}, rs.data);
      let selmediaValData = new Array(rs[0].data.length);
      let selprovinceValData = new Array(rs[1].data.length);
      console.log(form);
      this.initForm(campaignId);
      const arr = form.targetMediaCategory !== null ? JSON.parse(form.targetMediaCategory) : [];
      const arr1 = form.targetArea !== null ? JSON.parse(form.targetArea) : [];
      if (arr.length === 0) {
        arr.map((node, i) => {
          rs[0].data.map((item, index) => {
            if (node == Number(item.value)) {
              selmediaValData[index] = item.label;
            }
          });
        });
      }
      if (arr1.length === 0) {
        arr1.map((node, i) => {
          rs[1].data.map((item, index) => {
            if (node == Number(item.value)) {
              selprovinceValData[index] = item.label;
            }
          });
        });
      }
      this.setState({selmediaValData, selprovinceValData, form});
      
    }).catch(err => {
      if (err.code === 100000) {
        this.setState({redirect: true});
        window.localStorage.removeItem('login_info');
      } else {
        message.error(err.message);
      }
    });
  }
  initForm = (campaignId) => {
    window.api.baseInstance('flow/campaign/detail', {campaignId}).then(rs => {
      const form = Object.assign(this.state.form, rs.data.campaign);
      this.setState({form});
    }).catch(err => {
      if (err.code === 100000) {
        this.setState({redirect: true});
        window.localStorage.removeItem('login_info');
      } else {
        message.error(err.message);
      }
    });
  }
  changeValueEvent = (type, e, value) => {
    let {form} = this.state;
    let obj = {};
    switch(type) {
      case 'articlePosition':
        obj = {[type]: e};
        break;
      case 'missionReadCnt':
        obj = {[type]: e.target.value};
        break;
      case 'planPostArticleTime':
        obj = {[type]: value};
        break;
      default:
        break;
    }
    form = Object.assign(form, obj);
    this.setState({form});
    //this.props.changeValueEvent(type, e, value);
  }
  render() {
    const {
      form,
      selmediaValData,
      selprovinceValData
    } = this.state;
    return (
      <div className={style.pubAccount}>
        <ul className={style.receiveAd}>
            <li><em className={style.name}>接单公众号：</em><div>{form.appNickName}</div></li>
            <li><em className={style.name}>媒体标签：</em><div>{window.common.removeEmptyArrayEle(selmediaValData).join('、')}</div></li>
            <li>
            <em className={style.name}>发文位置：</em>
            <div>
                <Select value={form.articlePosition} className="w260" onChange={this.changeValueEvent.bind(this, 'articlePosition')}>
                <Option value={null}>请选择</Option>
                {
                    window.common.advertLocal.map((item, index) => (
                    <Option key={index + 1} value={index + 1}>{item}</Option>
                    ))
                }
                </Select>
            </div>
            </li>
            <li><em>最大接单阅读量(阅读)：</em><div>111</div></li>
            <li>
            <em className={style.name}>建议接单数量（阅读）：</em>
            <div>
                <Input className="w260" value={form.missionReadCnt} onChange={this.changeValueEvent.bind(this, 'missionReadCnt')} />
            </div>
            </li>
            <li>
            <em className={style.name}>预计发文时间：</em>
            <div>
                <DatePicker className="w260" format="YYYY-MM-DD" value={form.planPostArticleTime === null ? null : moment(form.planPostArticleTime)} onChange={this.changeValueEvent.bind(this, 'planPostArticleTime')} />
            </div>
            </li>
            <li>
            <em className={style.name}>预计发文时间段：</em>
            </li>
            <li>
            <em className={style.name}>文章预览：</em>
            <div className={style.coverimg}>
                <p>展示封面标题，点击可查看详情</p>
                <a href={`http://wwww.baidu.com?id=${form.postContent}`} target="_blank">
                <img src={form.impImage} />
                <span>{form.extrendJson}</span>
                </a>
            </div>
            </li>
            <li>
            <em className={style.name}>活动名称：</em><div>{form.campaignName}</div>
            </li>
            <li>
            <em className={style.name}>活动日期：</em><div>{window.common.getDate(form.dateStart, false)}-{window.common.getDate(form.dateEnd, false)}</div>
            </li>
            <li>
            <em className={style.name}>推广时间段限定：</em><div>{window.common.getDate(form.dateStart, false)}-{window.common.getDate(form.dateEnd, false)}</div>
            </li>
            <li><em className={style.name}>活动形式：</em></li>
            <li>
            <em className={style.name}>条件设置：</em>
            <div>
                <p>男女比例-{window.common.targetGender[Number(form.targetGender)]}</p>
                <p>媒体标签-{window.common.removeEmptyArrayEle(selmediaValData).join('、')}</p>
                <p>所在区域-{window.common.removeEmptyArrayEle(selprovinceValData).join('、')}</p>
            </div>
            </li>
            <li><em className={style.name}>计费方式：</em></li>
            <li><em className={style.name}>阅读单价：</em><div>{form.unitPrice}元/次阅读</div></li>
            <li><em className={style.name}>发文时段</em><div>{window.common.getDate(form.createDate, false)}</div></li>
        </ul>
      </div>
    )
  }
}
export default Receivead;