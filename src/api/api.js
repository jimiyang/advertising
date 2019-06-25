import axios from './instance';
//通用接口
function baseInstance(service_url, params) {
  const url = window.location.hostname === '192.168.41.13' ? `/base/${service_url}` : service_url;
  return (
    axios.post(url, params).then((response) => response)
  );
}
export default {baseInstance};