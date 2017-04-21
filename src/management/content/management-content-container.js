import { connect } from 'react-redux';
import ManagementContent from 'root/management/content/management-content.jsx';

let init = true;

const mapStateToProps = (state, ownProps) => {
  return {available: state.available};
}

const Details = connect(
  mapStateToProps
)(ManagementContent);

export default Details;
