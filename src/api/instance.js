import axios from 'axios';
import {message} from 'antd';
import router from 'umi/router';
import { RSA_NO_PADDING } from 'constants';
let baserUrl;
if (window.location.hostname === 'localhost') {
  baserUrl = ''; 
} else if (window.location.hostname === '192.168.19.173') {
  baserUrl = 'http://192.168.19.173:8000';
} else {
  baserUrl = 'http://www.liantuotui.com';
}
const url = window.location.hostname === 'localhost' ? `/base/` : '/';
const instance = axios.create({
  baseURL: baserUrl,
  timeout: 50000,
  withCredentials: true
});
instance.interceptors.response.use(
  res => {
    if (res.data.code === 100000) {
      router.push('/relogin');
      window.localStorage.removeItem('login_info');
    }
    return res.data;
  },
  err => {
    //const {data: {err: errnum, error}} = (err || {}).response;
    /*if (errnum === 200 && error) {
      message.success(error);
    } else {
      message.error(error);
    }*/
  }
);
export default instance;
