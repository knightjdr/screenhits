import React from 'react';
import ReactDOM from 'react-dom';

import Head from './head/head';
import Routing from './router/router';
import Store from './state/store';
import Theme from './style/theme';

class Main extends React.Component {
  render() {
    return (
      <Store>
        <Head />
        <Theme>
          <Routing />
        </Theme>
      </Store>
    );
  }
}

const app = document.getElementById('app');
ReactDOM.render(<Main />, app);
