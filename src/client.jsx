import Navbar from './navbar/navbar.jsx';
import React from 'react';
import ReactDOM from 'react-dom';

class Main extends React.Component {
  render() {
    return (
      <Navbar/>
    );
  }
}

const app = document.getElementById('app');
ReactDOM.render(<Main />, app);
