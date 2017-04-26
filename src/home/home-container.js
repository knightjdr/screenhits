import { connect } from 'react-redux';
import { getData } from 'root/state/data/actions.js';
import Home from 'root/home/home.jsx';

const mapDispatchToProps = (dispatch, ownProps) => {
  dispatch(getData('project'));
  return {
  };
}

const Details = connect(
  null,
  mapDispatchToProps
)(Home);

export default Details;
