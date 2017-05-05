import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import ReactTooltip from 'react-tooltip';
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
  componentDidMount = () => {
    window.addEventListener('resize', this.props.calcPageLength);
    window.addEventListener('resize', this.props.tabNameFunc);
  }
  componentWillUnmount = () => {
    this.props.resetPost();
    window.removeEventListener('resize', this.props.calcPageLength);
    window.removeEventListener('resize', this.props.tabNameFunc);
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
        <span className="manage-header">
          <FontAwesome name="info-circle" /> Manage user permissions for project { this.props.selected }: { this.props.name }.
        </span>
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
                          <RaisedButton
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
                        <FlatButton
                          className="manage-footer-button-update"
                          data-tip={ true }
                          data-for="updateManage"
                          label="Update"
                          onClick={ () => { this.props.updateManage('current'); } }
                        />
                        <ReactTooltip id="updateManage" effect="solid" type="dark" place="top">
                          <span>Update permissions</span>
                        </ReactTooltip>
                        <FlatButton
                          className="manage-footer-button-reset"
                          data-tip={ true }
                          data-for="resetManage"
                          label="Reset"
                          onClick={ this.props.resetManage }
                        />
                        <ReactTooltip id="resetManage" effect="solid" type="dark" place="top">
                          <span>Reset details to most recent save</span>
                        </ReactTooltip>
                        <FlatButton
                          className="manage-footer-button-cancel"
                          data-tip={ true }
                          data-for="cancelManage"
                          label="Cancel"
                          onClick={ this.props.cancel }
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
  anchorEl: PropTypes.shape({}),
  calcPageLength: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  closePopover: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    permission: PropTypes.string.isRequired,
  }).isRequired,
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
  selected: PropTypes.number.isRequired,
  tabNameFunc: PropTypes.func.isRequired,
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
