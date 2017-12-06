import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontAwesome from 'react-fontawesome';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';
import ReactTooltip from 'react-tooltip';

class Filter extends React.Component {
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
  render() {
    return (
      <span
        style={ this.props.style }
      >
        <FloatingActionButton
          data-tip={ true }
          data-for={ 'fab-filter-tasks' }
          mini={ true }
          onTouchTap={ this.props.dialogState.showFunc }
        >
          <FontAwesome name="filter" />
        </FloatingActionButton>
        <ReactTooltip
          id="fab-filter-tasks"
          effect="solid"
          type="dark"
          place="left"
        >
          Filters
        </ReactTooltip>
        <Dialog
          actions={ [
            this.applyFilters(),
            this.clearFilters(),
            this.dialogClose(this.props.dialogState.hideFunc),
          ] }
          autoScrollBodyContent={ true }
          open={ this.props.dialogState.show }
          onRequestClose={ this.props.dialogState.hideFunc }
          title="Filters"
          titleStyle={ {
            borderBottom: 'none',
          } }
        >
          { this.props.filterBody }
        </Dialog>
      </span>
    );
  }
}

Filter.defaultProps = {
  style: {},
};

Filter.propTypes = {
  applyFilters: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
  dialogState: PropTypes.shape({
    hideFunc: PropTypes.func,
    show: PropTypes.bool,
    showFunc: PropTypes.func,
  }).isRequired,
  filterBody: PropTypes.element.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      alert: PropTypes.string,
      alertHover: PropTypes.string,
      success: PropTypes.string,
      successHover: PropTypes.string,
      warning: PropTypes.string,
      warningHover: PropTypes.string,
    }),
  }).isRequired,
  style: PropTypes.shape({}),
};

export default muiThemeable()(Filter);
