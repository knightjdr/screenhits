import { connect } from 'react-redux';
import CreateContent from 'root/management/content/create/create-content.jsx';
import { resetPost, submitPost } from 'root/state/post/actions.js';

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    create: (obj) => {
      dispatch(submitPost(ownProps.active, obj));
    },
    reset: () => {
      dispatch(resetPost(ownProps.active));
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
