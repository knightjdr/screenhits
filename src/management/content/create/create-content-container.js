import { connect } from 'react-redux';
import CreateContent from 'root/management/content/create/create-content.jsx';
import { resetPost, submitPost } from 'root/state/post/actions.js';
import { setIndex } from 'root/state/set/index-actions.js';

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    create: (obj) => {
      dispatch(submitPost(ownProps.active, obj));
    },
    reset: () => {
      dispatch(resetPost(ownProps.active));
    },
    setIndex: (_id) => {
      dispatch(setIndex(ownProps.active, _id));
    }
  };
}

const mapStateToProps = (state, ownProps) => {
  return {
    length: {available: state.available[ownProps.active].items.length},
    post: state.post,
    user: state.user
  };
}

const Details = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateContent);

export default Details;
