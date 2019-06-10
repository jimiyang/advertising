import React, {Component} from 'react';
import {Select, DatePicker, Input} from 'antd';
import style from './component.less';
const Option = Select.Option;
class ReceiveAd extends Component{
  render() {
    return (
      <ul className={style.receiveAd}>
        <li>
          <em className={style.name}>公众号：</em><div>万物生活馆</div>
        </li>
        <li>
          <em className={style.name}>媒体标签：</em><div>汽车、美食、新闻</div>
        </li>
        <li>
          <em className={style.name}>推广活动名称：</em><div>77岁老人健步如飞</div>
        </li>
        <li>
          <em className={style.name}>阅读单价：</em><div>0.33元/次阅读</div>
        </li>
        <li>
          <em className={style.name}>活动时间：</em><div>2019.5.1-2019.6.1</div>
        </li>
        <li>
          <em className={style.name}>活动时间：</em>
          <div>
            <Select defaultValue="" className="w260">
              <Option value={0}>头条</Option>
            </Select>
          </div>
        </li>
        <li>
          <em className={style.name}>接单数量（阅读）：</em>
          <div>
            <Input className="w260"/>
          </div>
        </li>
        <li>
          <em className={style.name}>预计发文时间：</em>
          <div>
            <DatePicker className="w260"/>
          </div>
        </li>
      </ul>
    );
  }
};
export default ReceiveAd;