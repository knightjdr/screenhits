import PropTypes from 'prop-types';
import React from 'react';

import ActionMenu from './menu/action-menu-container';
import CreateContent from './create/create-content-container';
import DisplayContent from './display/display-content-container';
import ManageContent from './manage/manage-content-container';
import ProtocolContent from './protocol/protocol-content-container';
import ManagementMenu from './menu/management-menu-container';

const introStyle = {
  fontFamily: 'Roboto',
  left: 0,
  marginLeft: 5,
  marginRight: 5,
  position: 'absolute',
  right: 0,
  textAlign: 'center',
  top: '30%',
};

class ManagementContent extends React.Component {
  render() {
    let content;
    if (this.props.menuBoolean.create) {
      content = (<CreateContent
        activeLevel={ this.props.activeLevel }
        cancelMenuAction={ this.props.cancelMenuAction }
      />);
    } else if (this.props.menuBoolean.manage) {
      content = (<ManageContent
        cancelMenuAction={ this.props.cancelMenuAction }
        lab={ this.props.item.lab }
        name={ this.props.item.name }
        permission={ this.props.item.permission }
        selected={ this.props.selected }
        top={ this.props.top }
      />);
    } else if (this.props.menuBoolean.protocol) {
      content = (<ProtocolContent
        cancelMenuAction={ this.props.cancelMenuAction }
        lab={ this.props.item.lab }
        name={ this.props.item.name }
      />);
    } else if (this.props.selected) {
      content = (<DisplayContent
        activeLevel={ this.props.activeLevel }
        cancelMenuAction={ this.props.cancelMenuAction }
        edit={ this.props.menuBoolean.edit }
        item={ this.props.item }
        key={ this.props.selected }
        selected={ this.props.selected }
      />);
    } else if (this.props.availableLength === 0) {
      content = (<div style={ introStyle }>
        Create a new { this.props.activeLevel } to begin
      </div>);
    } else {
      content = (<div style={ introStyle }>
        Select an existing { this.props.activeLevel } or
        create a new { this.props.activeLevel } to begin
      </div>);
    }
    return (
      <div
        style={ {
          flex: '1 1 auto',
          height: '100%',
          padding: '0px 5px 0px 5px',
          position: 'relative',
          top: 0,
        } }
      >
        <div
          style={ {
            bottom: 0,
            left: 5,
            position: 'absolute',
            width: 50,
          } }
        >
          <ManagementMenu
            activeLevel={ this.props.activeLevel }
            menuActions={ this.props.menuActions }
            selected={ this.props.selected }
          />
        </div>
        <div
          style={ {
            bottom: 0,
            position: 'absolute',
            right: 5,
            width: 50,
          } }
        >
          <ActionMenu />
        </div>
        { content }
      </div>
    );
  }
}

ManagementContent.defaultProps = {
  selected: null,
};

ManagementContent.propTypes = {
  activeLevel: PropTypes.string.isRequired,
  availableLength: PropTypes.number.isRequired,
  cancelMenuAction: PropTypes.func.isRequired,
  menuActions: PropTypes.shape({
    create: PropTypes.func,
    edit: PropTypes.func,
    manage: PropTypes.func,
    protocol: PropTypes.func,
    update: PropTypes.func,
  }).isRequired,
  menuBoolean: PropTypes.shape({
    create: PropTypes.bool,
    edit: PropTypes.bool,
    manage: PropTypes.bool,
    protocol: PropTypes.bool,
  }).isRequired,
  item: PropTypes.shape({
    lab: PropTypes.string,
    name: PropTypes.string,
    permission: PropTypes.string,
  }).isRequired,
  selected: PropTypes.number,
  top: PropTypes.func.isRequired,
};

export default ManagementContent;
