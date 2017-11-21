import AssessmentIcon from 'material-ui/svg-icons/action/assessment';
import AssignmentIcon from 'material-ui/svg-icons/action/assignment-turned-in';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import DescriptionIcon from 'material-ui/svg-icons/action/description';
import Dialog from 'material-ui/Dialog';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';
import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import IconButton from 'material-ui/IconButton';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';
import ViewIcon from 'material-ui/svg-icons/action/visibility';
import { Scrollbars } from 'react-custom-scrollbars';

import CustomTable from '../../../table/table-container';
import Tooltip from '../../../tooltip/tooltip-container';

const designDialogContainerStyle = {
  alignItems: 'center',
  display: 'flex',
  margin: '5px 0px 5px 0px',
};
const designDialogNameStyle = {
  display: 'inline-block',
  textAlign: 'right',
  width: 200,
};
const designDialogValueStyle = {
  display: 'inline-block',
  marginLeft: 10,
};
const iconStyle = {
  height: 24,
  margin: '0px 2px 0px 2px',
  padding: 0,
  width: 24,
};
const taskStatusStyle = {
  marginTop: 20,
  textAlign: 'center',
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
  designDialogContent = (design, params) => {
    let rowIndex = 1;
    return (
      <div
        style={ {
          color: this.props.muiTheme.palette.textColor,
        } }
      >
        <div
          style={ {
            backgroundColor: this.props.muiTheme.palette.primary1Color,
            borderRadius: 4,
            color: this.props.muiTheme.palette.offWhite,
            marginBottom: 10,
            padding: 5,
          } }
        >
          Task parameters
        </div>
        { params.map((param) => {
          return (
            <div
              key={ `designDialog-${param.name}-container` }
              style={ designDialogContainerStyle }
            >
              <div
                key={ `designDialog-${param.name}-name` }
                style={ designDialogNameStyle }
              >
                { `${param.name}:` }
              </div>
              <div
                key={ `designDialog-${param.name}-value` }
                style={ designDialogValueStyle }
              >
                { param.value }
              </div>
            </div>
          );
        }) }
        <div
          style={ {
            marginTop: 20,
          } }
        >
          <div
            style={ {
              backgroundColor: this.props.muiTheme.palette.primary1Color,
              borderRadius: 4,
              color: this.props.muiTheme.palette.offWhite,
              padding: 5,
            } }
          >
            Sample sets
          </div>
          <div
            style={ {
              display: 'grid',
              gridColumnGap: 5,
              gridRowGap: 10,
              gridTemplateColumns: '20% 40% 40%',
              marginTop: 10,
              padding: '0px 10px 0px 10px',
            } }
          >
            <div
              style={ {
                borderBottom: '1px solid',
                gridColumn: 1,
                gridRow: 1,
                textAlign: 'center',
              } }
            >
              Name
            </div>
            <div
              style={ {
                borderBottom: '1px solid',
                gridColumn: 2,
                gridRow: 1,
                textAlign: 'center',
              } }
            >
              Controls
            </div>
            <div
              style={ {
                borderBottom: '1px solid',
                gridColumn: 3,
                gridRow: 1,
                textAlign: 'center',
              } }
            >
              Replicates
            </div>
            { design.map((sampleSet, sampleSetIndex) => {
              rowIndex += 1;
              let startingRowIndex = rowIndex;
              const setKey = sampleSetIndex;
              return [
                (<div
                  key={ `sampleSet-${setKey}-name` }
                  style={ {
                    gridColumn: 1,
                    gridRow: rowIndex,
                  } }
                >
                  { sampleSet.name }
                </div>),
                (sampleSet.controlSamples.map((control, controlIndex) => {
                  rowIndex += controlIndex;
                  let controlName = control.name;
                  if (control.replicate) {
                    controlName += `, ${control.replicate}`;
                  }
                  if (control.concentration) {
                    controlName += `, ${control.concentration}`;
                  }
                  if (control.timepoint) {
                    controlName += `, ${control.timepoint}`;
                  }
                  return (
                    <div
                      key={ `sampleSet-${rowIndex}-control` }
                      style={ {
                        gridColumn: 2,
                        gridRow: rowIndex,
                      } }
                    >
                      { controlName }
                    </div>
                  );
                })),
                (sampleSet.replicateSamples.map((replicate, replicateIndex) => {
                  startingRowIndex += replicateIndex;
                  let replicateName = replicate.name;
                  if (replicate.replicate) {
                    replicateName += `, ${replicate.replicate}`;
                  }
                  if (replicate.concentration) {
                    replicateName += `, ${replicate.concentration}`;
                  }
                  if (replicate.timepoint) {
                    replicateName += `, ${replicate.timepoint}`;
                  }
                  return (
                    <div
                      key={ `sampleSet-${startingRowIndex}-replicate` }
                      style={ {
                        gridColumn: 3,
                        gridRow: startingRowIndex,
                      } }
                    >
                      { replicateName }
                    </div>
                  );
                })),
              ];
            }) }
          </div>
        </div>
      </div>
    );
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
          onClick={ () => { this.props.downloadTask(task._id); } }
          onMouseEnter={ (e) => {
            this.props.iconTooltip.showFunc(e, 'Download results');
          } }
          onMouseLeave={ this.props.iconTooltip.hideFunc }
          style={ iconStyle }
        >
          <DownloadIcon />
        </IconButton>
        <IconButton
          onClick={ () => { this.props.viewTask(task._id); } }
          onMouseEnter={ (e) => {
            this.props.iconTooltip.showFunc(e, 'View Results');
          } }
          onMouseLeave={ this.props.iconTooltip.hideFunc }
          style={ iconStyle }
        >
          <ViewIcon />
        </IconButton>
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
        {
          this.props.taskStatus.fetching &&
          <div
            style={ taskStatusStyle }
          >
            <FontAwesome key="fetching" name="spinner" pulse={ true } /> Fetching tasks...
          </div>
        }
        {
          this.props.taskStatus.didInvalidate &&
          <div
            style={ taskStatusStyle }
          >
            There was an error retrieving tasks: { this.props.taskStatus.message }
          </div>
        }
        {
          !this.props.taskStatus.fetching &&
          !this.props.taskStatus.didInvalidate &&
          <CustomTable
            data={ {
              header: this.props.header,
              list: this.list(),
            } }
            footer={ false }
            height={ this.props.tableHeight }
          />
        }
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
            { this.designDialogContent(
              this.props.designDialog.design,
              this.props.designDialog.params
            ) }
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
        <Dialog
          actions={ [
            this.dialogClose(this.props.errorDialog.hideFunc),
          ] }
          onRequestClose={ this.props.errorDialog.hideFunc }
          open={ this.props.errorDialog.show }
          title={ this.props.errorDialog.title }
        >
          { this.props.errorDialog.text }
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
    design: PropTypes.arrayOf(
      PropTypes.shape({}),
    ),
    hideFunc: PropTypes.func,
    params: PropTypes.arrayOf(
      PropTypes.shape({}),
    ),
    show: PropTypes.bool,
    showFunc: PropTypes.func,
    title: PropTypes.string,
  }).isRequired,
  deleteTask: PropTypes.func.isRequired,
  downloadTask: PropTypes.func.isRequired,
  errorDialog: PropTypes.shape({
    hideFunc: PropTypes.func,
    show: PropTypes.bool,
    text: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
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
      offWhite: PropTypes.string,
      primary1Color: PropTypes.string,
      success: PropTypes.string,
      successHover: PropTypes.string,
      textColor: PropTypes.string,
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
  taskStatus: PropTypes.shape({
    didInvalidate: PropTypes.bool,
    fetching: PropTypes.bool,
    message: PropTypes.string,
  }).isRequired,
  viewTask: PropTypes.func.isRequired,
};

export default muiThemeable()(TaskList);
