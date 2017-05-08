import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import Popover from 'material-ui/Popover';
import PropTypes from 'prop-types';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
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

import ActionButtons from '../../../action-buttons/action-buttons-container';
import './manage-content.scss';

class ManageContent extends React.Component {
  componentDidMount = () => {
    window.addEventListener('resize', this.props.resize);
  }
  componentWillUnmount = () => {
    this.props.resetPost();
    window.removeEventListener('resize', this.props.resize);
  }
  onEnter = (e) => {
    if (e.key === 'Enter') {
      this.props.search();
    }
  }
  permissionToText = (perm) => {
    const permConvert = {
      n: 'None',
      o: 'Owner',
      r: 'Read',
      w: 'Write',
    };
    return permConvert[perm];
  }
  render() {
    return (
      <div className="manage-content">
        <div className="manage-header">
          <FontAwesome name="info-circle" /> Manage user permissions for project { this.props.selected }: { this.props.name }.
        </div>
        <Tabs className="manage-tabs">
          <Tab label={ this.props.tabNames.current } >
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
                          <FlatButton
                            className="manage-permission-button"
                            label={ this.permissionToText(user.permission) }
                            onTouchTap={ (event) => {
                              this.props.openPopover(event, user.email, user.permission);
                            } }
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
                      <span className="manage-footer-updates">
                        <CSSTransitionGroup
                          transitionName="manage-message-text"
                          transitionEnterTimeout={ 500 }
                          transitionLeaveTimeout={ 500 }
                        >
                          <span className="manage-post-information">
                            { this.props.manageState._id === this.props.selected &&
                              this.props.manageState.isPost &&
                              <span>
                                <FontAwesome name="spinner" pulse={ true } /> Updates submitted
                              </span>
                            }
                            { this.props.manageState._id === this.props.selected &&
                              this.props.manageState.didPostFail &&
                              <span>
                                <FontAwesome name="exclamation-triangle" /> Update failed.{'\u00A0'}
                                { this.props.manageState.message }
                              </span>
                            }
                            { this.props.manageState._id === this.props.selected &&
                              this.props.manageState.message &&
                              !this.props.manageState.didPostFail &&
                              <span>
                                { this.props.manageState.message }
                              </span>
                            }
                          </span>
                        </CSSTransitionGroup>
                      </span>
                      <span className="manage-footer-buttons">
                        <ActionButtons
                          cancel={ {
                            func: this.props.cancel,
                          } }
                          idSuffix="manageUsers"
                          reset={ {
                            func: this.props.resetManage,
                            toolTipText: 'Reset details to most recent save',
                          } }
                          update={ {
                            func: () => { this.props.updateManage('current'); },
                            toolTipText: 'Update permissions',
                          } }
                        />
                      </span>
                      { this.props.page > 0 &&
                        <FlatButton
                          className="manage-page-button"
                          icon={ <FontAwesome name="angle-left" /> }
                          onClick={ this.props.pageDown }
                        />
                      }
                      Page { this.props.page + 1 }/{ this.props.pageTotal + 1}
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
          <Tab label={ this.props.tabNames.manage } >
            <Paper
              className="manage-subsection"
              zDepth={ 2 }
            >
              <div className="manage-sub-header">
                <u>Search for and add individual users</u>
              </div>
              <div className="manage-search-container">
                <TextField
                  floatingLabelText={ this.props.inputLabel }
                  onChange={ (e) => { this.props.inputChange('input', e.target.value); } }
                  onKeyPress={ this.onEnter }
                  style={ { width: '50%' } }
                  value={ this.props.formData.input }
                />
                <RadioButtonGroup
                  className="manage-radio-button-group"
                  name="searchType"
                  defaultSelected="name"
                  onChange={ (e, v) => { this.props.setSearchType(v); } }
                >
                  <RadioButton
                    value="name"
                    label="Name"
                    style={ { display: 'inline-block', width: '100px' } }
                  />
                  <RadioButton
                    value="lab"
                    label="Lab"
                    style={ { display: 'inline-block', width: '100px' } }
                  />
                </RadioButtonGroup>
                <RaisedButton
                  className="manage-search-button"
                  label={ this.props.searchLabel }
                  style={ this.props.searchStyle }
                  onClick={ this.props.search }
                />
              </div>
              { this.props.searchUser._id === this.props.selected &&
                <div className="manage-post-information">
                  { this.props.searchUser.isGet &&
                    <span>
                      <FontAwesome name="spinner" pulse={ true } /> Searching...
                    </span>
                  }
                  { this.props.searchUser.didGetFail &&
                    <span>
                      <FontAwesome name="exclamation-triangle" /> Update failed.{'\u00A0'}
                      { this.props.searchUser.message }
                    </span>
                  }
                  { this.props.searchUser.list.length < 0 ?
                    <div>
                      there are no results
                    </div>
                    :
                    <div>
                      { this.props.searchUser.list.length } results
                      <ActionButtons
                        idSuffix="addUsers"
                        update={ {
                          func: () => { },
                          label: 'Add user(s)',
                          toolTipText: 'Add selected users to project',
                        } }
                      />
                    </div>
                  }
                </div>
              }
            </Paper>
            <Paper
              className="manage-subsection"
              zDepth={ 2 }
            >
              <div className="manage-sub-header">
                <u>Change permissions in bulk</u>
              </div>
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
            </Paper>
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
  anchorEl: PropTypes.shape({}),
  cancel: PropTypes.func.isRequired,
  closePopover: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    input: PropTypes.string,
    permission: PropTypes.string.isRequired,
  }).isRequired,
  inputChange: PropTypes.func.isRequired,
  inputLabel: PropTypes.string.isRequired,
  manageState: PropTypes.shape({
    didPostFail: PropTypes.bool,
    message: PropTypes.string,
    _id: PropTypes.number,
    isPost: PropTypes.bool,
  }).isRequired,
  menuClickPermission: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  openPopover: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  pageDown: PropTypes.func.isRequired,
  pageTotal: PropTypes.number.isRequired,
  pageUp: PropTypes.func.isRequired,
  resetManage: PropTypes.func.isRequired,
  resetPost: PropTypes.func.isRequired,
  resize: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  searchLabel: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.string,
  ]).isRequired,
  searchStyle: PropTypes.shape({
    maxWidth: PropTypes.number,
    minWidth: PropTypes.number,
    width: PropTypes.number,
  }).isRequired,
  searchUser: PropTypes.shape({
    didGetFail: PropTypes.bool,
    message: PropTypes.string,
    _id: PropTypes.bool.number,
    isGet: PropTypes.bool,
    list: PropTypes.arrayOf(
      PropTypes.shape({
      }),
    ),
  }).isRequired,
  selected: PropTypes.number.isRequired,
  setSearchType: PropTypes.func.isRequired,
  tabNames: PropTypes.shape({
    current: PropTypes.oneOfType([
      PropTypes.shape({}),
      PropTypes.string,
    ]),
    manage: PropTypes.oneOfType([
      PropTypes.shape({}),
      PropTypes.string,
    ]),
  }).isRequired,
  updateManage: PropTypes.func.isRequired,
  users: PropTypes.shape({
    didGetFail: PropTypes.bool,
    message: PropTypes.string,
    _id: PropTypes.bool.number,
    isGet: PropTypes.bool,
    list: PropTypes.arrayOf(
      PropTypes.shape({}),
    ),
  }).isRequired,
  userPopover: PropTypes.shape({
  }).isRequired,
  usersPage: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
};

export default ManageContent;
