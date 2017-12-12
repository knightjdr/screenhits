import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';

class Login extends React.Component {
  dialogClose = () => {
    return (
    [
      <FlatButton
        backgroundColor={ this.props.muiTheme.palette.warning }
        hoverColor={ this.props.muiTheme.palette.warningHover }
        label="Close"
        onTouchTap={ this.props.dialog.close }
      />,
    ]);
  }
  render() {
    return (
      <Dialog
        actions={ this.dialogClose() }
        modal={ false }
        onRequestClose={ this.props.dialog.close }
        open={ this.props.dialog.isOpen }
        title={ this.props.dialog.title }
      >
        { this.props.dialog.message }
      </Dialog>
    );
  }
}

Login.propTypes = {
  dialog: PropTypes.shape({
    close: PropTypes.func,
    isOpen: PropTypes.bool,
    message: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      warning: PropTypes.string,
      warningHover: PropTypes.string,
    }),
  }).isRequired,
};

export default muiThemeable()(Login);
