import 'fontAwesome';
import React from 'react';

import './compact-ref-list.scss';

export default class CompactRefList extends React.Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.state = {viewMenu: false};
    if(this.props.anchor === 'topRight') {
      this.state.menuPosition = {right: '5px', top: '5px'};
    }
  }
  closeModal() {
    this.setState({
      viewMenu: false
    });
  }
  showMenu() {
    this.setState((prevState) => ({
      viewMenu: !prevState.viewMenu
    }));
  }
  render () {
    return (
      <div className="compact-list">
        <a onClick={this.showMenu}>
          <i className="fa fa-list"></i>
        </a>
        { !this.state.viewMenu ? null :
          <div className="compact-modal" onClick={this.closeModal}>
            <div className="compact-menu" style={this.state.menuPosition}>
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
