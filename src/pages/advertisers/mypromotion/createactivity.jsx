import React, {Component} from 'react';
import {Input, DatePicker, Form, Radio, Button, message, Breadcrumb} from 'antd';
import moment from 'moment';
import style from './style.less';
import Redirect from 'umi/redirect';
import router from 'umi/router';
const {RangePicker} = DatePicker;
class CreateAdvertity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      form: {
        loginName: '', //登录名
        campaignName: '', //活动名称
        dateStart: null, //开始时间
        dateEnd: null, //结束时间
        adType: 'article', //活动形式
        targetGender: 0, //性别
        targetMediaCategory: '', //行业
        targetArea: '', //地区
        billingType: 0, //计费方式
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
      selproviceValData: [] //选中的地域标签
    };
  }
  componentWillMount() {
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
    if (!loginInfo) return false;
    const form = Object.assign(this.state.form, {loginName: loginInfo.data.loginName});
    Promise.all([window.api.baseInstance('admin/system/dict/getDictByType', {type: 'mediaType'}), window.api.baseInstance('admin/system/dict/getDictByType', {type: 'provinceType'})]).then(rs => {
      this.setState({
        mediaTypeLabel: rs[0].data,
        selmediaValData: new Array(rs[0].data.length),
        provinceTypeType: rs[1].data,
        selproviceValData: new Array(rs[1].data.length)
      });
    }).catch(err => {
      if (err.code === 100000) {
        this.setState({redirect: true});
        window.localStorage.removeItem('login_info');
      }
      message.error(err.message);
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
      case 'unitPrice':
        form = Object.assign(form, {unitPrice: e.target.value});
        if (form.postAmtTotal !== 0) {
          this.setState({validReading: Math.round(form.postAmtTotal / e.target.value)});
        }
        break;
      case 'postAmtTotal':
        form = Object.assign(form, {postAmtTotal: e.target.value});
        if (form.unitPrice !== 0) {
          this.setState({validReading: Math.round(e.target.value / form.unitPrice)});
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
        window.api.baseInstance('api/ad/campaign/add', form).then(rs => {
          message.success(rs.message);
          router.push({
            pathname: '/main/selectmateria',
            state: {
              id: rs.data.id
            }
          });
        }).catch(err => {
          if (err.code === 100000) {
            this.setState({redirect: true});
            window.localStorage.removeItem('login_info');
          }
          message.error(err.message);
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
  render() {
    const {
      redirect,
      form,
      mediaTypeLabel,
      provinceTypeType,
      validReading,
      selmediaValData,
      selproviceValData,
      categoryType,
      areaType
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
    if (redirect) return (<Redirect to="/relogin" />);
    return(
      <div className={style.mypromotion}>
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
                  )(<Input placeholder="请输入活动名称" onChange={this.changeFormEvent.bind(this, 'campaignName')} className={style.ipttxt} />)
                  }
                </Form.Item>
                <Form.Item label="活动周期" {...tailFormItemLayout}>
                  {
                    getFieldDecorator(
                      'date',
                      {
                        initialValue: [],
                        rules: [
                          {required: true, message: '请输入活动周期'}
                        ]
                      } 
                    )(<RangePicker format="YYYY-MM-DD" separator="至" className={style.ipttxt} style={{height: '36px'}} onChange={this.changeFormEvent.bind(this, 'date')}/>)
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
                        <Radio value={0}>CPC</Radio>
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
                              {pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/, message: '只能输入整数或小数(保留后两位)'}
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
                              {pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/, message: '只能输入整数或小数(保留后两位)'}
                            ]
                          }
                        )(<Input className={style.ipttxt} onChange={this.changeFormEvent.bind(this, 'postAmtTotal')} />)
                      }元
                    </Form.Item>
                  </li>
                </ul>          
                <div className={style.warning}>推广效果: 预计您的广告将实现<em className="m5">{validReading}</em>次有效阅读</div>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className={style.btn}>下一步</Button>
                </Form.Item>
            </Form>
        </div>
      </div>
    )
  }
}
export default Form.create()(CreateAdvertity);