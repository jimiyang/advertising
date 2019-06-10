import React, {Component} from 'react';
import {Button, Radio, Input} from 'antd';
import style from './style.less';
const {TextArea} = Input;
class AdvertDetail extends Component{
  componentWillMount() {
    console.log(this.props.location.query.id);
  }
  changeFormEvent = () => {
    console.log(1);
  }
  render() {
    return(
      <div className={style.task}>
        <h1 className="nav-title">已接单的任务 > 查看推广活动</h1>
        <ul className={style.detaillist}>
          <li>
            订单号：
            <div></div>
          </li>
          <li>
            接单时间：
            <div></div>
          </li>
          <li>
            广告位置：
            <div></div>
          </li>
          <li>
            订单状态：
            <div></div>
          </li>
          <li>
            订单审核意见：
            <div></div>
          </li>
          <li>
            接单公众号：
            <div></div>
          </li>
          <li>
            接单笔数：
            <div></div>
          </li>
          <li>
            阅读单价：
            <div></div>
          </li>
          <li>
            活动名称：
            <div></div>
          </li>
          <li>
            活动状态：
            <div></div>
          </li>
          <li>
            活动审核意见：
            <div className={style.textarea}>
                的撒范德萨发生的
            </div>
          </li>
          <li>
            活动日期：
            <div></div>
          </li>
          <li>
            条件设置：
            <div>
              <ul>
                <li>
                  <span className={style.stitle}>男女比例</span>
                  <Radio.Group className="ml10" onChange={this.changeFormEvent.bind(this)}>
                    <Radio value={1}>不限(默认)</Radio>
                    <Radio value={2}>男粉多</Radio>
                    <Radio value={3}>女粉多</Radio>
                  </Radio.Group>
                </li>
                <li>
                  <span className={style.stitle}>选择行业</span>
                  <Radio.Group className="ml10" onChange={this.changeFormEvent.bind(this)}>
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
                  <Radio.Group className="ml10" onChange={this.changeFormEvent.bind(this)}>
                    <Radio value={1}>不限(默认)</Radio>
                    <Radio value={2}>自定义(查询数据字典的身份)</Radio>
                  </Radio.Group>
                </li>
              </ul>  
            </div>
          </li>
          <li>
            活动形式：
            <div>fsdafdsa</div>
          </li>
          <li>
            活动素材：
            <div className={style.coverimg}>
              <p>展示封面标题，点击可查看详情</p>
              <img src={require('../../../assets/media-ico.jpg')} />
            </div>
          </li>
          <li>
            阅读单价：
            <div></div>
          </li>
          <li>
            其他需求：
            <div className={style.textarea}>
                的撒范德萨发生的
            </div>
          </li>
          <li>
            活动效果：
            <div>预计您的广告将实现次有效阅读10000</div>
          </li>
          <li>
            审核状态：
            <div>
              <Radio.Group onChange={this.changeFormEvent.bind(this)}>
                <Radio value={1}>通过</Radio>
                <Radio value={2}>不通过</Radio>
              </Radio.Group>
            </div>
          </li>
          <li>
            活动审核意见：
            <div>
              <TextArea rows={4} className={style.textarea} />
            </div>
          </li>
          <li className={style.btnitems}>
            <Button type="primary">提交</Button>
          </li>
        </ul>
      </div>
    )
  }
}
export default AdvertDetail;