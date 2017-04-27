import { connect } from 'react-redux';
import DisplayContent from 'root/management/content/display/display-content.jsx';
import { resetPut, submitPut } from 'root/state/put/actions.js';

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    reset: (_id) => {
      dispatch(resetPut(_id, ownProps.active));
    },
    update: (_id, obj) => {
      dispatch(submitPut(_id, obj, ownProps.active));
    }
  };
}

const mapStateToProps = (state) => {
  return {
    put: state.put
  };
}

const Details = connect(
  mapStateToProps,
  mapDispatchToProps
)(DisplayContent);

export default Details;
