// import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import FontAwesome from 'react-fontawesome';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';
import React from 'react';
import SelectField from 'material-ui/SelectField';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import './manage-content.scss';

class ManageContent extends React.Component {
  render() {
    return (
      <div className="manage-content">
        <span className="manage-header">
          <FontAwesome name="info-circle" /> Manage user permissions for project { this.props.selected }: { this.props.name }.
        </span>
        <SelectField
          floatingLabelText="User permissions"
          fullWidth={ true }
          value={ this.props.formData.permission }
          onChange={ (e, index, value) => { console.log(index, value); } }
        >
          <MenuItem key="lr" value="lr" primaryText="Read - lab (all lab members can view this project)" />
          <MenuItem key="lw" value="lw" primaryText="Write - lab (all lab members can edit this project)" />
          <MenuItem key="ar" value="ar" primaryText="Read - all (all ScreenHits users can view this project)" />
          <MenuItem key="aw" value="aw" primaryText="Write - all (all ScreenHits users can edit this project)" />
          <MenuItem key="n" value="n" primaryText="None (only you can view this project)" />
        </SelectField>
        <div className="manage-user-get">
          { this.props.users.isGet &&
            this.props.users._id === this.props.selected &&
            <div className="manage-information" key="manage-get">
              <FontAwesome key="fetching" name="spinner" pulse={ true } /> Retrieving user information.
            </div>
          }
          { this.props.users.didGetFail &&
            this.props.users._id === this.props.selected &&
            <div className="manage-information" key="manage-fail">
              <FontAwesome name="exclamation-triangle" /> User information could not be retrieved.
              { this.props.users.message }.
            </div>
          }
          { this.props.users.list.length > 0 &&
            <Table>
              <TableHeader
                adjustForCheckbox={ false }
                displaySelectAll={ false }
              >
                <TableRow>
                  <TableHeaderColumn>User</TableHeaderColumn>
                  <TableHeaderColumn>Lab</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody
                displayRowCheckbox={ false }
              >
                { this.props.users.list.map((user) => {
                  return (
                    <TableRow
                      key={ user.name }
                    >
                      <TableRowColumn
                        key={ user.name }
                      >
                        { user.name }
                      </TableRowColumn>
                      <TableRowColumn
                        key={ user.name }
                      >
                        { user.lab }
                      </TableRowColumn>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          }
        </div>
        <div>
          Add new user
        </div>
      </div>
    );
  }
}

ManageContent.propTypes = {
  formData: PropTypes.shape({
    permission: PropTypes.string.isRequired,
  }).isRequired,
  name: PropTypes.string.isRequired,
  selected: PropTypes.number.isRequired,
  users: PropTypes.shape({
    didGetFail: PropTypes.bool,
    message: PropTypes.string,
    _id: PropTypes.bool.number,
    isGet: PropTypes.bool,
    list: PropTypes.arrayOf(
      PropTypes.shape({

      }),
    ),
  }).isRequired,
};

export default ManageContent;
