import 'root/style/normalize.css';
import 'root/style/fonts.scss';
import 'root/app.scss';
import Navbar from 'root/navbar/navbar.jsx';
import React from 'react';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Navbar/>
        <div className="main">
          {this.props.children}
        </div>
      </div>
    )
  }
}
