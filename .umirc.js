
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
    {path: '/enter', component: './enter'},
    {
      path: '/main',
      component: '../layouts/index.js',
      routes: [ //.代表src/pages
        {path: '/main/createactivity', component: './mypromotion/createactivity'},
        {path: '/main/myactivity', component: './mypromotion/myactivity'},
        {path: '/main/materiallist', component: './mypromotion/materiallist'},
        {path: '/main/selectmateria', component: './mypromotion/selectmateria'}
      ]
    },
  ]
}
