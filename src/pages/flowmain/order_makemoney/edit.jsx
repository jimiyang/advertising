import React, {Component} from 'react';
import {Button, Input, Checkbox, Row, Col} from 'antd';
import style from './style.less';
class Edit extends Component{
  constructor(props){
    super(props);
    this.state = {
      value: ''
    };
  }
  onChange = (checkedValues) => {
    console.log('checked = ', checkedValues);
  }
  goBackEvent = () => {
    window.history.go(-1);
  }
  render() {
    return(
      <div className={style.pubAccount}>
        <h1 className="nav-title">我授权的公众号 > 编辑公众号属性</h1>
        <dl className={style.editItems}>
          <dd className={style.pb20}>
            <em className={style.name}>公众号名称</em>
            <div>
              万物生活派
            </div>
          </dd>
          <dd className={style.pb20}>
            <em className={style.name}>公众号ID</em>
            <div>
              Sdlfkja34lsdf8924234
            </div>
          </dd>
          <dd>
            <em className={style.name}>媒体标签</em>
            <div>
              <Checkbox.Group style={{width: '100%'}} onChange={this.onChange}>
                <Row>
                  {
                    window.common.tagsData.map((item, index) => (
                      <Col span={3} className="mb10" key={index}>
                        <Checkbox value={item}>{item}</Checkbox>
                      </Col>
                    ))
                  }
                </Row>
              </Checkbox.Group>
            </div>
          </dd>
          <dd>
            <em className={style.name}>男粉比例</em>
            <div>
              <Input className={style.ipttxt} />
            </div>
          </dd>
          <dd>
            <em className={style.name}>女粉比例</em>
            <div>
              <Input className={style.ipttxt} />
            </div>
          </dd>
          <dd>
            <em className={style.name}>头条均阅读</em>
            <div>
              <Input className={style.ipttxt} />
            </div>
          </dd>
          <dd>
            <em className={style.name}>二条均阅读</em>
            <div>
              <Input className={style.ipttxt} />
            </div>
          </dd>
          <dd>
            <em className={style.name}>二条价格</em>
            <div>
              <Input className={style.ipttxt} />
            </div>
          </dd>
          <dt>
            <Button type="primary">提交</Button>
            <Button className="ml40" onClick={this.goBackEvent.bind(this)}>返回列表</Button>
          </dt>
        </dl>
      </div>
    )
  }
};
export default Edit;