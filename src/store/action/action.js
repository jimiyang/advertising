//action提供一些状态函数，store数据的来源就是action，
//需要至少一个type，type是这个指令的唯一标识，其他元素是传送这个指令的state值，这个指令有组件触发，然后传到给reducer
//type是这个指令的唯一标识
const EDIT_TODO = 'EDIT_TODO'
const ADD_TODO = 'ADD_TODO'
const ROUTER_TODO = 'ROUTER_TODO'
const increment = ()=> {
    return {
        type: EDIT_TODO,
    }
}
const decrement = ()=> {
    return {type: 'DECREMENT_COUNTER'}
}
const add = (arr) => {
    return {
        type: ADD_TODO,
        arr
    }
}
const changeMenuType = (routerType) => {
    return {
        type: ROUTER_TODO,
        routerType
    }
}
export default {
    increment,
    decrement,
    add,
    changeMenuType
}
