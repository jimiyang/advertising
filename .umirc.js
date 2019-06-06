
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
    {path: '/', component: './login'},
    {path: '/register', component: './register'},
    {path: '/enter', component: './wrap/enter'},
    {
      path: '/main',
      component: '../layouts/index.js',
      routes: [ //.代表src/pages
        {path: '/main/createactivity', component: './mypromotion/createactivity'}, //创建推广活动
        {path: '/main/myactivity', component: './mypromotion/myactivity'}, //我的推广活动
        {path: '/main/materiallist', component: './mypromotion/materiallist'}, //素材管理
        {path: '/main/selectmateria', component: './mypromotion/selectmateria'}, //选择素材
        {path: '/main/editmateria', component: './mypromotion/editmateria'}, //编辑素材
        {path: '/main/havedtask', component: './taskmanagement/havedtask'}, //已接单任务
        {path: '/main/advertdetail', component: './taskmanagement/advertdetail'}, //查看活动/审核接单
        {path: '/main/depositlist', component: './financialaccount/depositlist'}, //充值记录
        {path: '/main/withdrawallist', component: './financialaccount/withdrawallist'}, //提现记录
        {path: '/main/consumelist', component: './financialaccount/consumelist'}, //消费记录
      ]
    },
  ]
}
