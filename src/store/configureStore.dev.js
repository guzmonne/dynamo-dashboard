import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
/*import createLogger from 'redux-logger'*/
import aws from '../middleware/aws.js'
import rootReducer from '../reducers'

const configureStore = preloadedState => {
  const composeEnhacers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const store = createStore(
    rootReducer,
    preloadedState,
    composeEnhacers(
      applyMiddleware(thunk, aws/*, createLogger()*/),
    )
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}

export default configureStore