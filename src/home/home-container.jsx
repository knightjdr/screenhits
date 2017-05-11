import { connect } from 'react-redux';

import { getData } from '../state/get/data-actions';
import Home from './home';

const mapDispatchToProps = (dispatch) => {
  dispatch(getData('project'));
  return {
  };
};

const Details = connect(
  null,
  mapDispatchToProps,
)(Home);

export default Details;
