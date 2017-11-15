import AssessmentIcon from 'material-ui/svg-icons/action/assessment';
import AssignmentIcon from 'material-ui/svg-icons/action/assignment-turned-in';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import DescriptionIcon from 'material-ui/svg-icons/action/description';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import CustomTable from '../../../table/table-container';
import Tooltip from '../../../tooltip/tooltip-container';

const iconStyle = {
  height: 24,
  margin: '0px 2px 0px 2px',
  padding: 0,
  width: 24,
};

class TaskList extends React.Component {
  confirmDeletion = (_id) => {
    return (
    [
      <FlatButton
        backgroundColor={ this.props.muiTheme.palette.success }
        hoverColor={ this.props.muiTheme.palette.successHover }
        label="Confirm"
        onTouchTap={ () => { this.props.deleteTask(_id); } }
      />,
    ]);
  }
  dialogClose = (closeFunc) => {
    return (
    [
      <FlatButton
        backgroundColor={ this.props.muiTheme.palette.warning }
        hoverColor={ this.props.muiTheme.palette.warningHover }
        label="Close"
        onTouchTap={ closeFunc }
        style={ {
          marginLeft: 10,
        } }
      />,
    ]);
  }
  list = () => {
    const tableList = this.props.tasks.map((task, index) => {
      const columns = this.props.header.map((header) => {
        return {
          type: header.type,
          value: task[header.type],
        };
      });
      // add options fields: Log, Task parameters, Delete, Set official
      columns[columns.length - 1].value = this.options(task);
      columns[columns.length - 1].style = {
        textAlign: 'left',
      };
      return {
        key: `taskList-${index}`,
        columns,
      };
    });
    return tableList;
  }
  options = (task) => {
    const cancelText = task.isRunning || task.isQueued ?
      'Cancel task'
      :
      'Delete task'
    ;
    const officialText = task.isOfficial ?
      'Unassign as official'
      :
      'Assign as official'
    ;
    return (
      <span>
        <IconButton
          onClick={ () => { this.props.designDialog.showFunc(task); } }
          onMouseEnter={ (e) => {
            this.props.iconTooltip.showFunc(e, 'Task parameters');
          } }
          onMouseLeave={ this.props.iconTooltip.hideFunc }
          style={ iconStyle }
        >
          <DescriptionIcon />
        </IconButton>
        {
          !task.isQueued &&
          !task.isRunning &&
          <IconButton
            onClick={ () => { this.props.logDialog.showFunc(task.log, `Log, task ID: ${task._id}`); } }
            onMouseEnter={ (e) => {
              this.props.iconTooltip.showFunc(e, 'View log');
            } }
            onMouseLeave={ this.props.iconTooltip.hideFunc }
            style={ iconStyle }
          >
            <AssessmentIcon />
          </IconButton>
        }
        {
          task.isComplete &&
          <IconButton
            iconStyle={ {
              color: task.isOfficial ?
                this.props.muiTheme.palette.success
                :
                this.props.muiTheme.palette.primary1Color
              ,
            } }
            onMouseEnter={ (e) => {
              this.props.iconTooltip.showFunc(e, officialText);
            } }
            onMouseLeave={ this.props.iconTooltip.hideFunc }
            style={ iconStyle }
          >
            <AssignmentIcon />
          </IconButton>
        }
        <IconButton
          onClick={ () => { this.props.deleteDialog.showFunc(task._id); } }
          onMouseEnter={ (e) => {
            this.props.iconTooltip.showFunc(e, cancelText);
          } }
          onMouseLeave={ this.props.iconTooltip.hideFunc }
          iconStyle={ {
            color: this.props.muiTheme.palette.warning,
          } }
          style={ iconStyle }
        >
          <ClearIcon />
        </IconButton>
      </span>
    );
  }
  render() {
    return (
      <div>
        <CustomTable
          data={ {
            header: this.props.header,
            list: this.list(),
          } }
          footer={ false }
          height={ this.props.tableHeight }
        />
        <Dialog
          actions={ [
            this.dialogClose(this.props.designDialog.hideFunc),
          ] }
          autoScrollBodyContent={ true }
          open={ this.props.designDialog.show }
          onRequestClose={ this.props.designDialog.hideFunc }
          title={ this.props.designDialog.title }
          titleStyle={ {
            borderBottom: 'none',
          } }
        >
          <Scrollbars
            autoHide={ true }
            autoHideTimeout={ 1000 }
            autoHideDuration={ 200 }
            autoHeight={ true }
            autoHeightMax={ 'calc(100vh - 100px)' }
          >
            { this.props.designDialog.body._id }
          </Scrollbars>
        </Dialog>
        <Dialog
          actions={ [
            this.dialogClose(this.props.logDialog.hideFunc),
          ] }
          autoScrollBodyContent={ true }
          contentStyle={ {
            whiteSpace: 'pre-line',
          } }
          open={ this.props.logDialog.show }
          onRequestClose={ this.props.logDialog.hideFunc }
          title={ this.props.logDialog.title }
          titleStyle={ {
            borderBottom: 'none',
          } }
        >
          <Scrollbars
            autoHide={ true }
            autoHideTimeout={ 1000 }
            autoHideDuration={ 200 }
            autoHeight={ true }
            autoHeightMax={ 'calc(100vh - 100px)' }
          >
            { this.props.logDialog.text }
          </Scrollbars>
        </Dialog>
        <Dialog
          actions={ [
            this.confirmDeletion(this.props.deleteDialog._id),
            this.dialogClose(this.props.deleteDialog.hideFunc),
          ] }
          onRequestClose={ this.props.deleteDialog.hideFunc }
          open={ this.props.deleteDialog.show }
          title="Confirmation"
        >
          This action will permanently the analysis and any stored results.
        </Dialog>
        <Tooltip
          position={ this.props.iconTooltip.position }
          rect={ this.props.iconTooltip.rect }
          show={ this.props.iconTooltip.show }
          text={ this.props.iconTooltip.text }
        />
      </div>
    );
  }
}

TaskList.propTypes = {
  deleteDialog: PropTypes.shape({
    _id: PropTypes.number,
    hideFunc: PropTypes.func,
    show: PropTypes.bool,
    showFunc: PropTypes.func,
  }).isRequired,
  designDialog: PropTypes.shape({
    body: PropTypes.shape({
      _id: PropTypes.number,
    }),
    hideFunc: PropTypes.func,
    show: PropTypes.bool,
    showFunc: PropTypes.func,
    title: PropTypes.string,
  }).isRequired,
  deleteTask: PropTypes.func.isRequired,
  header: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      sortable: PropTypes.bool,
      type: PropTypes.string,
    }),
  ).isRequired,
  iconTooltip: PropTypes.shape({
    hideFunc: PropTypes.func,
    position: PropTypes.string,
    rect: PropTypes.shape({
      bottom: PropTypes.number,
      height: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number,
      top: PropTypes.number,
      width: PropTypes.number,
      x: PropTypes.number,
      y: PropTypes.number,
    }),
    show: PropTypes.bool,
    showFunc: PropTypes.func,
    text: PropTypes.string,
  }).isRequired,
  logDialog: PropTypes.shape({
    hideFunc: PropTypes.func,
    show: PropTypes.bool,
    showFunc: PropTypes.func,
    text: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      primary1Color: PropTypes.string,
      success: PropTypes.string,
      successHover: PropTypes.string,
      warning: PropTypes.string,
      warningHover: PropTypes.string,
    }),
  }).isRequired,
  tableHeight: PropTypes.number.isRequired,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      isComplete: PropTypes.bool,
    }),
  ).isRequired,
};

export default muiThemeable()(TaskList);
