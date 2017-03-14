import 'root/assets/font-awesome/font-awesome.css';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router';
import React from 'react';

import 'root/lists/compact-ref-list.scss';

export default class CompactRefList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {viewMenu: false};
  }
  closeBackdrop = () => {
    this.setState({
      viewMenu: false
    });
  }
  showMenu = () => {
    this.setState((prevState) => ({
      viewMenu: !prevState.viewMenu
    }));
  }
  render () {
    let menuPosition = {right: '5px', top: '5px'};
    if(this.props.anchor === 'topRight') {
      menuPosition = {right: '5px', top: '5px'};
    }
    return (
      <div className="compact-list">
        <a onClick={this.showMenu}>
          <FontAwesome name='list' />
        </a>
        { !this.state.viewMenu ? null :
          <div className="compact-backdrop" onClick={this.closeBackdrop}>
            <div className="compact-menu" style={menuPosition}>
              <ul className="vertical-list">
                {this.props.items.map((item) => (
                  <Link key={item.link} to={item.link}>
                    <li>
                      {item.name}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          </div>
        }
      </div>
    )
  }
}
