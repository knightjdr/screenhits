import { connect } from 'react-redux';
import CreateContent from 'root/management/content/create/create-content.jsx';
import { resetPost, submitPost } from 'root/state/post/actions.js';
import { setIndex } from 'root/state/set/index-actions.js';

const mapDispatchToProps = (dispatch) => {
  return {
    create: (active, obj) => {
      dispatch(submitPost(active, obj));
    },
    reset: (active) => {
      dispatch(resetPost(active));
    },
    setIndex: (_id, active) => {
      dispatch(setIndex(active, _id));
    }
  };
}

const mapStateToProps = (state) => {
  return {
    post: state.post,
    user: state.user
  };
}

const Details = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateContent);

export default Details;
