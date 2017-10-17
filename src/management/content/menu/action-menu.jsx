import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import PropTypes from 'prop-types';
import React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';

import Queue from '../actions/queue-container';

const tabContent = {
  marginTop: 20,
};

/* const tabTableContent = {
  marginTop: 20,
};*/

class ActionMenu extends React.Component {
  dialogClose = () => {
    return (
    [
      <FlatButton
        backgroundColor={ this.props.muiTheme.palette.warning }
        hoverColor={ this.props.muiTheme.palette.warningHover }
        label="Close"
        onTouchTap={ this.props.dialog.close }
        style={ {
          marginLeft: 10,
        } }
      />,
    ]);
  }
  render() {
    return (
      <span>
        <FloatingActionButton
          mini={ true }
          onClick={ this.props.showActionList }
          iconStyle={ {
            color: this.props.muiTheme.palette.alternateTextColor,
          } }
          style={ {
            zIndex: 5,
          } }
        >
          <FontAwesome name="info" />
        </FloatingActionButton>
        <Popover
          anchorEl={ this.props.anchorEl }
          anchorOrigin={ { horizontal: 'middle', vertical: 'center' } }
          animation={ PopoverAnimationVertical }
          onRequestClose={ this.props.hideActionList }
          open={ this.props.showList }
          targetOrigin={ { horizontal: 'left', vertical: 'bottom' } }
        >
          <Menu
            listStyle={ {
              paddingBottom: 0,
              paddingTop: 0,
            } }
          >
            <MenuItem
              key="queue"
              onClick={ this.props.queueMenuAction }
              primaryText={ [<FontAwesome key="queue" name="list-ol" />, ' View queue'] }
            />
          </Menu>
        </Popover>
        <Dialog
          actions={ [
            this.dialogClose(),
          ] }
          autoScrollBodyContent={ true }
          contentStyle={ {
            left: '50%',
            position: 'absolute',
            top: '5%',
            transform: 'translate(-50%, 0%)',
          } }
          modal={ false }
          onRequestClose={ this.props.dialog.close }
          open={ this.props.dialog.queue }
          repositionOnUpdate={ false }
          title="Queue"
        >
          <div>
            {
              this.props.queue.retrieving &&
              <div>
                <FontAwesome key="fetching" name="spinner" pulse={ true } /> Getting
                queue...
              </div>
            }
            {
              !this.props.queue.retrieving &&
              this.props.queue.details ?
                <div>
                  {
                    this.props.queue.error ?
                    this.props.queue.error
                    :
                    <Tabs>
                      <Tab
                        label="Queued"
                        style={ {
                          color: this.props.muiTheme.palette.alternateTextColor,
                        } }
                      >
                        <div
                          style={ Object.assign(
                            {},
                            tabContent,
                            {
                              color: this.props.muiTheme.palette.textColor,
                            }
                          ) }
                        >
                          {
                            this.props.queue.details.queue.length > 0 ?
                              <div>
                                <p>Samples that are queued.</p>
                                <Queue
                                  header={ [
                                    {
                                      name: 'Position',
                                      sort: true,
                                      type: 'position',
                                    },
                                    {
                                      name: 'User',
                                      sort: true,
                                      type: 'userName',
                                    },
                                    {
                                      name: 'Sample',
                                      sort: true,
                                      type: 'sampleName',
                                    },
                                  ] }
                                  keyName="position"
                                  queue={ this.props.queue.details.queue }
                                />
                              </div>
                              :
                              <div>No samples are currently queued.</div>
                          }
                        </div>
                      </Tab>
                      <Tab
                        label="Finished"
                        style={ {
                          color: this.props.muiTheme.palette.alternateTextColor,
                        } }
                      >
                        <div
                          style={ Object.assign(
                            {},
                            tabContent,
                            {
                              color: this.props.muiTheme.palette.textColor,
                            }
                          ) }
                        >
                          {
                            this.props.queue.details.finished.length > 0 ?
                              <div>
                                <p>Samples that have been processed.</p>
                                <Queue
                                  header={ [
                                    {
                                      name: 'Date',
                                      sort: true,
                                      type: 'date',
                                    },
                                    {
                                      name: 'User',
                                      sort: true,
                                      type: 'userName',
                                    },
                                    {
                                      name: 'Sample',
                                      sort: true,
                                      type: 'sampleName',
                                    },
                                  ] }
                                  keyName="date"
                                  queue={ this.props.queue.details.finished }
                                />
                              </div>
                              :
                              <div>No samples have recently finished.</div>
                          }
                        </div>
                      </Tab>
                      <Tab
                        label="Errors"
                        style={ {
                          color: this.props.muiTheme.palette.alternateTextColor,
                        } }
                      >
                        <div
                          style={ Object.assign(
                            {},
                            tabContent,
                            {
                              color: this.props.muiTheme.palette.textColor,
                            }
                          ) }
                        >
                          {
                            this.props.queue.details.errors.length > 0 ?
                              <div>
                                <p>Samples produced errors and could not be processed.</p>
                                <Queue
                                  header={ [
                                    {
                                      name: 'Date',
                                      sort: true,
                                      type: 'date',
                                    },
                                    {
                                      name: 'User',
                                      sort: true,
                                      type: 'userName',
                                    },
                                    {
                                      name: 'Sample',
                                      sort: true,
                                      type: 'sampleName',
                                    },
                                    {
                                      name: 'Error',
                                      sort: false,
                                      type: 'error',
                                    },
                                  ] }
                                  keyName="date"
                                  queue={ this.props.queue.details.queue }
                                />
                              </div>
                              :
                              <div>There are no samples with errors.</div>
                          }
                        </div>
                      </Tab>
                    </Tabs>
                  }
                </div>
                :
                <div>
                  The queue is currently empty.
                </div>
            }
          </div>
        </Dialog>
      </span>
    );
  }
}

ActionMenu.defaultProps = {
  anchorEl: PropTypes.shape({}),
};

ActionMenu.propTypes = {
  anchorEl: PropTypes.shape({}),
  dialog: PropTypes.shape({
    queue: PropTypes.bool,
    close: PropTypes.func,
  }).isRequired,
  hideActionList: PropTypes.func.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      alternateTextColor: PropTypes.string,
      textColor: PropTypes.string,
      warning: PropTypes.string,
      warningHover: PropTypes.string,
    }),
  }).isRequired,
  queue: PropTypes.shape({
    details: PropTypes.shape({
      errors: PropTypes.arrayOf(PropTypes.shape({})),
      finished: PropTypes.arrayOf(PropTypes.shape({})),
      queue: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    error: PropTypes.string,
    retrieving: PropTypes.bool,
  }).isRequired,
  queueMenuAction: PropTypes.func.isRequired,
  showList: PropTypes.bool.isRequired,
  showActionList: PropTypes.func.isRequired,
};

export default muiThemeable()(ActionMenu);
