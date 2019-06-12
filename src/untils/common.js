const utils =  {
  tagsData: ['汽车', '美食', '地方号', '运动户外', '房产家居', '母婴', '娱乐', '科技', '健康养生', '两性健康', '财富', '美容护肤', '宗教', '军事', '进阶职场', '游戏动漫', '直播', '搞笑趣闻', '时尚', '情感', '星座占卜', '生活服务', '萌宠', '亲子教育'],
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
};
export default utils;