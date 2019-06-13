const utils =  {
  tagsData: ['汽车', '美食', '地方号', '运动户外', '房产家居', '母婴', '娱乐', '科技', '健康养生', '两性健康', '财富', '美容护肤', '宗教', '军事', '进阶职场', '游戏动漫', '直播', '搞笑趣闻', '时尚', '情感', '星座占卜', '生活服务', '萌宠', '亲子教育'],
  //广告主订单状态
  orderStatus: ['待审核', '待执行', '执行中', '待结算', '任务完成', '任务取消', '审核驳回'],
  //广告主文章所在位置
  advertLocal: ['多图文第一条', '多图文第二条', '多图文第三条', '多图文第四条', '多图文第五条', '多图文第六条', '多图文第七条', '多图文第八条'],
  //活动状态
  postStatus: ['活动草稿', '审核中', '审核驳回', '待接单', '活动过期', '活动取消', '接单中', '执行中', ' 执行完成', '执行结束'],
  //男女粉丝设置
  targetGender: ['不限', '男粉', '女粉', '男大于女', '女大于男', '男女各半'],
  //获取时间
  getDate(time, flag) {
    const date = new Date(time);
    const y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? (`0${m}`) : m;
    let d = date.getDate();
    d = d < 10 ? (`0${d}`) : d;
    let h = date.getHours();
    h = h < 10 ? (`0${h}`) : h;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    minute = minute < 10 ? (`0${minute}`) : minute;
    second = second < 10 ? (`0${second}`) : second;
    const str = flag ? `${y}-${m}-${d} ${h}:${minute}:${second}` : `${m}月${d}日 ${h}:${minute} `;
    return str;
  },
  getAdType(type) { //活动形式
    let typeName = '';
    switch(type) {
      case 'link':
        typeName='H5支付后广告';
        break;
      case 'banner':
        typeName='banner广告';
        break;
      case 'miniapp':
        typeName='小程序广告';
        break;
      case 'article':
        typeName='软文广告';
        break;
      case 'section':
        typeName='软文贴片广告';
        break;
      default:
        typeName='H5支付后广告';
        break;
    }
    return typeName;
  }
};
export default utils;