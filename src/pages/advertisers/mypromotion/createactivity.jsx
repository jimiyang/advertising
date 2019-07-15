import React, {Component} from 'react';
import {Input, DatePicker, Form, Radio, Button, message, Modal} from 'antd';
import moment from 'moment';
import style from './style.less';
import Redirect from 'umi/redirect';
import router from 'umi/router';
import {
  getDictByType,
  caQuery,
  add,
  native
} from '../../../api/api';//接口地址
import RechargeModel from '../../components/rechargeModel'; //充值modal
class CreateAdvertity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDisabled: false,
      currentTime: null,
      isVisible: false, //是否显示充值弹层
      topup:{
        amount: null,
        channelType: 'WX'
      },
      form: {
        loginName: '', //登录名
        campaignName: '', //活动名称
        dateStart: null, //开始时间
        dateEnd: null, //结束时间
        adType: 'article', //活动形式
        targetGender: 0, //性别
        targetMediaCategory: '', //行业
        targetArea: '', //地区
        billingType: 1, //计费方式
        unitPrice: 0, //阅读单价
        postAmtTotal: 0, //活动预算
        postStatus: 0 //活动状态
      },
      categoryType: 0, //选择行业
      areaType: 0, //选择地狱
      validReading: 0, //有效阅读数，，只在页面显示
      mediaTypeLabel: [], //新媒体行业
      provinceTypeType: [], //省
      selmediaValData: [], //选中的行业标签
      selproviceValData: [], //选中的地域标签
      availableBalance: 0 //账户可用余额
    };
  }
  componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
    if (!loginInfo) return false;
    const form = Object.assign(this.state.form, {loginName: loginInfo.data.loginName});
    Promise.all([getDictByType({type: 'mediaType'}), getDictByType({type: 'provinceType'})]).then(rs => {
      this.setState({
        mediaTypeLabel: rs[0].data,
        selmediaValData: new Array(rs[0].data.length),
        provinceTypeType: rs[1].data,
        selproviceValData: new Array(rs[1].data.length)
      });
      this.getCaQuery();
    });
  }
  //获取可用余额和冻结余额
  getCaQuery = () => {
    caQuery({operatorLoginName: this.state.form.loginName}).then(rs => {
      this.setState({availableBalance: rs.data.available_balance});
    });
  }
  //form 表单改变
  changeFormEvent = (type, e, value) => {
    let form = this.state.form;
    let obj = {};
    switch(type) {
      case 'date':
        obj={'dateStart': value[0], 'dateEnd': value[1]};
        form = Object.assign(form, obj);
        this.setState({form});
        break;
      case 'dateStart':
        obj={'dateStart': value};
        form = Object.assign(form, obj);
        this.props.form.setFieldsValue({date: value});
        this.setState({form});
        break;
      case 'dateEnd':
        obj={'dateEnd': value};
        form = Object.assign(form, obj);
        this.props.form.setFieldsValue({date: value});
        this.setState({form});
        break;
      case 'unitPrice':
        form = Object.assign(form, {unitPrice: e.target.value});
        if (form.postAmtTotal > 0) {
          console.log(form.postAmtTotal / e.target.value);
          if (parseInt(form.postAmtTotal / e.target.value) === 0) {
            message.error('您的推广次数须大于0次');
            return false;
          }
          this.setState({validReading: parseInt(form.postAmtTotal / e.target.value)});
        }
        break;
      case 'postAmtTotal':
        form = Object.assign(form, {postAmtTotal: e.target.value});
        if (form.unitPrice > 0) {
          if (parseInt(form.postAmtTotal / e.target.value) === 0) {
            message.error('您的推广次数须大于0次');
            return false;
          }
          this.setState({validReading: parseInt(e.target.value / form.unitPrice)});
        }
        break;
      case 'categoryType':
        this.setState({[type]: e.target.value});
        break;
      case 'areaType':
        this.setState({[type]: e.target.value});
        break;
      default:
        obj = {[type]: e.target.value};
        this.setState({form});
        break;
    }
    this.setState({form});
  }
  //创建活动事件
  createEvent = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let form = this.state.form;
        delete values.date;
        const category = window.common.removeEmptyArrayEle(form.targetMediaCategory);
        const area = window.common.removeEmptyArrayEle(form.targetArea);
        form.targetMediaCategory = category === '' ? [] : category;
        form.targetArea = area === '' ? [] : area;
        form = Object.assign(form, values);
        const dateLen = window.common.dateDiff(form.dateStart, form.dateEnd);
        if (dateLen > 7) {
          message.warning('活动周期最多7天！');
          return false;
        }
        if (this.state.validReading === 0) {
          message.error('必须大于0');
        }
        //console.log(form);
        this.setState({isDisabled: true});
        add(form).then(rs => {
          this.setState({isDisabled: false});
          message.success(rs.message);
          router.push({
            pathname: '/main/selectmateria',
            state: {
              id: rs.data.id
            }
          });
        });
      }
    })
    //router.push('/main/selectmateria');
  }
  //选择多个标签
  selTagEvent = (item, index, type) => {
    type = type === 'selmediaValData' ? 'selmediaValData' : 'selproviceValData';
    let form = this.state.form;
    if (type === 'selmediaValData') {
      let str = this.state.selmediaValData;
      if (str.includes(Number(item.value)) === true) {
        str[index] = null;
      } else {
        str[index] = Number(item.value);
      }
      form = Object.assign(form, {targetMediaCategory: str});
      this.setState({form});
    } else {
      if (this.state.selproviceValData.includes(Number(item.value)) === true) {
        this.state.selproviceValData[index] = null;
      } else {
        this.state.selproviceValData[index] = Number(item.value);
      }
      form = Object.assign(form, {targetArea:  this.state.selproviceValData});
      this.setState({form});
    }
  }
  disabledEndDate = (endValue) => {
    const startValue = this.state.currentTime;
    if (!endValue || !startValue) {return false;}
    return endValue.valueOf() <= startValue.valueOf();
  }
  handleEndOpenChange = (open) => {
    let me = this;
    if(open){
      me.currentTime = moment();
    }
    this.setState({currentTime: moment()});
  }
  //显示充值弹层
  saveMoneyEvent = () => {
    let topup = this.state.topup;
    topup = Object.assign(topup, {amount: ''});
    this.setState({isVisible: true, topup});
  }
  //关闭充值弹层
  closeEvent = () => {
    this.setState({isVisible: false});
  }
  //调用子组件的表单事件
  bindValue = (type, e) => {
    let topup = this.state.topup;
    topup = Object.assign(topup, {[type]: e.target.value});
    this.setState({topup});
  }
  //确定要充值
  rechargeEvent = () => {
    const params = {
      ...this.state.topup,
      operatorLoginName: this.state.form.loginName
    };
    const reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
    if (!reg.test(params.amount)) {
      message.error('请输入整数或小数(保留后两位)');
      return false;
    }
    native(params).then(rs => {
      this.setState({qrUrl: rs.data.payUrl});
      router.push({pathname: '/main/qrcode', query: rs.data});
    });
  }
  render() {
    const {
      isDisabled,
      form,
      mediaTypeLabel,
      provinceTypeType,
      validReading,
      selmediaValData,
      selproviceValData,
      categoryType,
      areaType,
      availableBalance,
      isVisible,
      topup
    } = this.state;
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 18 },
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 20,
          offset: 0,
        },
        sm: {
          span: 20,
          offset: 1,
        }
      },
    };
    return(
      <div className={style.mypromotion}>
        <Modal
          visible={isVisible}
          width={510}
          onCancel={this.closeEvent}
          footer={
            <Button type="primary" onClick={this.rechargeEvent.bind(this)}>确定</Button>
          }
        >
          <RechargeModel changeFormEvent={this.bindValue.bind(this)} amount={topup.amount} />
        </Modal>
        <h1 className="nav-title">新建活动</h1>
        <div className={style.createBlocks}>
            <h2 className="small-title"><em></em>基本信息</h2>
            <Form {...formItemLayout} onSubmit={this.createEvent} className={style.form} name="form" id="form">
                <Form.Item label="活动名称" {...tailFormItemLayout} hideRequiredMark={true}>
                  {getFieldDecorator(
                    'campaignName',
                    {
                      initialValue: form.campaignName || '',
                      rules: [
                        {required: true, message: '请输入活动名称'}
                      ]
                    }    
                  )(<Input maxLength={100} style={{width: '425px'}} placeholder="请输入活动名称" onChange={this.changeFormEvent.bind(this, 'campaignName')} className={style.ipttxt} />)
                  }
                </Form.Item>
                <Form.Item label="活动周期" {...tailFormItemLayout}>
                  {
                    getFieldDecorator(
                      'date',
                      {
                        initialValue: null,
                        rules: [
                          {required: true, message: '请输入活动周期'}
                        ]
                      } 
                    )(<div className={style.date}><DatePicker
                        disabledDate={this.disabledEndDate}
                        onOpenChange={this.handleEndOpenChange}
                        className="mr10"
                        format="YYYY-MM-DD"
                        placeholder="请输入开始时间"
                        onChange={this.changeFormEvent.bind(this, 'dateStart')}
                      />至<DatePicker
                        disabledDate={this.disabledEndDate}
                        onOpenChange={this.handleEndOpenChange}
                        className="ml10"
                        format="YYYY-MM-DD"
                        placeholder="请输入结束时间"
                        onChange={this.changeFormEvent.bind(this, 'dateEnd')}
                      /></div>)
                  }
                </Form.Item>
                <Form.Item label="活动形式" {...tailFormItemLayout}>
                  {
                    getFieldDecorator(
                      'adType',
                      {
                        initialValue: form.adType || '',
                        rules: [
                          {required: true, message: '请选择活动形式'}
                        ]
                      }
                    )(<Radio defaultChecked={form.adType === 'article' ? true : false}>公众号软文</Radio>)
                  }
                </Form.Item>
                <Form.Item label="条件设置" {...tailFormItemLayout}>
                  <ul className={style.col}>
                    <li>
                       <span className={style.stitle}>男女比例</span>
                       <div>
                          <Form.Item>
                            {
                              getFieldDecorator(
                                'targetGender',
                                {
                                  initialValue: Number(form.targetGender),
                                  rules: [
                                    {required: true, message: '请选择男女比例'}
                                  ]
                                }
                              )(<Radio.Group onChange={this.changeFormEvent.bind(this, 'targetGender')}>
                                {
                                  window.common.targetGender.map((item, index) => (
                                    <Radio key={index} value={index}>{item}</Radio>
                                  ))
                                }
                              </Radio.Group>)
                            }
                          </Form.Item>
                        </div>
                    </li>
                    <li>
                        <span className={style.stitle}>选择行业</span>
                        <div>
                          <Form.Item>
                            {
                              getFieldDecorator(
                                'categoryType',
                                {
                                  initialValue: categoryType,
                                  rules: [
                                    {required: true, message: '请选择行业'}
                                  ]
                                }
                              )(<Radio.Group onChange={this.changeFormEvent.bind(this, 'categoryType')}>
                                  <Radio value={0}>不限(默认)</Radio>
                                  <Radio value={1}>自定义</Radio>
                              </Radio.Group>)
                            }
                          </Form.Item>
                          <div className={`${style.tags} ${categoryType === 1 ? null : 'hide'}`}>
                            {
                              mediaTypeLabel.map((item, index) => (
                                <label key={index} className={selmediaValData[index] === Number(item.value) ? style.active : null} onClick={this.selTagEvent.bind(this, item, index, 'selmediaValData')}>{item.label}</label>
                              ))
                            } 
                          </div>
                        </div>
                    </li>
                    <li>
                        <span className={style.stitle}>选择地域</span>
                        <div>
                          <Form.Item>
                            {
                              getFieldDecorator(
                                'areaType',
                                {
                                  initialValue: areaType,
                                  rules: [
                                    {required: true, message: '请选择地域'}
                                  ]
                                }
                              )(<Radio.Group onChange={this.changeFormEvent.bind(this, 'areaType')}>
                                  <Radio value={0}>不限(默认)</Radio>
                                  <Radio value={1}>自定义</Radio>
                              </Radio.Group>)
                            }
                          </Form.Item>
                          <div className={`${style.tags} ${areaType === 1 ? null : 'hide'}`}>
                            {
                              provinceTypeType.map((item, index) => (
                                <label key={index} className={selproviceValData[index] === Number(item.value) ? style.active : null} onClick={this.selTagEvent.bind(this, item, index, 'selproviceValData')}>{item.label}</label>
                              ))
                            } 
                          </div>
                        </div>
                    </li>
                  </ul>
                </Form.Item>
                <Form.Item label="计费方式" {...tailFormItemLayout}>
                  {
                    getFieldDecorator(
                      'billingType',
                      {
                        initialValue: form.billingType,
                        rules: [
                          {required: true, message: '请选择计费方式'}
                        ]
                      }
                    )(<Radio.Group onChange={this.changeFormEvent.bind(this, 'billingType')}>
                        <Radio value={1}>CPC</Radio>
                    </Radio.Group>)
                  }
                </Form.Item>
                <h2 className="small-title"><em></em>价格信息</h2>
                <ul className={style.priceInfo}>
                  <li style={{width: '100%'}}>
                    <Form.Item label="阅读单价" {...tailFormItemLayout}>
                      {
                        getFieldDecorator(
                          'unitPrice',
                          {
                            initialValue: form.unitPrice || '',
                            rules: [
                              {required: true, message: '请输入阅读单价'},
                              {pattern: /^([1-9][0-9]*){1,3}|(^[0-9][.][0-9]{1}$)|(^[0-9][.][0-9]{2}$)$/, message: '请输入大于0的整数或小数(保留后两位)'}
                              //{pattern: /(^[1-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{1}$)|(^[0-9]*\.[0-9]{2}$)/, message: '请输入大于0的整数或小数(保留后两位)'}
                            ]
                          }
                        )(<div><Input className={style.ipttxt} onChange={this.changeFormEvent.bind(this, 'unitPrice')} />元/次阅读</div>)
                      }
                    </Form.Item>
                  </li>
                  <li style={{width: '100%'}}>
                    <Form.Item label="活动预算" {...tailFormItemLayout}>
                      {
                        getFieldDecorator(
                          'postAmtTotal',
                          {
                            initialValue: form.postAmtTotal || '',
                            rules: [
                              {required: true, message: '请输入活动预算'},
                              {pattern: /^([1-9][0-9]*){1,3}|(^[0-9][.][0-9]{1}$)|(^[0-9][.][0-9]{2}$)$/, message: '请输入大于0的整数或小数(保留后两位)'}
                            ]
                          }
                        )(<div className={style.planCount}>
                            <Input className={style.ipttxt} onChange={this.changeFormEvent.bind(this, 'postAmtTotal')} />
                            元<span>可用余额<em>{availableBalance}</em>元</span>
                            <Button onClick={this.saveMoneyEvent.bind(this)}>充值</Button>
                          </div>)
                      }
                    </Form.Item>
                  </li>
                </ul>          
                <div className={style.warning}>推广效果: 预计您的广告将实现<em className="m5">{validReading}</em>次有效阅读</div>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className={style.btn} disabled={isDisabled}>下一步</Button>
                </Form.Item>
            </Form>
        </div>
      </div>
    )
  }
}
export default Form.create()(CreateAdvertity);