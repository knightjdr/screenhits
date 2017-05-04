// import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import SelectField from 'material-ui/SelectField';
import {
  Tabs,
  Tab,
} from 'material-ui/Tabs';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import './manage-content.scss';

class ManageContent extends React.Component {
  permissionToText = (perm) => {
    const permConvert = {
      n: 'None',
      r: 'Read',
      w: 'Write',
    };
    return permConvert[perm];
  }
  render() {
    return (
      <div className="manage-content">
        <span className="manage-header">
          <FontAwesome name="info-circle" /> Manage user permissions for project { this.props.selected }: { this.props.name }.
        </span>
        <Tabs className="manage-tabs">
          <Tab label="Current users" >
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
            { this.props.usersPage.length > 0 &&
              <Table>
                <TableHeader
                  adjustForCheckbox={ false }
                  displaySelectAll={ false }
                >
                  <TableRow>
                    <TableHeaderColumn
                      style={ { textAlign: 'center' } }
                    >
                      User
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      style={ { textAlign: 'center' } }
                    >
                      Lab
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      style={ { textAlign: 'center' } }
                    >
                      Permission
                    </TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody
                  displayRowCheckbox={ false }
                >
                  { this.props.usersPage.map((user) => {
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
                        <TableRowColumn
                          key={ user.name }
                          style={ { textAlign: 'center' } }
                        >
                          <RaisedButton
                            className="manage-permission-button"
                            label={ this.permissionToText(user.permission) }
                            onTouchTap={ (event) => { this.props.openPopover(event, user.email); } }
                          />
                          <Popover
                            anchorEl={ this.props.anchorEl }
                            anchorOrigin={ { horizontal: 'left', vertical: 'top' } }
                            className="manage-permission-popover"
                            onRequestClose={ () => { this.props.closePopover(user.email); } }
                            open={ this.props.userPopover[user.email] }
                            targetOrigin={ { horizontal: 'left', vertical: 'top' } }
                          >
                            <Menu>
                              <MenuItem
                                key="r"
                                value="r"
                                onClick={ () => { this.props.menuClickPermission(user.email, 'r'); } }
                                primaryText="Read"
                              />
                              <MenuItem
                                key="w"
                                value="w"
                                onClick={ () => { this.props.menuClickPermission(user.email, 'w'); } }
                                primaryText="Write"
                              />
                              <MenuItem
                                key="n"
                                value="n"
                                onClick={ () => { this.props.menuClickPermission(user.email, 'n'); } }
                                primaryText="Remove"
                              />
                            </Menu>
                          </Popover>
                        </TableRowColumn>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableRowColumn
                      colSpan="3"
                      style={ { textAlign: 'right' } }
                    >
                      { this.props.page > 0 &&
                        <FlatButton
                          className="manage-page-button"
                          icon={ <FontAwesome name="angle-left" /> }
                          onClick={ this.props.pageDown }
                        />
                      }
                      Page { this.props.page + 1 } of { this.props.pageTotal + 1}
                      { this.props.page < this.props.pageTotal &&
                        <FlatButton
                          className="manage-page-button"
                          icon={ <FontAwesome name="angle-right" /> }
                          onClick={ this.props.pageUp }
                        />
                      }
                    </TableRowColumn>
                  </TableRow>
                </TableFooter>
              </Table>
            }
          </Tab>
          <Tab label="Manage bulk permissions" >
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
          </Tab>
        </Tabs>
      </div>
    );
  }
}

ManageContent.defaultProps = {
  anchorEl: {},
};

ManageContent.propTypes = {
  anchorEl: PropTypes.shape({
  }),
  closePopover: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    permission: PropTypes.string.isRequired,
  }).isRequired,
  name: PropTypes.string.isRequired,
  menuClickPermission: PropTypes.func.isRequired,
  openPopover: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  pageDown: PropTypes.func.isRequired,
  pageTotal: PropTypes.number.isRequired,
  pageUp: PropTypes.func.isRequired,
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
  userPopover: PropTypes.shape({
  }).isRequired,
  usersPage: PropTypes.arrayOf(
    PropTypes.shape({
    }),
  ).isRequired,
};

export default ManageContent;
