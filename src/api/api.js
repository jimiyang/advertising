import axios from './instance';
//通用接口
/*function baseInstance(service_url, params) {
  const url = window.location.hostname === 'localhost' ? `/base/${service_url}` : service_url;
  return (
    axios.post(url, params).then((response) => response)
  );
}
export default {baseInstance};*/
const url = window.location.hostname === 'localhost' ? `/base/` : '/';
//登录
export const login = params => axios.post(`${url}login`, params);
//退出登录
export const logout = params => axios.post(`${url}logout`, params);
//检测登录
export const checkLogin = params => axios.post(`${url}checkLogin`, params);
//注册
export const register = params => axios.post(`${url}api/merchant/add`, params);
//获取对应字典标签
export const getDictByType = params => axios.post(`${url}admin/system/dict/getDictByType`, params);
//获取可用余额和冻结余额
export const caQuery = params => axios.post(`${url}api/merchant/caQuery`, params);
//充值接口
export const native = params => axios.post(`${url}api/topup/native`, params);
//查询所有公众号(流量主使用)
export const listApps = params => axios.post(`${url}flow/wechat/listapps`, params);
//充值检测orderQuery
export const orderQuery = params => axios.post(`${url}api/topup/orderQuery`, params);
//创建活动(广告主)
export const add = params => axios.post(`${url}api/ad/campaign/add`, params);
//编辑活动(广告主)
export const edit = params => axios.post(`${url}api/ad/campaign/edit`, params);
//获取活动详情
export const getById = params => axios.post(`${url}api/ad/campaign/getById`, params);
//活动列表(广告主)
export const list = params => axios.post(`${url}api/ad/campaign/list`, params);
//获取统计总数
export const getAdCampaignCountByPostStatus = params => axios.post(`${url}api/ad/campaign/getAdCampaignCountByPostStatus`, params);
//获取文章列表
export const articleList = params => axios.post(`${url}ad/article/list`, params);
//提交推广或者保存草稿(广告主)
export const updatePostContentById = params => axios.post(`${url}api/ad/campaign/updatePostContentById`, params);
//修改活动状态(广告主)
export const updatePostStatusById = params => axios.post(`${url}api/ad/campaign/updatePostStatusById`, params);
//删除素材(广告主)
export const deleteArticleById = params => axios.post(`${url}ad/article/deleteArticleById`, params);
//素材库编辑之前检测文章是否已推广(广告主)
export const judgeArticleUseById = params => axios.post(`${url}ad/article/judgeArticleUseById`, params);
//已接任务列表(广告主)
export const missionList = params => axios.post(`${url}api/ad/mission/list`, params);
//已接任务详情(广告主)
export const missiongetById = params => axios.post(`${url}api/ad/mission/getById`, params);
//已接任务审核(广告主)
export const checkMissionOrderById = params => axios.post(`${url}api/ad/mission/checkMissionOrderById`, params);
//财务支出(广告主)
export const topupList = params => axios.post(`${url}api/topup/list`, params);
//消费记录(广告主)
export const financeList = params => axios.post(`${url}admin/ad/finance/list`, params);
//查看订单详情(广告主)
export const getByOrderNo = params => axios.post(`${url}api/topup/getByOrderNo`, params);
//可接任务列表(流量主)
export const campaignList = params => axios.post(`${url}flow/campaign/list`, params);
//已接任务列表(流量主)
export const flowMissionList = params => axios.post(`${url}flow/mission/list`, params);
//已接任务详情(流量主)
export const detail = params => axios.post(`${url}flow/campaign/detail`, params);
//结算记录(流量主)
export const flowFinanceList = params => axios.post(`${url}admin/flow/finance/list`, params);
//接此广告(流量主)
export const flowMissionAdd = params => axios.post(`${url}flow/mission/add`, params);
//提现记录(流量主)
export const historyList = params => axios.post(`${url}api/withdraw/historyList`, params);
//提现申请(流量主)
export const applyWithdraw = params => axios.post(`${url}api/withdraw/applyWithdraw`, params);
//员工列表(管理员)
export const employeeList = params => axios.post(`${url}api/employee/list`, params);
//员工详情(管理员)
export const employeeGetById = params => axios.post(`${url}api/employee/getById`, params);
//添加员工(管理员)
export const employeeAdd = params => axios.post(`${url}api/employee/add`, params);
//编辑员工(管理员)
export const employeeEdit = params => axios.post(`${url}api/employee/edit`, params);
//广告主列表(管理员)
export const merchantList = params => axios.post(`${url}api/merchant/list`, params);
//编辑商户信息(管理员)
export const merchantEdit = params => axios.post(`${url}api/merchant/edit`, params);
//编辑商户信息(管理员)
export const merchantAdd = params => axios.post(`${url}api/merchant/add`, params);
//活动列表(管理员)
export const checkAdCampaignList = params => axios.post(`${url}api/ad/campaign/checkAdCampaignList`, params);
//任务列表(管理员)
export const listallMission = params => axios.post(`${url}api/ad/mission/listallMission`, params);
//结算详情
export const list4Settle = params => axios.post(`${url}manager/campaign/list4Settle`, params);
//活动结算审核(管理员)
export const settleCampaign = params => axios.post(`${url}manager/campaign/settleCampaign`, params);
//管理员查询提现列表(管理员)
export const queryWithdrawManager = params => axios.post(`${url}api/withdraw/queryWithdrawManager`, params);
//账户提现详情(管理员)
export const withdrawDetail = params => axios.post(`${url}api/withdraw/withdrawDetail`, params);
//提现审核(管理员)
export const withdrawAudit = params => axios.post(`${url}api/withdraw/withdrawAudit`, params);
//提现支付(管理员)
export const withdrawPay = params => axios.post(`${url}api/withdraw/withdrawPay`, params);
