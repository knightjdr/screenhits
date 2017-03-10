import Head from 'root/head/head.jsx';
import React from 'react';
import ReactDOM from 'react-dom';
import Routing from './router/router.jsx';

class Main extends React.Component {
  render() {
    return (
      <div>
        <Head />
        <Routing />
      </div>
    );
  }
}

const app = document.getElementById('app');
ReactDOM.render(<Main />, app);
