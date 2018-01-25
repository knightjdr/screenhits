import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import DisplayMicroscopySample from './display-microscopy-sample';
import ClearImages from '../../../../fetch/clear-images';
import DownloadImage from '../../../../fetch/download-image';
import DownloadImagePost from '../../../../fetch/download-image-post';
import SaveImages from '../../../../fetch/save-images';
import UpdateImage from '../../../../fetch/update-image';
import ValidateField from '../../../../modules/validate-field';
import { objectEmpty } from '../../../../helpers/helpers';

const reset = {
  snackbar: {
    duration: 4000,
    message: '',
    open: false,
  },
};

class DisplayMicroscopySampleContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brightness: {
        blue: 0,
        green: 0,
        merge: 0,
        red: 0,
      },
      contrast: {
        blue: 0,
        green: 0,
        merge: 0,
        red: 0,
      },
      dialog: {
        clear: false,
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
        merge: null,
      },
      isClearing: false,
      isSaving: false,
      item: Object.assign({}, this.props.item),
      loading: {
        blue: true,
        fullColor: true,
        green: true,
        merge: true,
        red: true,
      },
      mergeOptions: {
        blue: false,
        green: false,
        red: false,
      },
      snackbar: Object.assign({}, reset.snackbar),
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
  componentDidUpdate = () => {
    if (this.state.snackbar.open) {
      setTimeout(() => {
        this.setState({
          snackbar: Object.assign({}, reset.snackbar),
        });
      }, 4000);
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
        this.setState(({ images, loading, mergeOptions }) => {
          const channelImageObj = {};
          channelImageObj[channel] = image;
          channelLoadObj[channel] = false;
          const newMergeOptions = Object.assign({}, mergeOptions);
          newMergeOptions[channel] = true;
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
            mergeOptions: newMergeOptions,
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
        .then((retrievedImages) => {
          this.setState(({ images, mergeOptions }) => {
            const newMergeOptions = Object.assign({}, mergeOptions);
            newMergeOptions.blue = Boolean(retrievedImages.blue);
            newMergeOptions.green = Boolean(retrievedImages.green);
            newMergeOptions.red = Boolean(retrievedImages.red);
            return {
              images: Object.assign(
                {},
                images,
                retrievedImages
              ),
              loading: {
                blue: false,
                fullColor: false,
                green: false,
                merge: false,
                red: false,
              },
              mergeOptions: newMergeOptions,
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
  }
  changeBrightness = (channel, value) => {
    this.setState(({ brightness }) => {
      const newBrightness = brightness;
      newBrightness[channel] = value;
      return {
        brightness: newBrightness,
      };
    });
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
  changeContrast = (channel, value) => {
    this.setState(({ contrast }) => {
      const newContrast = contrast;
      newContrast[channel] = value;
      return {
        contrast: newContrast,
      };
    });
  }
  clearImages = () => {
    if (
      this.state.images.blue ||
      this.state.images.green ||
      this.state.images.merge ||
      this.state.images.red
    ) {
      this.setState({
        dialog: {
          clear: false,
          delete: false,
          help: false,
        },
        isClearing: true,
      });
      ClearImages(`image/${this.props.item.files_id}`, this.props.token)
        .then(() => {
          this.setState(({ images }) => {
            return {
              images: {
                fullColor: images.fullColor,
                blue: null,
                green: null,
                red: null,
                merge: null,
              },
              isClearing: false,
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
            isClearing: false,
          });
        })
      ;
    }
  }
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
        clear: false,
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
  mergeChannels = () => {
    if (
      this.state.mergeOptions.blue ||
      this.state.mergeOptions.green ||
      this.state.mergeOptions.red
    ) {
      this.setState(({ loading }) => {
        return {
          loading: Object.assign(
            {},
            loading,
            {
              merge: true,
            }
          ),
        };
      });
      DownloadImagePost(
        `merge/${this.props.item.files_id}`,
        this.state.mergeOptions,
        this.props.token
      )
        .then((image) => {
          this.setState(({ images, loading }) => {
            return {
              images: Object.assign(
                {},
                images,
                {
                  merge: image,
                }
              ),
              loading: Object.assign(
                {},
                loading,
                {
                  merge: false,
                }
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
  }
  saveImages = () => {
    if (
      this.state.mergeOptions.blue ||
      this.state.mergeOptions.green ||
      this.state.mergeOptions.merge ||
      this.state.mergeOptions.red
    ) {
      this.setState({
        isSaving: true,
      });
      const body = {
        channels: {
          blue: this.state.images.blue,
          green: this.state.images.green,
          merge: this.state.images.merge,
          red: this.state.images.red,
        },
      };
      SaveImages(`image/${this.props.item.files_id}`, body, this.props.token)
        .then(() => {
          this.setState(({ snackbar }) => {
            return {
              isSaving: false,
              snackbar: Object.assign(
                {},
                snackbar,
                {
                  open: true,
                  message: 'Images saved',
                }
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
            isSaving: false,
          });
        })
      ;
    }
  }
  showImage = (channel) => {
    this.setState(({ images, item }) => {
      let carouselImages = [];
      Object.keys(images).forEach((key) => {
        let title;
        if (key === 'fullColor') {
          title = 'original image';
        } else if (key === 'merge') {
          title = 'merge';
        } else {
          title = `${key}: ${item.channels[key].marker}`;
        }
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
  splitAll = () => {
    this.setState({
      loading: {
        blue: true,
        green: true,
        merge: false,
        red: true,
      },
    });
    DownloadImage(`split/${this.props.item.files_id}`, this.props.token)
      .then((splitImages) => {
        this.setState(({ images }) => {
          return {
            images: Object.assign(
              {},
              images,
              splitImages
            ),
            loading: {
              blue: false,
              fullColor: false,
              green: false,
              merge: false,
              red: false,
            },
            mergeOptions: {
              blue: true,
              green: true,
              red: true,
            },
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
  toggleMerge = (channel) => {
    this.setState(({ mergeOptions }) => {
      const newMergeOptions = Object.assign({}, mergeOptions);
      newMergeOptions[channel] = !newMergeOptions[channel];
      return {
        mergeOptions: newMergeOptions,
      };
    });
  }
  updateBrightContrast = (channel) => {
    const body = {
      brightness: this.state.brightness[channel],
      channel,
      contrast: this.state.contrast[channel],
      fileID: this.props.item.files_id,
    };
    this.setState(({ loading }) => {
      const newLoading = Object.assign({}, loading);
      newLoading[channel] = true;
      return {
        loading: newLoading,
      };
    });
    UpdateImage(body, this.props.token)
      .then((image) => {
        this.setState(({ images, loading }) => {
          const newLoading = Object.assign({}, loading);
          newLoading[channel] = false;
          const newImages = Object.assign({}, images);
          newImages[channel] = image;
          return {
            images: newImages,
            loading: newLoading,
          };
        });
      })
      .catch((error) => {
        this.setState(({ loading }) => {
          const newLoading = Object.assign({}, loading);
          newLoading[channel] = false;
          return {
            errorDialog: {
              show: true,
              text: error.text,
              title: error.title,
            },
            loading: newLoading,
          };
        });
      })
    ;
  }
  render() {
    return (
      <div>
        <DisplayMicroscopySample
          brightness={ this.state.brightness }
          canEdit={ this.props.canEdit }
          changeBrightness={ this.changeBrightness }
          changeCarouselIndex={ this.changeCarouselIndex }
          changeContrast={ this.changeContrast }
          clearImages={ this.clearImages }
          contrast={ this.state.contrast }
          deleteSample={ this.deleteSample }
          dialog={ {
            clear: this.state.dialog.clear,
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
          isClearing={ this.state.isClearing }
          isSaving={ this.state.isSaving }
          loading={ this.state.loading }
          mergeOptions={ this.state.mergeOptions }
          mergeChannels={ this.mergeChannels }
          sample={ this.state.item }
          saveImages={ this.saveImages }
          showImage={ this.showImage }
          snackbar={ this.state.snackbar }
          splitAll={ this.splitAll }
          toggleMerge={ this.toggleMerge }
          updateBrightContrast={ this.updateBrightContrast }
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
