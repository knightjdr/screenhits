import AssessmentIcon from 'material-ui/svg-icons/action/assessment';
import AssignmentIcon from 'material-ui/svg-icons/action/assignment-turned-in';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import DescriptionIcon from 'material-ui/svg-icons/action/description';
import Dialog from 'material-ui/Dialog';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontAwesome from 'react-fontawesome';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import SelectField from 'material-ui/SelectField';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import ViewIcon from 'material-ui/svg-icons/action/visibility';
import { Scrollbars } from 'react-custom-scrollbars';

import AnalysisOptions from '../../../modules/analysis-new';
import ArchiveStyle from '../archive-style';
import CustomTable from '../../../table/table-container';
import Fields from '../../../modules/fields';
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
const filtersContainerStyle = {
  borderBottom: '1px solid #e0e0e0',
  marginTop: 10,
  paddingBottom: 10,
};
const taskStatusStyle = {
  marginTop: 20,
  textAlign: 'center',
};

class TaskList extends React.Component {
  analysisTypeOptions = (fields, analysisType) => {
    let options = fields.map((type) => {
      return (
        <MenuItem
          key={ type }
          value={ type }
          primaryText={ type }
        />
      );
    });
    if (analysisType) {
      options = options.concat([
        <MenuItem
          key="none"
          value="none"
          primaryText="none"
        />,
      ]);
    }
    return options;
  }
  applyFilters = () => {
    return (
    [
      <FlatButton
        backgroundColor={ this.props.muiTheme.palette.success }
        hoverColor={ this.props.muiTheme.palette.successHover }
        label="Update"
        onTouchTap={ this.props.applyFilters }
      />,
    ]);
  }
  clearFilters = () => {
    return (
    [
      <FlatButton
        backgroundColor={ this.props.muiTheme.palette.alert }
        hoverColor={ this.props.muiTheme.palette.alertHover }
        label="Clear"
        onTouchTap={ this.props.clearFilters }
        style={ {
          marginLeft: 10,
        } }
      />,
    ]);
  }
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
  filterDialogContent = (filters, funcs) => {
    return (
      <div
        style={ {
          display: 'flex',
          flexWrap: 'wrap',
          padding: '10px 0',
        } }
      >
        <TextField
          hintText="User name"
          floatingLabelText="User name"
          onChange={ funcs.user }
          style={ ArchiveStyle.filterField }
          type="text"
          value={ filters.user }
        />
        <SelectField
          floatingLabelText="Screen type"
          listStyle={ ArchiveStyle.selectList }
          onChange={ funcs.screenType }
          style={ ArchiveStyle.filterField }
          value={ filters.screenType }
        >
          {
            this.screenTypeOptions(Fields.screen.type.values, filters.screenType)
          }
        </SelectField>
        <SelectField
          disabled={ !filters.screenType }
          floatingLabelText="Analysis type"
          listStyle={ ArchiveStyle.selectList }
          onChange={ funcs.analysisType }
          style={ ArchiveStyle.filterField }
          value={ filters.analysisType }
        >
          {
            filters.screenType &&
            this.screenTypeOptions(
              AnalysisOptions[filters.screenType].options,
              filters.analysisType
            )
          }
        </SelectField>
      </div>
    );
  }
  list = (headers, tasks) => {
    const tableList = tasks.map((task, index) => {
      const columns = headers.map((header) => {
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
          style={ ArchiveStyle.smallIcon }
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
            style={ ArchiveStyle.smallIcon }
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
            style={ ArchiveStyle.smallIcon }
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
          style={ ArchiveStyle.smallIcon }
        >
          <DownloadIcon />
        </IconButton>
        <IconButton
          onClick={ () => { this.props.viewTask(task._id); } }
          onMouseEnter={ (e) => {
            this.props.iconTooltip.showFunc(e, 'View Results');
          } }
          onMouseLeave={ this.props.iconTooltip.hideFunc }
          style={ ArchiveStyle.smallIcon }
        >
          <ViewIcon />
        </IconButton>
        <IconButton
          iconStyle={ {
            color: this.props.muiTheme.palette.warning,
          } }
          onClick={ () => { this.props.deleteDialog.showFunc(task._id); } }
          onMouseEnter={ (e) => {
            this.props.iconTooltip.showFunc(e, cancelText);
          } }
          onMouseLeave={ this.props.iconTooltip.hideFunc }
          style={ ArchiveStyle.smallIcon }
        >
          <ClearIcon />
        </IconButton>
      </span>
    );
  }
  screenTypeOptions = (fields, screenType) => {
    let options = fields.map((type) => {
      return (
        <MenuItem
          key={ type }
          value={ type }
          primaryText={ type }
        />
      );
    });
    if (screenType) {
      options = options.concat([
        <MenuItem
          key="none"
          value="none"
          primaryText="none"
        />,
      ]);
    }
    return options;
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
          <div>
            <div
              style={ filtersContainerStyle }
            >
              <FloatingActionButton
                data-tip={ true }
                data-for={ 'fab-refresh-tasks' }
                mini={ true }
                onTouchTap={ this.props.updateTasks }
              >
                <RefreshIcon />
              </FloatingActionButton>
              <FloatingActionButton
                data-tip={ true }
                data-for={ 'fab-filter-tasks' }
                mini={ true }
                onTouchTap={ this.props.filterDialog.showFunc }
                style={ {
                  marginLeft: 10,
                } }
              >
                <FontAwesome name="filter" />
              </FloatingActionButton>
            </div>
            {
              this.props.tasks.length <= 0 &&
              <div
                style={ {
                  marginTop: 20,
                  textAlign: 'center',
                } }
              >
                There are no tasks matching the specified filters
              </div>
            }
            {
              this.props.tasks.length > 0 &&
              <CustomTable
                data={ {
                  header: this.props.header,
                  list: this.list(this.props.header, this.props.tasks),
                } }
                footer={ false }
                height={ this.props.tableHeight }
              />
            }
            <ReactTooltip
              effect="solid"
              id="fab-refresh-tasks"
              place="right"
              type="dark"
            >
              Refresh task status
            </ReactTooltip>
            <ReactTooltip
              effect="solid"
              id="fab-filter-tasks"
              place="right"
              type="dark"
            >
              View filters
            </ReactTooltip>
          </div>
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
            this.applyFilters(),
            this.clearFilters(),
            this.dialogClose(this.props.filterDialog.hideFunc),
          ] }
          autoScrollBodyContent={ true }
          open={ this.props.filterDialog.show }
          onRequestClose={ this.props.filterDialog.hideFunc }
          title="Filters"
          titleStyle={ {
            borderBottom: 'none',
          } }
        >
          {
            this.filterDialogContent(
              this.props.filters,
              this.props.filterFuncs,
            )
          }
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
        <Snackbar
          autoHideDuration={ this.props.snackbar.duration }
          message={ this.props.snackbar.message }
          open={ this.props.snackbar.open }
          onRequestClose={ this.props.snackbar.close }
        />
      </div>
    );
  }
}

TaskList.propTypes = {
  applyFilters: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
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
  filterDialog: PropTypes.shape({
    hideFunc: PropTypes.func,
    show: PropTypes.bool,
    showFunc: PropTypes.func,
  }).isRequired,
  filterFuncs: PropTypes.shape({
    analysisType: PropTypes.func,
    screenType: PropTypes.func,
    user: PropTypes.func,
  }).isRequired,
  filters: PropTypes.shape({
    analysisType: PropTypes.string,
    screenType: PropTypes.string,
    user: PropTypes.string,
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
      alert: PropTypes.string,
      alertHover: PropTypes.string,
      offWhite: PropTypes.string,
      primary1Color: PropTypes.string,
      success: PropTypes.string,
      successHover: PropTypes.string,
      textColor: PropTypes.string,
      warning: PropTypes.string,
      warningHover: PropTypes.string,
    }),
  }).isRequired,
  snackbar: PropTypes.shape({
    close: PropTypes.func,
    duration: PropTypes.number,
    message: PropTypes.string,
    open: PropTypes.bool,
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
  updateTasks: PropTypes.func.isRequired,
  viewTask: PropTypes.func.isRequired,
};

export default muiThemeable()(TaskList);
