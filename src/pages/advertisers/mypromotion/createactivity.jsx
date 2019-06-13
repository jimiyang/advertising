import React, {Component} from 'react';
import {Input, DatePicker, Form, Radio, Button, message} from 'antd';
import style from './style.less';
import router from 'umi/router';
import Link from 'umi/link';
const {RangePicker} = DatePicker;
class CreateAdvertity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        loginName: '', //登录名
        campaignName: '', //活动名称
        dateStart: '', //开始时间
        dateEnd: '', //结束时间
        adType: '', //活动形式
        activity_shap: 0, //活动形式
        targetGender: 0, //性别
        targetMediaCategory: 0, //行业
        targetArea: 0, //地区
        billingType: 0, //计费方式
        unitPrice: '', //阅读单价
        postAmtTotal: '', //活动预算
        postStatus: 0 //活动状态
      },
      mediaTypeLabel: [], //新媒体行业
      provinceTypeType: [] //省
    };
  }
  componentWillMount() {
    this.getDictByType('mediaType').then(rs => {
      this.setState({mediaTypeLabel: rs});
    });
    this.getDictByType('provinceType').then(rs => {
      this.setState({provinceTypeType: rs});
    });
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
    if (!loginInfo) return false;
    this.setState({loginName: loginInfo.data.loginName});
  }
  //获取行业
  getDictByType = (type) => {
    return new Promise((resolve, reject) => {
      window.api.baseInstance('admin/system/dict/getDictByType', {type}).then(rs => {
        resolve(rs.data);
      }).catch(err => {
        if (err.code === 100000) {
          this.setState({redirect: true});
          window.localStorage.removeItem('login_info');
        }
        message.error(err.message);
      });
    });
  }
  changeFormEvent = (type, e) => {
    console.log(e);
  }
  createEvent = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        console.log(err);
      }
    })
    //router.push('/main/selectmateria');
  }
  render() {
    const {
      form,
      mediaTypeLabel,
      provinceTypeType
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
        <h1 className="nav-title">
            新建活动
            <Button className="button">新建推广活动</Button>    
        </h1>
        <div className={style.createBlocks}>
            <h2 className="small-title"><em></em>基本信息</h2>
            <Form {...formItemLayout} onSubmit={this.createEvent} className={style.form} name="form" id="form">
                <Form.Item label="活动名称" {...tailFormItemLayout} hideRequiredMark={true}>
                  {getFieldDecorator(
                    'name',
                    {
                      initialValue: form.name || '',
                      rules: [
                        {required: true, message: '请输入活动名称'}
                      ]
                    }    
                  )(<Input placeholder="请输入活动名称" onChange={this.changeFormEvent.bind(this, 'name')} className={style.ipttxt} />)
                  }
                </Form.Item>
                <Form.Item label="活动日期" {...tailFormItemLayout}>
                   <RangePicker separator="至" className={style.ipttxt} style={{height: '36px'}} />
                </Form.Item>
                <Form.Item label="活动形式" {...tailFormItemLayout}>
                  <Radio defaultChecked={form.activity_shap === 0 ? true : false}>公众号软文</Radio>
                </Form.Item>
                <Form.Item label="条件设置" {...tailFormItemLayout}>
                  <ul>
                    <li>
                       <span className={style.stitle}>男女比例</span>
                       <Radio.Group onChange={this.changeFormEvent.bind(this)} value={form.targetGender}>
                          {
                            window.common.targetGender.map((item, index) => (
                              <Radio key={index} value={index}>{item}</Radio>
                            ))
                          }
                        </Radio.Group>
                    </li>
                    <li>
                        <span className={style.stitle}>选择行业</span>
                        <Radio.Group onChange={this.changeFormEvent.bind(this)} value={form.targetMediaCategory}>
                          <Radio value={0}>不限(默认)</Radio>
                          <Radio value={1}>自定义(查询数据字典的29个标签)</Radio>
                        </Radio.Group>
                        <div className={`${style.tags} ${form.targetMediaCategory === 0 ? null : 'hide'}`}>
                          {
                            mediaTypeLabel.map((item, index) => (
                              <label key={index} className={index === 1 ? style.active : null}>{item.label}</label>
                            ))
                          } 
                        </div>
                    </li>
                    <li>
                        <span className={style.stitle}>选择地域</span>
                        <Radio.Group onChange={this.changeFormEvent.bind(this)} value={form.targetArea}>
                          <Radio value={0}>不限(默认)</Radio>
                          <Radio value={1}>自定义(查询数据字典的身份)</Radio>
                        </Radio.Group>
                        <div className={`${style.tags} ${form.targetArea === 0 ? null : 'hide'}`}>
                          {
                            provinceTypeType.map((item, index) => (
                              <label key={index} className={index === 1 ? style.active : null}>{item.label}</label>
                            ))
                          } 
                        </div>
                    </li>
                  </ul>
                </Form.Item>
                <Form.Item label="计费方式" {...tailFormItemLayout}>
                    <Radio.Group onChange={this.changeFormEvent.bind(this)} value={form.charge_mode}>
                      <Radio value={1}>CPC</Radio>
                      <Radio value={2}>万粉</Radio>
                    </Radio.Group>
                </Form.Item>
                <h2 className="small-title"><em></em>价格信息</h2>
                <ul className={style.priceInfo}>
                  <li>阅读单价<Input className={style.ipttxt} />元/次阅读</li>
                  <li>万粉收益<Input className={style.ipttxt} />元/万粉</li>
                  <li style={{width: '100%'}}>活动预算<Input className={style.ipttxt} />元</li>     
                </ul>          
                <div className={style.warning}>推广效果: 预计您的广告将实现次有效阅读10000         阅读次数=活动预算/阅读单价</div>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className={style.btn}>下一步</Button>
                  <Link to="/main/selectmateria">下一步</Link>
                </Form.Item>
            </Form>
        </div>
      </div>
    )
  }
}
export default Form.create()(CreateAdvertity);