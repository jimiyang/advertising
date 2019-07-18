import { combineReducers } from 'redux'
const EDIT_TODO = 'EDIT_TODO'
const ADD_TODO = 'ADD_TODO'
const ROUTER_TODO = 'ROUTER_TODO'
//如果action申明了要做什么，那么具体区改变（更新）state，就是reducer做的事情了，
//这样理解吧，action约定了一个type，然后reducer遇到这个type，就去做一件事
//type是这个指令的唯一标识
const initialState = {
    count: 0,
    arr: [],
    routerType: ''
}
// Reducer
// 获取组件提交(action)过来的值
const todos = (state = initialState, action) => {
    switch(action.type) {
        case EDIT_TODO:
          return {
            ...state,
            count: state.count + 1
          }
        case ADD_TODO:
          return {
            ...state,
            arr: action.arr
          }
        case ROUTER_TODO:
          return {
            ...state,
            routerType: action.routerType
          }
        default:
          return state
    }
}
//使用redux的combineReducers方法将所有reducer打包起来
const rootReducer = combineReducers({
  todos
})
export default rootReducer