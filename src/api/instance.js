import axios from 'axios';
const instance = axios.create({
  baseURL: '',
  timeout: 50000,
  withCredentials: true
});
instance.interceptors.response.use(
  res => {
    const promise = new Promise((resolve, reject) => {
      if (res.status === 200 && res.data.success === true) {
        resolve(res.data);
      } else {
        reject(res.data);
      }
    });
    return promise;
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
