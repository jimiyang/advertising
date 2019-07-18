
const utils =  {
  tagsData: ['汽车', '美食', '地方号', '运动户外', '房产家居', '母婴', '娱乐', '科技', '健康养生', '两性健康', '财富', '美容护肤', '宗教', '军事', '进阶职场', '游戏动漫', '直播', '搞笑趣闻', '时尚', '情感', '星座占卜', '生活服务', '萌宠', '亲子教育'],
  //广告主订单/任务状态
  orderStatus: ['待审核', '待执行', '执行中', '待结算', '任务完成', '任务取消', '审核驳回'],
  //广告主文章所在位置
  advertLocal: ['多图文第一条', '多图文第二条', '多图文第三条', '多图文第四条', '多图文第五条', '多图文第六条', '多图文第七条', '多图文第八条'],
  //活动状态
  postStatus: ['草稿', '审核中', '审核驳回', '待接单', '过期未接单', '活动取消', '接单中', '执行中', '执行完毕', '活动完成'],
  //男女粉丝设置
  targetGender: ['不限', '男粉', '女粉', '男大于女', '女大于男', '男女各半'],
  //计费方式：
  billingTypesData: ['CPM', 'CPC', 'CPA', '万粉'],
  payOrderStatus: ['未支付', '支付中', '支付完成', '支付失败'],
  articleUrl: 'http://test.fensihui.com/', //文章预览地址
  //删除数组中为空的元素
  removeEmptyArrayEle(arr) {    
    for(var i = 0; i < arr.length ;i++) {
     if(arr[i] == undefined) {
        arr.splice(i,1)
        i = i - 1 // i - 1 ,因为空元素在数组下标 2 位置，删除空之后，后面的元素要向前补位，
        // 这样才能真正去掉空元素,觉得这句可以删掉的连续为空试试，然后思考其中逻辑
      }
     }
     return arr
  },
  //获取时间
  getDate(time, flag) {
    const date = new Date(time)
    const y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? (`0${m}`) : m
    let d = date.getDate()
    d = d < 10 ? (`0${d}`) : d
    let h = date.getHours()
    h = h < 10 ? (`0${h}`) : h
    let minute = date.getMinutes()
    let second = date.getSeconds()
    minute = minute < 10 ? (`0${minute}`) : minute
    second = second < 10 ? (`0${second}`) : second
    const str = flag ? `${y}-${m}-${d} ${h}:${minute}:${second}` : `${y}-${m}-${d} `
    return str
  },
  //时间格式化
  getTime() {
    let d = new Date()
    let year = d.getFullYear()
    let month = d.getMonth() + 1 > 10 ? d.getMonth()+1 : `0${d.getMonth()+1}`
    let day = d.getDate() > 10 ? d.getDate() : `0${d.getDate()}`
    let hour = d.getHours() > 10 ? d.getHours() : `0${d.getHours()}`
    let minute = d.getMinutes() > 10 ? d.getMinutes() : `0${d.getMinutes()}`
    let second = d.getSeconds() > 10 ? d.getSeconds() : `0${d.getSeconds()}`
    const time = `${year}-${month}-${day} ${hour}:${minute}:${second}`
    return time
  },
  // 日期对比，得出天数 
  dateDiff(sDate1,  sDate2){
    let oDate1, oDate2, iDays
    oDate1 = new Date(sDate1)     
    oDate2 = new Date(sDate2)  
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) + 1     
    return  iDays
  },
  getAdType(type) { //活动形式
    let typeName = ''
    switch(type) {
      case 'link':
        typeName='H5支付后广告'
        break
      case 'banner':
        typeName='banner广告'
        break
      case 'miniapp':
        typeName='小程序广告'
        break
      case 'article':
        typeName='公众号软文'
        break
      case 'section':
        typeName='软文贴片广告'
        break
      default:
        typeName='H5支付后广告'
        break
    }
    return typeName
  },
  formatNumber(count) {
    let source = String(count).split(".")//按小数点分成2部分
    source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)','ig'),"$1,")//只将整数部分进行都好分割
    return source.join(".")//再将小数部分合并进来
    //return count
  }
}
export default utils