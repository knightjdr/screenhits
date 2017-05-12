import PropTypes from 'prop-types';
import React from 'react';

import CreateContent from './create/create-content-container';
import DisplayContent from './display/display-content-container';
import ManageContent from './manage/manage-content-container';
import ManagementMenu from './menu/management-menu-container';

const introStyle = {
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
    if (this.props.createBoolean) {
      content = (<CreateContent
        active={ this.props.active }
        cancel={ this.props.cancel }
      />);
    } else if (this.props.manageBoolean) {
      content = (<ManageContent
        cancel={ this.props.cancel }
        lab={ this.props.item.lab }
        name={ this.props.item.name }
        permission={ this.props.item.permission }
        selected={ this.props.selected }
        top={ this.props.top }
      />);
    } else if (this.props.selected) {
      content = (<DisplayContent
        active={ this.props.active }
        cancel={ this.props.cancel }
        edit={ this.props.editBoolean }
        item={ this.props.item }
        key={ this.props.selected }
        selected={ this.props.selected }
      />);
    } else if (this.props.availableLength === 0) {
      content = (<div style={ introStyle }>
        Create a new { this.props.active } to begin
      </div>);
    } else {
      content = (<div style={ introStyle }>
        Select an existing { this.props.active } or create a new { this.props.active } to begin
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
            active={ this.props.active }
            funcs={ {
              create: this.props.funcs.create,
              edit: this.props.funcs.edit,
              manage: this.props.funcs.manage,
            } }
            selected={ this.props.selected }
          />
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
  active: PropTypes.string.isRequired,
  availableLength: PropTypes.number.isRequired,
  cancel: PropTypes.func.isRequired,
  createBoolean: PropTypes.bool.isRequired,
  editBoolean: PropTypes.bool.isRequired,
  funcs: PropTypes.shape({
    create: PropTypes.func,
    edit: PropTypes.func,
    manage: PropTypes.func,
  }).isRequired,
  item: PropTypes.shape({
    lab: PropTypes.string,
    name: PropTypes.string,
    permission: PropTypes.string,
  }).isRequired,
  manageBoolean: PropTypes.bool.isRequired,
  selected: PropTypes.number,
  top: PropTypes.func.isRequired,
};

export default ManagementContent;
