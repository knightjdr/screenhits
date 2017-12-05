import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Paper from 'material-ui/Paper';
import Popover from 'material-ui/Popover';
import PropTypes from 'prop-types';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import React from 'react';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import {
  Tabs,
  Tab,
} from 'material-ui/Tabs';

import ActionButtons from '../../../../action-buttons/action-buttons-container';
import CustomTable from '../../../../table/table-container';
import Notice from '../../../../messages/notice/notice';

const noticeFullWidth = {
  marginTop: 10,
};

class ManageContent extends React.Component {
  onEnter = (e) => {
    if (e.key === 'Enter') {
      this.props.search(e.target.value);
    }
  }
  setSearchType = (e, v) => {
    this.props.setSearchType(v);
  }
  bulkChange = (e, index, value) => {
    this.props.bulkChange(value);
  }
  inputChange = (e) => {
    this.props.inputChange(e.target.value);
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
  updateManangeCurrent = () => {
    this.props.updateManage('current');
  }
  render() {
    return (
      <div
        style={ {
          fontFamily: 'Roboto',
          padding: '10px 5px 10px 5px',
        } }
      >
        <div
          style={ {
            height: 35,
            position: 'relative',
          } }
        >
          <div
            style={ {
              display: 'inline-block',
              width: 'calc(100% - 120px)',
            } }
          >
            <FontAwesome name="info-circle" />
            Manage user permissions for project { this.props.selected }: { this.props.name }.
          </div>
          <div
            style={ {
              display: 'inline-block',
              position: 'absolute',
              right: 5,
            } }
          >
            <ActionButtons
              reset={ {
                func: this.props.cancelMenuAction,
                label: 'Close',
                toolTipText: 'Close management pane',
              } }
              idSuffix="management-header"
            />
          </div>
        </div>
        <Tabs
          style={ {
            marginTop: 20,
          } }
        >
          <Tab
            label={ this.props.tabNames.current }
            style={ {
              color: this.props.muiTheme.palette.alternateTextColor,
            } }
          >
            { this.props.users.isGet &&
              this.props.users._id === this.props.selected &&
              <div
                key="manage-get"
                style={ {
                  backgroundColor: '#fff',
                  marginTop: 20,
                } }
              >
                <FontAwesome key="fetching" name="spinner" pulse={ true } /> Retrieving user information.
              </div>
            }
            { this.props.users.didGetFail &&
              this.props.users._id === this.props.selected &&
              <div
                key="manage-fail"
                style={ {
                  backgroundColor: '#fff',
                  marginTop: 20,
                } }
              >
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
                                backgroundColor={ this.props.muiTheme.palette.buttonColor }
                                hoverColor={ this.props.muiTheme.palette.buttonColorHover }
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
                                secondary={ true }
                              />
                              <Popover
                                anchorEl={ this.props.anchorEl.current }
                                anchorOrigin={ { horizontal: 'left', vertical: 'top' } }
                                key="popover"
                                onRequestClose={ () => { this.props.closePopover('current', user.email); } }
                                open={ this.props.userPopover.current[user.email] }
                                targetOrigin={ { horizontal: 'left', vertical: 'top' } }
                              >
                                <Menu
                                  listStyle={ {
                                    paddingBottom: 0,
                                    paddingTop: 0,
                                  } }
                                >
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
                  <span
                    style={ {
                      marginRight: 20,
                    } }
                  >
                    { this.props.manageState._id === this.props.selected &&
                      <Notice
                        fail={ this.props.manageState.didPostFail }
                        failMessage={ `Update failed. ${this.props.manageState.message}` }
                        label="manage-user-notification"
                        overRideStyle={ true }
                        style={ {
                          display: 'inline-block',
                          marginRight: 10,
                          top: -12,
                          width: 250,
                        } }
                        submit={ this.props.manageState.isPost }
                        submitMessage="Updates submitted"
                        succeed={ this.props.manageState.message &&
                          !this.props.manageState.didPostFail
                        }
                        succeedMessage={ this.props.manageState.message }
                        textAlign="right"
                      />
                    }
                    <span
                      style={ {
                        marginRight: 20,
                      } }
                    >
                      <ActionButtons
                        cancel={ {
                          func: this.props.cancelMenuAction,
                        } }
                        idSuffix="manageUsers"
                        reset={ {
                          func: this.props.resetManage,
                          toolTipText: 'Reset details to most recent save',
                        } }
                        update={ {
                          func: this.updateManangeCurrent,
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
          <Tab
            label={ this.props.tabNames.manage }
            style={ {
              color: this.props.muiTheme.palette.alternateTextColor,
            } }
          >
            <Paper
              style={ {
                margin: '5px 0px 5px 0px',
                padding: '15px 10px 5px 10px',
              } }
              zDepth={ 2 }
            >
              <div>
                <u>Search for and add individual users</u>
              </div>
              <div
                style={ {
                  display: 'flex',
                  justifyContent: 'flex-start',
                } }
              >
                <TextField
                  floatingLabelText={ this.props.inputLabel }
                  fullWidth={ true }
                  onBlur={ this.inputChange }
                  onKeyPress={ this.onEnter }
                  style={ { maxWidth: 500 } }
                />
                <RadioButtonGroup
                  name="searchType"
                  defaultSelected="name"
                  onChange={ this.setSearchType }
                  style={ {
                    marginLeft: 15,
                    marginTop: 40,
                  } }
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
                <FlatButton
                  backgroundColor={ this.props.muiTheme.palette.buttonColor }
                  hoverColor={ this.props.muiTheme.palette.buttonColorHover }
                  label={ this.props.searchLabel }
                  style={ Object.assign(
                    {},
                    this.props.searchStyle,
                    {
                      height: 36,
                      marginTop: 32,
                    },
                  ) }
                  onClick={ () => { this.props.search(); } }
                  secondary={ true }
                />
              </div>
              { this.props.searchUser.list.length <= 0 &&
                <div
                  style={ noticeFullWidth }
                >
                  <Notice
                    fail={ this.props.searchUser.didGetFail }
                    failMessage={ `Update failed. ${this.props.searchUser.message}` }
                    label="manage-user-search-notification"
                    submit={ this.props.searchUser.isGet }
                    submitMessage="Searching..."
                    succeed={ this.props.searchUser.message &&
                      !this.props.searchUser.didGetFail
                    }
                    succeedMessage="No users found"
                  />
                </div>
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
                                  this.props.toggleUser(user.email, user.lab, user.name, isChecked);
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
                                  backgroundColor={ this.props.muiTheme.palette.buttonColor }
                                  hoverColor={ this.props.muiTheme.palette.buttonColorHover }
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
                                  secondary={ true }
                                />
                                <Popover
                                  anchorEl={ this.props.anchorEl.search }
                                  anchorOrigin={ { horizontal: 'left', vertical: 'top' } }
                                  key="popover"
                                  onRequestClose={ () => { this.props.closePopover('search', user.email); } }
                                  open={ this.props.userPopover.search[user.email] }
                                  targetOrigin={ { horizontal: 'left', vertical: 'top' } }
                                >
                                  <Menu>
                                    <MenuItem
                                      key="r"
                                      value="r"
                                      onClick={ () => { this.props.setSearchUserPermission(user.email, user.lab, user.name, 'r'); } }
                                      primaryText="Read"
                                    />
                                    <MenuItem
                                      key="w"
                                      value="w"
                                      onClick={ () => { this.props.setSearchUserPermission(user.email, user.lab, user.name, 'w'); } }
                                      primaryText="Write"
                                    />
                                    <MenuItem
                                      key="o"
                                      value="o"
                                      onClick={ () => { this.props.setSearchUserPermission(user.email, user.lab, user.name, 'o'); } }
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
                      style={ {
                        marginRight: 20,
                      } }
                    >
                      { this.props.addUsersState._id === this.props.selected &&
                        <Notice
                          fail={ this.props.addUsersState.didPutFail }
                          failMessage={ `Update failed. ${this.props.addUsersState.message}` }
                          label="manage-user-update-notification"
                          submit={ this.props.addUsersState.isPut }
                          submitMessage="Updates submitted"
                          succeed={ this.props.addUsersState.message &&
                            !this.props.addUsersState.didPutFail
                          }
                          succeedMessage={ this.props.addUsersState.message }
                        />
                      }
                      { this.props.addUsers.length > 0 &&
                        <span
                          style={ {
                            marginRight: 20,
                          } }
                        >
                          <ActionButtons
                            idSuffix="addUsers"
                            update={ {
                              func: this.props.addUsersFunc,
                              label: 'Add user(s)',
                              toolTipText: 'Add selected users to project',
                            } }
                          />
                        </span>
                      }
                    </span>
                  }
                  height={ this.props.tableHeight.search }
                />
              }
            </Paper>
            <Paper
              style={ {
                margin: '5px 0px 5px 0px',
                padding: '15px 10px 5px 10px',
              } }
              zDepth={ 2 }
            >
              <div>
                <u>Change permissions in bulk</u>
              </div>
              <SelectField
                floatingLabelText="User permissions"
                fullWidth={ true }
                value={ this.props.selectPermission }
                onChange={ this.bulkChange }
              >
                <MenuItem key="lr" value="lr" primaryText="Read - lab (all lab members can view this project)" />
                <MenuItem key="lw" value="lw" primaryText="Write - lab (all lab members can edit this project)" />
                <MenuItem key="ar" value="ar" primaryText="Read - all (all ScreenHits users can view this project)" />
                <MenuItem key="aw" value="aw" primaryText="Write - all (all ScreenHits users can edit this project)" />
                <MenuItem key="n" value="n" primaryText="None (only you can view this project)" />
              </SelectField>
              <div>
                <ActionButtons
                  idSuffix="updateBulkUsers"
                  update={ {
                    func: this.props.updateBulkPermissions,
                    label: 'Update',
                  } }
                />
                { this.props.bulkPermissionState._id === this.props.selected &&
                  <Notice
                    fail={ this.props.bulkPermissionState.didPutFail }
                    failMessage={ `Update failed. ${this.props.bulkPermissionState.message}` }
                    label="manage-bulk-update-notification"
                    overRideStyle={ true }
                    style={ {
                      display: 'inline-block',
                      marginLeft: 10,
                      top: -12,
                      width: 250,
                    } }
                    submit={ this.props.bulkPermissionState.isPut }
                    submitMessage="Update submitted"
                    succeed={ this.props.bulkPermissionState.message &&
                      !this.props.bulkPermissionState.didPutFail
                    }
                    succeedMessage={ this.props.bulkPermissionState.message }
                    textAlign="left"
                  />
                }
              </div>
            </Paper>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

ManageContent.propTypes = {
  addUsers: PropTypes.arrayOf(
    PropTypes.shape({
      email: PropTypes.string,
      name: PropTypes.string,
      permission: PropTypes.string,
    }),
  ).isRequired,
  addUsersFunc: PropTypes.func.isRequired,
  addUsersState: PropTypes.shape({
    didPutFail: PropTypes.bool,
    _id: PropTypes.number,
    isPut: PropTypes.bool,
    message: PropTypes.string,
  }).isRequired,
  anchorEl: PropTypes.shape({
    current: PropTypes.shape({}),
    search: PropTypes.shape({}),
  }).isRequired,
  bulkChange: PropTypes.func.isRequired,
  bulkPermissionState: PropTypes.shape({
    didPutFail: PropTypes.bool,
    _id: PropTypes.number,
    isPut: PropTypes.bool,
    message: PropTypes.string,
  }).isRequired,
  cancelMenuAction: PropTypes.func.isRequired,
  closePopover: PropTypes.func.isRequired,
  inputChange: PropTypes.func.isRequired,
  inputLabel: PropTypes.string.isRequired,
  manageState: PropTypes.shape({
    didPostFail: PropTypes.bool,
    message: PropTypes.string,
    _id: PropTypes.number,
    isPost: PropTypes.bool,
  }).isRequired,
  menuClickPermission: PropTypes.func.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      alternateTextColor: PropTypes.string,
      buttonColor: PropTypes.string,
      buttonColorHover: PropTypes.string,
    }),
  }).isRequired,
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
  selectPermission: PropTypes.string.isRequired,
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
  updateBulkPermissions: PropTypes.func.isRequired,
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

export default muiThemeable()(ManageContent);
