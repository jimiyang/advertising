import React, {Component} from 'react';
import style from './style.less';
class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      iframeHeight: 800
    };
  }
  componentWillMount() {
    if (this.props.location.state) {
      this.setState({id: this.props.location.state.id});
    }
    this.setState({iframeHeight: document.documentElement.clientHeight - 130});
  }
  render() {
    const {
      id,
      iframeHeight
    } = this.state;
    return (
      <div className={style.mypromotion}>
        <div className={style.content}>
          <iframe className={style.iframe} src={`http://testadx.liantuo.com/fshstatic/#/?key=${id}}&type=ltt`} height={iframeHeight}></iframe>
        </div>
      </div>
    );
  }
};
export default Editor;