import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import DisplayMicroscopySample from './display-microscopy-sample';
import DownloadImage from '../../../../fetch/download-image';
import { objectEmpty } from '../../../../helpers/helpers';
import ValidateField from '../../../../modules/validate-field';

class DisplayMicroscopySampleContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialog: {
        delete: false,
        help: false,
        text: '',
        title: '',
      },
      errorDialog: {
        show: false,
        text: null,
        title: null,
      },
      imageDialog: {
        images: [],
        index: 0,
        show: false,
      },
      images: {
        fullColor: null,
        blue: null,
        green: null,
        red: null,
      },
      item: Object.assign({}, this.props.item),
      loading: {
        blue: true,
        fullColor: true,
        green: true,
        red: true,
      },
      warning: null,
    };
  }
  componentDidMount = () => {
    this.getFullColorImage();
  }
  componentWillReceiveProps = (nextProps) => {
    const { item } = nextProps;
    // update item when store item updates
    if (!deepEqual(item, this.props.item)) {
      this.setState({
        item: Object.assign({}, item),
      });
    }
  }
  getChannelImage = (channel) => {
    const channelLoadObj = {};
    channelLoadObj[channel] = true;
    this.setState(({ loading }) => {
      return {
        loading: Object.assign(
          {},
          loading,
          channelLoadObj
        ),
      };
    });
    DownloadImage(`channel/${this.props.item.files_id}/${channel}`, this.props.token)
      .then((image) => {
        this.setState(({ images, loading }) => {
          const channelImageObj = {};
          channelImageObj[channel] = image;
          channelLoadObj[channel] = false;
          return {
            images: Object.assign(
              {},
              images,
              channelImageObj
            ),
            loading: Object.assign(
              {},
              loading,
              channelLoadObj
            ),
          };
        });
      })
      .catch((error) => {
        this.setState({
          errorDialog: {
            show: true,
            text: error.text,
            title: error.title,
          },
        });
      })
    ;
  }
  getFullColorImage = () => {
    if (this.props.item.files_id) {
      DownloadImage(`image/${this.props.item.files_id}`, this.props.token)
        .then((image) => {
          this.setState({
            images: {
              fullColor: image,
              blue: null,
              green: null,
              red: null,
            },
            loading: {
              blue: false,
              fullColor: false,
              green: false,
              red: false,
            },
          });
        })
        .catch((error) => {
          this.setState({
            errorDialog: {
              show: true,
              text: error.text,
              title: error.title,
            },
          });
        })
      ;
    }
  }
  changeCarouselIndex = (increment) => {
    this.setState(({ imageDialog }) => {
      const index = imageDialog.index;
      const maxIndex = imageDialog.images.length - 1;
      let newIndex = index + increment;
      if (newIndex < 0) {
        newIndex = maxIndex;
      } else if (newIndex > maxIndex) {
        newIndex = 0;
      }
      return {
        imageDialog: Object.assign(
          {},
          imageDialog,
          {
            index: newIndex,
          }
        ),
      };
    });
  };
  deleteSample = (_id) => {
    this.dialogClose();
    this.props.delete(
      _id,
      'sample',
      {
        experiment: this.props.selectedIndices.experiment,
        project: this.props.selectedIndices.project,
        screen: this.props.selectedIndices.screen,
      },
    );
  }
  dialogClose = () => {
    this.setState({
      dialog: {
        delete: false,
        help: false,
      },
    });
  }
  dialogOpen = (type, title = '', text = '') => {
    this.setState((prevState) => {
      const newState = Object.assign({}, prevState.dialog);
      newState[type] = true;
      newState.text = text;
      newState.title = title;
      return {
        dialog: newState,
      };
    });
  }
  errorDialogClose = () => {
    this.setState({
      errorDialog: {
        show: false,
        text: null,
        title: null,
      },
    });
  }
  imageDialogClose = () => {
    this.setState({
      imageDialog: {
        images: [],
        index: 0,
        show: false,
      },
    });
  }
  inputChange = (field, value) => {
    // check if field is valid and update errors object
    const errors = Object.assign({}, this.props.errors);
    const validate = ValidateField.sample.checkFields.indexOf(field) > 0 ?
      ValidateField.sample[field](value)
      :
      { error: false }
    ;
    errors[field] = validate.error ? validate.message : null;
    const warning = !objectEmpty(errors);
    this.props.updateErrors(errors, warning);
    // update item state
    const updateObject = JSON.parse(JSON.stringify(this.state.item));
    if (
      typeof updateObject[field] === 'object' &&
      updateObject[field].isArray
    ) {
      updateObject[field] = Object.assign([], value);
    } else {
      updateObject[field] = value;
    }
    this.setState({ item: updateObject });
    this.props.updateItem(updateObject);
  }
  showImage = (channel) => {
    this.setState(({ images, item }) => {
      let carouselImages = [];
      Object.keys(images).forEach((key) => {
        const title = key !== 'fullColor' ?
          `${key}: ${item.channels[key].marker}`
          :
          null
        ;
        if (images[key]) {
          carouselImages.push({
            channel: key,
            image: images[key],
            title,
          });
        }
      });
      // reorder carousel
      const channelIndex = carouselImages.findIndex((image) => {
        return image.channel === channel;
      });
      const toMove = carouselImages.splice(0, channelIndex);
      carouselImages = carouselImages.concat(toMove);
      return {
        imageDialog: {
          images: carouselImages,
          index: 0,
          show: true,
        },
      };
    });
  }
  render() {
    return (
      <div>
        <DisplayMicroscopySample
          canEdit={ this.props.canEdit }
          changeCarouselIndex={ this.changeCarouselIndex }
          deleteSample={ this.deleteSample }
          dialog={ {
            close: this.dialogClose,
            delete: this.state.dialog.delete,
            help: this.state.dialog.help,
            open: this.dialogOpen,
            text: this.state.dialog.text,
            title: this.state.dialog.title,
          } }
          edit={ this.props.edit }
          errors={ this.props.errors }
          errorDialog={ Object.assign(
            {},
            this.state.errorDialog,
            {
              close: this.errorDialogClose,
            }
          ) }
          getChannelImage={ this.getChannelImage }
          imageDialog={ Object.assign(
            {},
            this.state.imageDialog,
            {
              close: this.imageDialogClose,
            }
          ) }
          images={ this.state.images }
          inputChange={ this.inputChange }
          inputWidth={ this.props.inputWidth }
          loading={ this.state.loading }
          sample={ this.state.item }
          showImage={ this.showImage }
        />
      </div>

    );
  }
}

