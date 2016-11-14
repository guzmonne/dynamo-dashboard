import React, { Component } from 'react';
import {Header, Footer, LeftBar, Content} from './components/App/'
import Tables from './components/Tables/'

class App extends Component {
  render() {
    return (
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
    );
  }
}

export default App;
