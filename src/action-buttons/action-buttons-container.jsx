import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';

import ActionButtons from './action-buttons';

const buttonLabels = {
  large: {
    cancel: 'Cancel',
    reset: 'Reset',
    update: 'Udpate',
  },
  small: {
    cancel: <FontAwesome name="times" />,
    reset: <FontAwesome name="refresh" />,
    update: <FontAwesome name="send" />,
  },
};
const smallButtonWidth = 50;

class ActionButtonsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cancel: this.props.cancel ? {
        func: this.props.cancel.func,
        label: this.props.cancel.label ? this.props.cancel.label : null,
        toolTipText: this.props.cancel.toolTipText ? this.props.cancel.toolTipText : null,
      } : null,
      reset: this.props.reset ? {
        func: this.props.reset.func,
        label: this.props.reset.label ? this.props.reset.label : null,
        toolTipText: this.props.reset.toolTipText ? this.props.reset.toolTipText : null,
      } : null,
      update: this.props.update ? {
        func: this.props.update.func,
        label: this.props.update.label ? this.props.update.label : null,
        toolTipText: this.props.update.toolTipText ? this.props.update.toolTipText : null,
      } : null,
    };
    this.initButtons();
  }
  componentDidMount = () => {
    window.addEventListener('resize', this.setbuttonLabels);
  }
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.setbuttonLabels);
  }
  setbuttonLabels = () => {
    const newState = {};
    if (this.props.cancel) {
      newState.cancel = {
        func: this.props.cancel.func,
        label: this.props.cancel.label ? this.props.cancel.label : null,
        toolTipText: this.props.cancel.toolTipText ? this.props.cancel.toolTipText : null,
      };
      if (window.innerWidth > 680) {
        newState.cancel.label = newState.cancel.label ?
          newState.cancel.label :
          buttonLabels.large.cancel
        ;
      } else {
        newState.cancel.label = buttonLabels.small.cancel;
      }
    }
    if (this.props.reset) {
      newState.reset = {
        func: this.props.reset.func,
        label: this.props.reset.label ? this.props.reset.label : null,
        toolTipText: this.props.reset.toolTipText ? this.props.reset.toolTipText : null,
      };
      if (window.innerWidth > 680) {
        newState.reset.label = newState.reset.label ?
          newState.reset.label :
          buttonLabels.large.reset
        ;
      } else {
        newState.reset.label = buttonLabels.small.reset;
      }
    }
    if (this.props.update) {
      newState.update = {
        func: this.props.update.func,
        label: this.props.update.label ? this.props.update.label : null,
        toolTipText: this.props.update.toolTipText ? this.props.update.toolTipText : null,
      };
      if (window.innerWidth > 680) {
        newState.update.label = newState.update.label ?
          newState.update.label :
          buttonLabels.large.update
        ;
      } else {
        newState.update.label = buttonLabels.small.update;
      }
    }
    const newStyle = window.innerWidth > 680 ? {} : {
      maxWidth: smallButtonWidth,
      minWidth: smallButtonWidth,
      width: smallButtonWidth,
    };
    this.setState(Object.assign(newState, { style: newStyle }));
  }
  initButtons = () => {
    if (window.innerWidth > 680) {
      if (this.state.cancel) {
        this.state.cancel.label = this.state.cancel.label ?
          this.state.cancel.label :
          buttonLabels.large.cancel
        ;
      }
      if (this.state.reset) {
        this.state.reset.label = this.state.reset.label ?
          this.state.reset.label :
          buttonLabels.large.reset
        ;
      }
      if (this.state.update) {
        this.state.update.label = this.state.update.label ?
          this.state.update.label :
          buttonLabels.large.update
        ;
      }
      this.state.style = {};
    } else {
      if (this.state.cancel) {
        this.state.cancel.label = buttonLabels.small.cancel;
      }
      if (this.state.reset) {
        this.state.reset.label = buttonLabels.small.reset;
      }
      if (this.state.update) {
        this.state.update.label = buttonLabels.small.update;
      }
      this.state.style = {
        maxWidth: smallButtonWidth,
        minWidth: smallButtonWidth,
        width: smallButtonWidth,
      };
    }
  }
  render() {
    return (
      <ActionButtons
        cancel={ this.state.cancel }
        idSuffix={ this.props.idSuffix }
        reset={ this.state.reset }
        style={ this.state.style }
        update={ this.state.update }
      />
    );
  }
}

ActionButtonsContainer.defaultProps = {
  cancel: null,
  reset: null,
  update: null,
};

ActionButtonsContainer.propTypes = {
  cancel: PropTypes.shape({
    func: PropTypes.func,
    label: PropTypes.string,
    toolTipText: PropTypes.string,
  }),
  idSuffix: PropTypes.string.isRequired,
  reset: PropTypes.shape({
    func: PropTypes.func,
    label: PropTypes.string,
    toolTipText: PropTypes.string,
  }),
  update: PropTypes.shape({
    func: PropTypes.func,
    label: PropTypes.string,
    toolTipText: PropTypes.string,
  }),
};

export default ActionButtonsContainer;
