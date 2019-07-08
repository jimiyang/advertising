import React, {Component} from 'react';
import {Input, Button, message} from 'antd';
import style from '../style.less';
import {list4Settle, getDictByType, settleCampaign} from '../../../api/api';
let missions = {};
class ViewActivity extends Component{
  constructor(props) {
    super(props);
    this.state = {
      loginName: null,
      campaignId: null,
      form: {},
      taskData: [],
      mediaTypeLabel: [],
      selmediaValData: [],
      provinceTypeType: [],
      selproviceValData: [],
      sumData: [], //实际结算金额
      countData: [],
      settleCntData: [],
      missionReadCnt: 0, //接单阅读数
      missionRealReadCnt: 0, //实际完成阅读量
      adEstimateCost: 0, //广告支出
      settlePrice: 0, //推荐结算金额
      settleReadCnt: 0, //实际结算阅读数
      realSettleCnt: 0, //实际结算金额
    };
  }
  componentWillMount() {
    Promise.all([getDictByType({type: 'mediaType'}), getDictByType({type: 'provinceType'})]).then(rs => {
      const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
      this.setState({
        mediaTypeLabel: rs[0].data,
        selmediaValData: new Array(rs[0].data.length),
        provinceTypeType: rs[1].data,
        selproviceValData: new Array(rs[1].data.length),
        loginName: loginInfo.data.loginName,
        campaignId: this.props.location.state.campaignId
      });
      this.loadList();
    });
  }
  loadList = () => {
    let {loginName, campaignId, form} = this.state;
    const params = {
      loginName,
      campaignId
    };
    list4Settle(params).then(rs => {
      form =  Object.assign(form, rs.data.adCampaign);
      const selmediaValData = this.initLabel('media', form.targetMediaCategory);
      const selproviceValData = this.initLabel('province', form.targetArea);
      this.setState({form, taskData: rs.data.missionList, selmediaValData, selproviceValData});
      this.getCount('missionReadCnt');
      this.getCount('missionRealReadCnt');
      this.getCount('adEstimateCost');
      this.getCount('settlePrice');
    });
  }
  //初始化标签
  initLabel = (type, data) => {
    let arr = data;
    switch (type) {
      case 'media':
        const mediaLabel = this.state.mediaTypeLabel;
        let selmediaValData = this.state.selmediaValData;
        if (arr !== '' || arr.length !== 0) {
          JSON.parse(arr).map((node, i) => {
            mediaLabel.map((item, index) => {
              if (node == Number(item.value)) {
                selmediaValData[index] = node;
              }
            });
          });
        }
        return selmediaValData;
      case 'province':
        const provinceLabel = this.state.provinceTypeType;
        let selproviceValData = this.state.selproviceValData;
        if (arr !== '' || arr.length !== 0) {
          JSON.parse(arr).map((node, i) => {
            provinceLabel.map((item, index) => {
              if (node == Number(item.value)) {
                selproviceValData[index] = node;
              }
            });
          });
        }
        return selproviceValData;
      default: 
        break;
    }
  }
  getCount = (columns) => {
    let count = 0;
    const data = this.state.taskData;
    data.map((item) => {
      switch (columns) {
        case 'missionReadCnt':
          count = count + item.missionReadCnt;
          break;
        case 'missionRealReadCnt':
          count = item.missionRealReadCnt === undefined ? 0 : count + item.missionRealReadCnt;
          break;
        case 'adEstimateCost':
          count = count + item.adEstimateCost;
          break;
        case 'settlePrice':
          count = count + (item.adUnitPrice *  item.preSettleReadCnt);
          break;
      }
    })
    this.setState({[columns]: count});
    //return count;
  }
  changeNumEvent = (item, index, e) => {
    let {sumData, countData, settleCntData} = this.state;
    let reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
    if (!reg.test(e.target.value)) {
      message.error('只能输入整数或小数(保留后两位)');
      return false;
    }
    let num = 0; //实际结算阅读数
    let sum = 0; //实际结算金额
    if (Number(e.target.value) > item.missionReadCnt) {
      message.error('不能大于接单阅读量');
      return false;
    }
    settleCntData[index] = Number(e.target.value); //每项的实际结算阅读数
    countData[index] = {[item.missionId]: Number(e.target.value)}; //传给后台的字段
    sumData[index] = (item.adUnitPrice * Number(e.target.value)).toFixed(2); //每项的实际结算金额
    settleCntData.map((item, index) => {
      num = num + item;
      sum = sum + Number(sumData[index]);
    })
    this.setState({countData, settleReadCnt: num, realSettleCnt: sum});
  }
  //checkPassEvent审核通过
  checkPassEvent = () => {
    const {loginName, campaignId, countData} = this.state;
    countData.map((item) => (
      missions = Object.assign(missions, item)
    ));
    const params = {
      loginName,
      campaignId,
      missions
    };
    settleCampaign(params).then(rs => {
      message.success(rs.message);
      window.location.history(-1);
    });
  }
  goBackEvent = () => {
    window.history.go(-1);
  }
  render() {
    const {
      form,
      taskData,
      mediaTypeLabel,
      selmediaValData,
      provinceTypeType,
      selproviceValData,
      sumData,
      missionReadCnt, //接单阅读数
      missionRealReadCnt, //实际完成阅读量
      adEstimateCost, //广告支出
      settlePrice, //推荐结算金额
      settleReadCnt, //实际结算阅读数
      realSettleCnt, //实际结算金额
    } = this.state;
    return (
      <div className={style.administrator}>
        <h1 className="nav-title">详情</h1>
        <div className={style.settlementItems}>
          <ul className={style.detail}>
            <li>活动名称：<div>{form.campaignName}</div></li>
            <li>活动日期：<div>{window.common.getDate(form.dateStart, false)}至 {window.common.getDate(form.dateEnd, false)}</div></li>
            <li>活动形式：<div>{window.common.getAdType(form.adType)}</div></li>
            <li>结算方式：<div>{window.common.billingTypesData[form.billingType]}</div></li>
            <li className={style.conditions}>活动条件限定：<div>
              <dl>
                <dd>
                  <span className={style.stitle}>男女比例-{window.common.targetGender[Number(form.targetGender)]}</span>
                </dd>
                <dd>
                  <span className={style.stitle}>选择行业-{form.targetMediaCategory === '[]' ? '不限(默认)' : '自定义'}</span>
                  <div className={`${style.tags} ${form.targetMediaCategory === '[]' ? 'hide' : null}`}>
                    {
                      mediaTypeLabel.map((item, index) => (
                        <label key={index} className={Number(item.value) === selmediaValData[index] ? style.active : null}>{item.label}</label>
                      ))
                    } 
                  </div>
                </dd>
                <dd>
                  <span className={style.stitle}>选择地域-{form.targetArea === '[]' ? '不限(默认)' : '自定义'}</span>
                  <div className={`${style.tags} ${form.targetArea === '[]' ? 'hide' : null}`}>
                    {
                      provinceTypeType.map((item, index) => (
                        <label key={index} className={Number(item.value) === selproviceValData[index] ? style.active : null}>{item.label}</label>
                      ))
                    } 
                  </div>
                </dd>
              </dl>  
            </div></li>
            <li>活动预算：<div>{form.postAmtTotal}元</div></li>
            <li>预计有<em className={style.number}>{Math.round(form.postAmtTotal / form.unitPrice)}</em>个有效阅读</li>
          </ul>
          <div className="table" style={{borderBottom: 'none'}}>
            <table width="100%" className={style.listTab}>
              <tbody>
                <tr className={style.header}>
                  <th>任务id</th>
                  <th>公众号</th>
                  <th>预计发文时间</th>
                  <th>任务状态</th>
                  <th>接单阅读量</th>
                  <th>实际完成阅读量</th>
                  <th>完成率</th>
                  <th>广告主支出</th>
                  <th>推荐结算金额</th>
                  <th>实际结算阅读数</th>
                  <th>实际结算金额</th>
                </tr>
                {
                  taskData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.missionId}</td>
                      <td>{item.appNickName}</td>
                      <td>{item.planPostArticleTime}</td>
                      <td>{window.common.orderStatus[item.missionStatus - 10]}</td>
                      <td>{item.missionReadCnt}</td>
                      <td>{item.missionRealReadCnt === undefined ? 0 : item.missionRealReadCnt}</td>
                      <td>{item.ratioRead === undefined ? 0 : item.ratioRead}</td>
                      <td>{item.adEstimateCost}</td>
                      <td>{(item.adUnitPrice *  item.preSettleReadCnt).toFixed(2)}</td>
                      <td><Input onChange={this.changeNumEvent.bind(this, item, index)} className={style.ipttxt} /></td>
                      <td>{sumData[index] === undefined ? 0 : sumData[index]}</td>
                    </tr>
                  ))
                }
                <tr>
                  <td colSpan="4">&nbsp;</td>
                  <td>{missionReadCnt}</td>
                  <td>{missionRealReadCnt}</td>
                  <td>{missionReadCnt === 0 || missionRealReadCnt === 0 ? 0 : `${(missionRealReadCnt / missionReadCnt * 100).toFixed(2)}%`}</td>
                  <td>{adEstimateCost}</td>
                  <td>{settlePrice}</td>
                  <td>{settleReadCnt}</td>
                  <td>{realSettleCnt.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan="9">&nbsp;</td>
                  <td>利润</td>
                  <td>{(Number(adEstimateCost) - Number(realSettleCnt)).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

          </div>
        </div>
        <div className="g-tc mt30">
          <Button type="primary" onClick={this.checkPassEvent.bind(this)}>审核通过</Button>
          <Button onClick={this.goBackEvent.bind(this)} className="ml30">返回</Button>
        </div>
      </div>
    )
  }
};
export default ViewActivity;