import React, { PropTypes as T, Component } from 'react';
import {Provider} from 'react-redux'
import Layout from './Layout.js'

class App extends Component {
  static props = {
    store: T.object.isRequired,
  }

  render() {
    return ( 
      <Provider store={this.props.store}>
        <Layout />
      </Provider>
    )    
  }
}

export default App;
