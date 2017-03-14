import Head from 'root/head/head.jsx';
import React from 'react';
import ReactDOM from 'react-dom';
import Routing from './router/router.jsx';
import Store from 'root/state/store.jsx';
import Theme from 'root/style/theme.jsx';

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
