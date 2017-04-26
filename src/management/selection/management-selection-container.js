import { connect } from 'react-redux';
import { setIndex } from 'root/state/set/index-actions.js';
import ManagementSelection from 'root/management/selection/management-selection.jsx';

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changeSelected: (selected) => {
      dispatch(setIndex(ownProps.type, selected));
    }
  };
}

const Selection = connect(
  null,
  mapDispatchToProps
)(ManagementSelection);

export default Selection;
