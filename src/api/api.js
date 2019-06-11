import axios from './instance';
//通用接口
function baseInstance(service_url, params) {
  return (
    axios.post(service_url, params).then((response) => response)
  );
}
export default {baseInstance};