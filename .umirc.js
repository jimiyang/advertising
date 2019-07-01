
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: {
        immer: true
      },
      dynamicImport: false,
      title: '联拓推',
      dll: true,
      /*routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },*/
      routes: { 
        path: '/',
        component: '../layouts',
        routes: []
      },
      hardSource: false,
      locale: {}
    }],
  ],
  routes: [
    {path: '/relogin', component: './relogin'},
    {path: '/', component: './login'},
    {path: '/register', component: './register'},
    {path: '/enter', component: './wrap/enter'},
    {
      path: '/main',
      component: '../layouts/index.js',
      routes: [ //.代表src/pages
        {path: '/main/createactivity', component: './advertisers/mypromotion/createactivity'}, //创建推广活动(广告主)
        {path: '/main/editactivity', component: './advertisers/mypromotion/editactivity'}, //编辑推广活动(广告主)
        {path: '/main/myactivity', component: './advertisers/mypromotion/myactivity'}, //我的推广活动(广告主)
        {path: '/main/activitydetail', component: './advertisers/mypromotion/activitydetail'},//我的推广活动详情(广告主)
        {path: '/main/materiallist', component: './advertisers/mypromotion/materiallist'}, //素材管理(广告主)
        {path: '/main/selectmateria', component: './advertisers/mypromotion/selectmateria'}, //选择素材(广告主)
        {path: '/main/editor', component: './advertisers/mypromotion/editor'}, //编辑器(广告主)
        {path: '/main/havedtask', component: './advertisers/taskmanagement/havedtask'}, //已接单任务(广告主)
        {path: '/main/advertdetail', component: './advertisers/taskmanagement/advertdetail'}, //查看活动/审核接单(广告主)
        {path: '/main/depositlist', component: './advertisers/financialaccount/depositlist'}, //充值记录(广告主)
        {path: '/main/withdrawallist', component: './advertisers/financialaccount/withdrawallist'}, //提现记录(广告主)
        {path: '/main/consumelist', component: './advertisers/financialaccount/consumelist'}, //消费记录(广告主)
        {path: '/main/qrcode', component: './advertisers/financialaccount/qrcode'}, //展示二维码页面
        {path: '/main/edit', component: './flowmain/order_makemoney/edit'}, //编辑我授权的公众号(流量主)
        {path: '/main/myorder', component: './flowmain/order_makemoney/myorder'}, //我要接单赚钱(流量主)
        {path: '/main/adtask', component: './flowmain/order_makemoney/adtask'}, //已接广告任务(流量主)
        {path: '/main/receivead', component: './flowmain/order_makemoney/receivead'}, //接此广告(流量主)
        {path: '/main/adtaskdetail', component: './flowmain/order_makemoney/adtaskdetail'}, //已接广告任务详情(流量主)
        {path: '/main/arningslist', component: './flowmain/myarnings/arningslist'}, //我的收益（结算记录）流量主
        {path: '/main/employesslist', component: './administrator/employees/employesslist'}, //员工列表(天目管理员)
        {path: '/main/adlist', component: './administrator/admangement/adlist'}, //广告主管理列表(天目管理员)
        {path: '/main/flowlist', component: './administrator/flowmainmangement/flowlist'}, //流量主管理列表(天目管理员)
        {path: '/main/accountinfo', component: './administrator/flowmainmangement/accountinfo'}, //流量主账号信息(天目管理员)
        {path: '/main/cashlist', component: './administrator/cashmangement/cashlist'}, //提现管理(天目管理员)
        {path: '/main/cashdetail', component: './administrator/cashmangement/cashdetail'}, //提现管理详情(天目管理员)
        {path: '/main/transferlist', component: './administrator/transfermagement/transferlist'}, // 转账充值审核（天目管理员
        {path: '/main/activitylist', component: './administrator/information/activitylist'}, // 活动管理（天目管理员)
        {path: '/main/viewdetail', component: './administrator/information/viewdetail'}, // 活动管理查看（天目管理员)
        {path: '/main/tasklist', component: './administrator/information/tasklist'}, // 任务管理（天目管理员)
        {path: '/main/activitysettlement', component: './administrator/settlement/activitysettlement'}, //活动审核结算(天目管理员)
        {path: '/main/msglist', component: './administrator/message/msglist'}, // 消息发布（天目管理员)
      ]
    },
  ],
  proxy: {
    '/base': {
      target: 'http://192.168.19.173:8000',
      pathRewrite: { '^/base': '' },
      changeOrigin: true
    }
  }
}