DisplayMicroscopySampleContainer.propTypes = {
  canEdit: PropTypes.bool.isRequired,
  delete: PropTypes.func.isRequired,
  edit: PropTypes.bool.isRequired,
  errors: PropTypes.shape({
    name: PropTypes.string,
    replicate: PropTypes.string,
  }).isRequired,
  inputWidth: PropTypes.number.isRequired,
  item: PropTypes.shape({
    _id: PropTypes.number,
    comment: PropTypes.string,
    concentration: PropTypes.string,
    creatorEmail: PropTypes.string,
    creatorName: PropTypes.string,
    description: PropTypes.string,
    files_id: PropTypes.string,
    name: PropTypes.string,
    replicate: PropTypes.string,
    timepoint: PropTypes.string,
    creationDate: PropTypes.string,
    updateDate: PropTypes.string,
  }).isRequired,
  selectedIndices: PropTypes.shape({
    experiment: PropTypes.number,
    project: PropTypes.number,
    sample: PropTypes.number,
    screen: PropTypes.number,
  }).isRequired,
  token: PropTypes.string.isRequired,
  updateErrors: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    selectedIndices: state.selected,
    token: state.token,
  };
};

const Container = connect(
  mapStateToProps,
)(DisplayMicroscopySampleContainer);

export default Container;
