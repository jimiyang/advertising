import React, {Component} from 'react';
import {Input, DatePicker, Form, Radio} from 'antd';
import style from './style.less';
import { Button } from 'antd-mobile';
import router from 'umi/router';
class CreateAdvertity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        name: '',
        date: '',
        activity_shap: 0, //活动形式
        sex: '', //性别
        industry: '', //行业
        area: '', //地区
        charge_mode: 1 //计费方式
      }
    };
  }
  componentWillMount() {
    console.log(window.common);
  }
  changeFormEvent = (type, e) => {
    console.log(e);
  }
  createEvent = (e) => {
    e.preventDefault();
    console.log(1);
    //router.push('/main/selectmateria');
  }
  render() {
    const {
      form
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
                   <DatePicker  className={style.ipttxt} />
                </Form.Item>
                <Form.Item label="活动形式" {...tailFormItemLayout}>
                  <Radio defaultChecked={form.activity_shap === 0 ? true : false}>公众号软文</Radio>
                </Form.Item>
                <Form.Item label="条件设置" {...tailFormItemLayout}>
                  <ul>
                    <li>
                       <span className={style.stitle}>男女比例</span>
                       <Radio.Group onChange={this.changeFormEvent.bind(this)} value={form.sex}>
                          <Radio value={1}>不限(默认)</Radio>
                          <Radio value={2}>男粉多</Radio>
                          <Radio value={3}>女粉多</Radio>
                        </Radio.Group>
                    </li>
                    <li>
                        <span className={style.stitle}>选择行业</span>
                        <Radio.Group onChange={this.changeFormEvent.bind(this)} value={form.industry}>
                          <Radio value={1}>不限(默认)</Radio>
                          <Radio value={2}>自定义(查询数据字典的29个标签)</Radio>
                        </Radio.Group>
                        <div className={style.tags}>
                          {
                            window.common.tagsData.map((item, index) => (
                              <label key={index} className={index === 1 ? style.active : null}>{item}</label>
                            ))
                          } 
                        </div>
                    </li>
                    <li>
                        <span className={style.stitle}>选择地域</span>
                        <Radio.Group onChange={this.changeFormEvent.bind(this)} value={form.area}>
                          <Radio value={1}>不限(默认)</Radio>
                          <Radio value={2}>自定义(查询数据字典的身份)</Radio>
                        </Radio.Group>
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
                  <li>活动预算<Input className={style.ipttxt} />元</li>     
                </ul>          
                <div className={style.warning}>推广效果: 预计您的广告将实现次有效阅读10000         阅读次数=活动预算/阅读单价</div>
                <Form.Item>
                  <Button type="primary" htmltype="submit" className={style.btn}>下一步</Button>
                </Form.Item>
            </Form>
        </div>
      </div>
    )
  }
}
export default Form.create()(CreateAdvertity);