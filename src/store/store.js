import {createStore, applyMiddleware, compose} from 'redux'
import reduxOrder from 'redux-order'
import reducers from './reduces'

const enhancer = compose(applyMiddleware(reduxOrder()))
const store = createStore(
  reducers,
  enhancer
)
export default store
