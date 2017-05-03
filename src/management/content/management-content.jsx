import PropTypes from 'prop-types';
import React from 'react';

import CreateContent from './create/create-content-container';
import DisplayContent from './display/display-content-container';
import ManageContent from './manage/manage-content-container';
import ManagementMenu from './menu/management-menu';

import './management-content.scss';

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
      content = (<div className="content-intro">
        Create a new { this.props.active } to begin
      </div>);
    } else {
      content = (<div className="content-intro">
        Select an existing { this.props.active } or create a new { this.props.active } to begin
      </div>);
    }
    return (
      <div className="content-wrapper">
        <div className="content-menu">
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
};

export default ManagementContent;
