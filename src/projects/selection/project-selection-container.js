import { connect } from 'react-redux';
import { setIndex } from 'root/state/actions.js';
import ProjectSelection from 'root/projects/selection/project-selection.jsx';

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
)(ProjectSelection);

export default Selection;
