import PropTypes from 'prop-types';
import React from 'react';

import CreateSample from './create-sample';
import fileReader from '../../../helpers/file-reader';

class CreateSampleContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: {
        name: null,
      },
    };
  }
  readFileInput = (e) => {
    fileReader.firstLine(e.target.files[0])
      .then((header) => {
        console.log(header);
        this.setState({
          file: {
            name: e.target.files[0].name,
          },
        });
      })
      .catch((error) => {
        console.log(`error ${error}`);
        this.setState({
          file: {
            name: e.target.files[0].name,
          },
        });
      })
    ;
  }
  resetFileInput = () => {
    this.setState({
      file: {
        name: null,
      },
    });
  }
  render() {
    return (
      <CreateSample
        dialog={ this.props.dialog }
        errors={ this.props.errors }
        file={ this.state.file }
        formData={ this.props.formData }
        inputChange={ this.props.inputChange }
        inputWidth={ this.props.inputWidth }
        readFileInput={ this.readFileInput }
        resetFileInput={ this.resetFileInput }
      />
    );
  }
}

CreateSampleContainer.propTypes = {
  dialog: PropTypes.shape({
    close: PropTypes.func,
    help: PropTypes.bool,
    open: PropTypes.func,
    text: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  errors: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  formData: PropTypes.shape({
    comment: PropTypes.string,
    name: PropTypes.string,
    replicate: PropTypes.string,
  }).isRequired,
  inputChange: PropTypes.func.isRequired,
  inputWidth: PropTypes.number.isRequired,
};

export default CreateSampleContainer;
