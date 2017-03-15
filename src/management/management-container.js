import { connect } from 'react-redux';
import Management from 'root/management/management.jsx';

let init = true;

const mapStateToProps = (state, ownProps) => {
  let selectedObj = {};
  if(init) {
    for(let key in ownProps.params) {
      selectedObj[key] = ownProps.params[key];
    }
    init = false;
  } else {
    selectedObj = state.selected;
  }
  return {selected: selectedObj};
}

const Details = connect(
  mapStateToProps
)(Management);

export default Details;
