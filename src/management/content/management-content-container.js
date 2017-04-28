import { connect } from 'react-redux';
import ManagementContent from 'root/management/content/management-content.jsx';
import { resetPost } from 'root/state/post/actions.js';
import { resetPut } from 'root/state/put/actions.js';

let init = true;

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    resetPost: () => {
      dispatch(resetPost(ownProps.active));
    },
    resetPut: (_id) => {
      dispatch(resetPut(_id, ownProps.active));
    }
  };
}

const mapStateToProps = (state, ownProps) => {
  return {available: state.available};
}

const Details = connect(
  mapStateToProps,
  mapDispatchToProps
)(ManagementContent);

export default Details;
