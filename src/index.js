/**
 * Styles
 */
import '../node_modules/office-ui-fabric-react/dist/css/fabric.css'
import './_styles/_variables.css'
import './_styles/index.css';
import './_styles/App.css'
import './_styles/Tables.css'
/**
 * App
 */
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import configureStore from './store/configureStore'
/**
 * Configure Redux Store
 */
const store = configureStore()
/**
 * Render
 */
const rootEl = document.getElementById('root')
ReactDOM.render(
  <App store={store}/>,
  rootEl
);