import Checkbox from 'material-ui/Checkbox';
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

import ActionButtons from '../../../action-buttons/action-buttons-container';
import CustomTable from '../../../table/table-container';
import './manage-content.scss';

class ManageContent extends React.Component {
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
    return !perm ? 'Select' : permConvert[perm];
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
            { this.props.users.list &&
              this.props.users.list.length > 0 &&
              <CustomTable
                data={ {
                  header: [
                    {
                      name: 'Name',
                      sort: true,
                      type: 'name',
                    },
                    {
                      name: 'Lab',
                      sort: true,
                      type: 'lab',
                    },
                    {
                      name: 'Permission',
                      sort: false,
                      type: 'permission',
                    },
                  ],
                  list: this.props.users.list.map((user) => {
                    return {
                      key: user.name,
                      columns: [
                        {
                          type: 'name',
                          value: user.name,
                        },
                        {
                          type: 'lab',
                          value: user.lab,
                        },
                        {
                          style: { textAlign: 'center' },
                          type: 'permission',
                          value: (
                            <span>
                              <FlatButton
                                className="manage-permission-button"
                                key="button"
                                label={ this.permissionToText(user.permission) }
                                onTouchTap={ (event) => {
                                  this.props.openPopover(
                                    event.target,
                                    'current',
                                    user.email,
                                    user.permission,
                                  );
                                } }
                              />
                              <Popover
                                anchorEl={ this.props.anchorEl.current }
                                anchorOrigin={ { horizontal: 'left', vertical: 'top' } }
                                className="manage-permission-popover"
                                key="popover"
                                onRequestClose={ () => { this.props.closePopover('current', user.email); } }
                                open={ this.props.userPopover.current[user.email] }
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
                            </span>
                          ),
                        },
                      ],
                    };
                  }),
                } }
                footer={
                  <span>
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
                  </span>
                }
                height={ this.props.tableHeight.current }
                reset={ this.props.reset }
              />
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
              { this.props.searchUser.list.length <= 0 &&
                <span>
                  <CSSTransitionGroup
                    transitionName="manage-message-text"
                    transitionEnterTimeout={ 500 }
                    transitionLeaveTimeout={ 500 }
                  >
                    <span className="manage-search-information">
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
                      { !this.props.searchUser.didGetFail &&
                        this.props.searchUser.message &&
                        <span>
                          No users found
                        </span>
                      }
                    </span>
                  </CSSTransitionGroup>
                </span>
              }
              { this.props.searchUser.list.length > 0 &&
                <CustomTable
                  data={ {
                    header: [
                      {
                        name: 'Name',
                        sort: true,
                        type: 'name',
                      },
                      {
                        name: 'Lab',
                        sort: true,
                        type: 'lab',
                      },
                      {
                        name: 'Add',
                        sort: false,
                        type: 'checkbox',
                      },
                      {
                        name: 'Permission',
                        sort: false,
                        type: 'permission',
                      },
                    ],
                    list: this.props.searchUser.list.map((user) => {
                      return {
                        key: user.name,
                        columns: [
                          {
                            type: 'name',
                            value: user.name,
                          },
                          {
                            type: 'lab',
                            value: user.lab,
                          },
                          {
                            style: {
                              alignItems: 'center',
                              display: 'flex',
                              justifyContent: 'center',
                            },
                            type: 'checkbox',
                            value: (
                              <Checkbox
                                onCheck={ (e, isChecked) => {
                                  this.props.toggleUser(user.email, user.name, isChecked);
                                } }
                                style={ {
                                  width: 24,
                                } }
                              />
                            ),
                          },
                          {
                            style: { textAlign: 'center' },
                            type: 'permission',
                            value: (
                              <span>
                                <FlatButton
                                  className="manage-permission-button"
                                  key="button"
                                  label={ this.permissionToText(
                                    this.props.searchUserPermission[user.email])
                                  }
                                  onTouchTap={ (e) => {
                                    this.props.openPopover(
                                      e.target,
                                      'search',
                                      user.email,
                                      user.permission,
                                    );
                                  } }
                                />
                                <Popover
                                  anchorEl={ this.props.anchorEl.search }
                                  anchorOrigin={ { horizontal: 'left', vertical: 'top' } }
                                  className="manage-permission-popover"
                                  key="popover"
                                  onRequestClose={ () => { this.props.closePopover('search', user.email); } }
                                  open={ this.props.userPopover.search[user.email] }
                                  targetOrigin={ { horizontal: 'left', vertical: 'top' } }
                                >
                                  <Menu>
                                    <MenuItem
                                      key="r"
                                      value="r"
                                      onClick={ () => { this.props.setSearchUserPermission(user.email, user.name, 'r'); } }
                                      primaryText="Read"
                                    />
                                    <MenuItem
                                      key="w"
                                      value="w"
                                      onClick={ () => { this.props.setSearchUserPermission(user.email, user.name, 'w'); } }
                                      primaryText="Write"
                                    />
                                    <MenuItem
                                      key="o"
                                      value="o"
                                      onClick={ () => { this.props.setSearchUserPermission(user.email, user.name, 'o'); } }
                                      primaryText="Owner"
                                    />
                                  </Menu>
                                </Popover>
                              </span>
                            ),
                          },
                        ],
                      };
                    }),
                  } }
                  footer={
                    <span
                      className="manage-search-footer-button"
                    >
                      <ActionButtons
                        idSuffix="addUsers"
                        update={ {
                          func: () => { this.props.addUsers(); },
                          label: 'Add user(s)',
                          toolTipText: 'Add selected users to project',
                        } }
                      />
                    </span>
                  }
                  height={ this.props.tableHeight.search }
                />
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

ManageContent.propTypes = {
  addUsers: PropTypes.func.isRequired,
  anchorEl: PropTypes.shape({
    current: PropTypes.shape({}),
    search: PropTypes.shape({}),
  }).isRequired,
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
  reset: PropTypes.number.isRequired,
  resetManage: PropTypes.func.isRequired,
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
  searchUserPermission: PropTypes.objectOf(
      PropTypes.string,
  ).isRequired,
  selected: PropTypes.number.isRequired,
  setSearchType: PropTypes.func.isRequired,
  setSearchUserPermission: PropTypes.func.isRequired,
  tableHeight: PropTypes.shape({
    current: PropTypes.number,
    search: PropTypes.number,
  }).isRequired,
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
  toggleUser: PropTypes.func.isRequired,
  updateManage: PropTypes.func.isRequired,
  userPopover: PropTypes.shape({
    current: PropTypes.shape({}),
    search: PropTypes.shape({}),
  }).isRequired,
  users: PropTypes.shape({
    didGetFail: PropTypes.bool,
    _id: PropTypes.bool.number,
    isGet: PropTypes.bool,
    list: PropTypes.arrayOf(
      PropTypes.shape({}),
    ),
    message: PropTypes.string,
  }).isRequired,
};

export default ManageContent;
