import { connect } from 'react-redux';
import Projects from 'root/projects/projects.jsx';

const mapStateToProps = (state) => {
  return {
    selected: state.selected
  };
}

const ProjectDetails = connect(
  mapStateToProps
)(Projects);

export default ProjectDetails;
