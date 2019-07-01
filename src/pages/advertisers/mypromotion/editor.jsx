import React, {Component} from 'react';
import style from './style.less';
class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      iframeHeight: 800,
      employeeId: null,
      merchantCode: null
    };
  }
  componentWillMount() {
    if (this.props.location.state) {
      this.setState({id: this.props.location.state.id});
    }
    const loginInfo = JSON.parse(window.localStorage.getItem('login_info'));
    this.setState({
      iframeHeight: document.documentElement.clientHeight - 130,
      employeeId: loginInfo.data.employeeId,
      merchantCode: loginInfo.data.merchantCode
    });

  }
  render() {
    const {
      id,
      iframeHeight,
      employeeId,
      merchantCode
    } = this.state;
    console.log(this.state);
    return (
      <div className={style.mypromotion}>
        <div className={style.content}>
          <iframe className={style.iframe} src={`http://testadx.liantuo.com/fshstatic/#/?merchantCode=${merchantCode}&id=${id}&ltt=true&createBy=${employeeId}`} height={iframeHeight}></iframe>
        </div>
      </div>
    );
  }
};
export default Editor;