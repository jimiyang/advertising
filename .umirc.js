
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
    {path: '/', component: './login.jsx'},
    {path: '/register', component: './register.jsx'},
    {path: '/enter', component: './enter.jsx'},
    {
      path: '/main',
      component: '../layouts/index.js',
      routes: [
        {path: '/main/option1', component: './components/option1'},
        {path: '/main/option3', component: './components/option3'},
        {path: '/main/help', component: './components/help'},
      ]
    },
  ]
}
