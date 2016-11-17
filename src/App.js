import React, { PropTypes as T } from 'react';
import { Provider } from 'react-redux'
import {Header, Footer, LeftBar, Content} from './components/App/'
import Tables from './containers/Tables.js'

class App extends React.Component {
  static propTypes = {
    store: T.object.isRequired, 
  }
  
  render() {
    return (
      <Provider store={this.props.store}>
        <div className="App">
          <Header className="App__header"/>
          <div className="App__body">
            <Content className="App__content">
              <Tables />
            </Content>
            <LeftBar className="App__leftbar"/>      
          </div>
          <Footer className="App__footer"/>
        </div>
      </Provider>
    );
  }
}

export default App;