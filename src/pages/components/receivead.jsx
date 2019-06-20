import React, {Component} from 'react';
import {Select, DatePicker, Input, message} from 'antd';
import style from './component.less';
const Option = Select.Option;
class ReceiveAd extends Component{
  constructor(props) {
    super(props);
    this.state = {
      form: {
        campaignId: '',
        missionReadCnt: '',
        flowMerchantCode: '',
        appId: '',
        appNickName: '',
        adMerchantCode: '',
        targetMediaCategory: '',
        articlePosition: null
      },
      selmediaValData: []
    };
  }
  componentWillMount() {
    Promise.all([window.api.baseInstance('admin/system/dict/getDictByType', {type: 'mediaType'})]).then(rs => {
      this.setState({
        selmediaValData: new Array(rs[0].data.length),
        form: this.props.detailForm
      });
      //window.common.removeEmptyArrayEle(selmediaValData)
      let selmediaValData = this.state.selmediaValData;
      const arr = "[1001, 1002, 1003]";
      if (rs[0].data.length === 0) return false;
      JSON.parse(arr).map((node, i) => {
        rs[0].data.map((item, index) => {
          if (node == Number(item.value)) {
            selmediaValData[index] = item.label;
          }
        });
      });
      this.setState({selmediaValData});
    }).catch(err => {
      if (err.code === 100000) {
        this.setState({redirect: true});
        window.localStorage.removeItem('login_info');
      }
      message.error(err.message);
    });
  }
  componentWillReceiveProps(props) {
    this.setState({form: props.detailForm});
  }
  changeValueEvent = (type, e, value) => {
    this.props.changeValueEvent(type, e, value);
  }
  render() {
    const {
      form,
      selmediaValData
    } = this.state;
    return (
      <ul className={style.receiveAd}>
        <li>
          <em className={style.name}>公众号：</em><div>{form.appNickName}</div>
        </li>
        <li>
          <em className={style.name}>媒体标签：</em><div>{window.common.removeEmptyArrayEle(selmediaValData).join('、')}</div>
        </li>
        <li>
          <em className={style.name}>推广活动名称：</em><div>{form.campaignName}</div>
        </li>
        <li>
          <em className={style.name}>阅读单价：</em><div>{form.unitPrice}元/次阅读</div>
        </li>
        <li>
          <em className={style.name}>活动时间：</em><div>{window.common.getDate(form.dateStart, true)}-{window.common.getDate(form.dateEnd, true)}</div>
        </li>
        <li>
          <em className={style.name}>发文位置：</em>
          <div>
            <Select defaultValue={form.articlePosition} className="w260" onChange={this.changeValueEvent.bind(this, 'articlePosition')}>
              <Option value={null}>请选择</Option>
              {
                window.common.advertLocal.map((item, index) => (
                  <Option key={index} value={index}>{item}</Option>
                ))
              }
            </Select>
          </div>
        </li>
        <li>
          <em className={style.name}>接单数量（阅读）：</em>
          <div>
            <Input className="w260" onChange={this.changeValueEvent.bind(this, 'missionReadCnt')} />
          </div>
        </li>
        <li>
          <em className={style.name}>预计发文时间：</em>
          <div>
            <DatePicker className="w260" format="YYYY-MM-DD" onChange={this.changeValueEvent.bind(this, 'planPostArticleTime')} />
          </div>
        </li>
      </ul>
    );
  }
};
export default ReceiveAd;