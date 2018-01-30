import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import DisplayMicroscopySample from './display-microscopy-sample';
import ClearImages from '../../../../fetch/clear-images';
import CropImages from '../../../../fetch/crop-images';
import DownloadImage from '../../../../fetch/download-image';
import DownloadImagePost from '../../../../fetch/download-image-post';
import ExportImage from '../../../../fetch/export-image';
import SaveImages from '../../../../fetch/save-images';
import UpdateImage from '../../../../fetch/update-image';
import ValidateField from '../../../../modules/validate-field';
import { objectEmpty } from '../../../../helpers/helpers';

const reset = {
  brightness: {
    blue: 0,
    green: 0,
    red: 0,
  },
  contrast: {
    blue: 0,
    green: 0,
    red: 0,
  },
  crop: {
    anchor: {},
    active: false,
    dragging: false,
    height: 0,
    maxHeight: 0,
    maxWidth: 0,
    width: 0,
    x: 0,
    y: 0,
  },
  dialog: {
    clear: false,
    delete: false,
    export: false,
    help: false,
    text: '',
    title: '',
  },
  exportOptions: {
    channels: {
      original: false,
      blue: false,
      green: false,
      merge: false,
      red: false,
    },
    greyscale: {
      original: false,
      blue: false,
      green: false,
      merge: false,
      red: false,
    },
  },
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
      brightness: Object.assign({}, reset.brightness),
      contrast: Object.assign({}, reset.contrast),
      crop: Object.assign({}, reset.crop),
      dialog: Object.assign({}, reset.dialog),
      errorDialog: {
        show: false,
        text: null,
        title: null,
      },
      exportOptions: Object.assign({}, reset.exportOptions),
      imageDialog: {
        images: [],
        index: 0,
        show: false,
      },
      images: {
        original: null,
        blue: null,
        green: null,
        red: null,
        merge: null,
      },
      isClearing: false,
      isExporting: false,
      isSaving: false,
      item: Object.assign({}, this.props.item),
      loading: {
        blue: true,
        original: true,
        green: true,
        merge: true,
        red: true,
      },
      mergeOptions: {
        blue: false,
        green: false,
        red: false,
      },
      mergeOutOfDate: false,
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
    const body = {
      crop: this.getCropParams(),
    };
    DownloadImagePost(`image/channel/${this.props.item.files_id}/${channel}`, body, this.props.token)
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
  getCropParams = () => {
    return this.state.crop.height > 0 && this.state.crop.width > 0 ? {
      anchor: this.state.crop.anchor,
      height: this.state.crop.height,
      maxHeight: this.state.crop.maxHeight,
      maxWidth: this.state.crop.maxWidth,
      width: this.state.crop.width,
      x: this.state.crop.anchor.left ?
        this.state.crop.anchor.left
        :
        this.state.crop.maxWidth - this.state.crop.anchor.right - this.state.crop.width,
      y: this.state.crop.anchor.top ?
        this.state.crop.anchor.top
        :
        this.state.crop.maxHeight - this.state.crop.anchor.bottom - this.state.crop.height,
    }
    :
    {};
  }
  getFullColorImage = () => {
    if (this.props.item.files_id) {
      DownloadImage(`image/${this.props.item.files_id}`, this.props.token)
        .then((retrievedData) => {
          this.setState(({ brightness, contrast, images, mergeOptions }) => {
            // set merge options
            let newMergeOptions = Object.assign({}, mergeOptions);
            if (retrievedData.metadata.mergeOptions) {
              newMergeOptions = Object.assign({}, retrievedData.metadata.mergeOptions);
            } else {
              newMergeOptions.blue = Boolean(retrievedData.image.blue);
              newMergeOptions.green = Boolean(retrievedData.image.green);
              newMergeOptions.red = Boolean(retrievedData.image.red);
            }
            // set crop object
            const crop = this.storedCrop(retrievedData.metadata) ||
              Object.assign({}, reset.crop);
            return {
              brightness: Object.assign(
                {},
                brightness,
                retrievedData.metadata.brightness,
              ),
              contrast: Object.assign(
                {},
                contrast,
                retrievedData.metadata.contrast,
              ),
              crop,
              images: Object.assign(
                {},
                images,
                retrievedData.image
              ),
              loading: {
                blue: false,
                original: false,
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
  setCrop = () => {
    this.setState(({ crop }) => {
      return {
        crop: Object.assign(
          {},
          crop,
          {
            dragging: false,
          }
        ),
      };
    });
  }
  adjustCrop = (e) => {
    if (this.state.crop.dragging) {
      const isShiftPressed = e.shiftKey;
      const rect = e.target.getBoundingClientRect();
      const currPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      this.setState(({ crop }) => {
        const dim = {
          height: crop.anchor.top ?
            currPos.y - crop.anchor.top
            :
            rect.height - crop.anchor.bottom - currPos.y,
          width: crop.anchor.left ?
            currPos.x - crop.anchor.left
            :
            rect.width - crop.anchor.right - currPos.x,
        };
        const anchor = Object.assign({}, crop.anchor);
        // change vertical anchor if necessary
        if (
          dim.height < 0 &&
          crop.anchor.top
        ) {
          delete anchor.top;
          anchor.bottom = rect.height - currPos.y;
          dim.height = Math.abs(dim.height);
        } else if (
          dim.height < 0 &&
          crop.anchor.bottom
        ) {
          delete anchor.bottom;
          anchor.top = currPos.y;
          dim.height = Math.abs(dim.height);
        }
        // change horizontal anchor if necessary
        if (
          dim.width < 0 &&
          crop.anchor.left
        ) {
          delete anchor.left;
          anchor.right = rect.width - currPos.x;
          dim.width = Math.abs(dim.width);
        } else if (
          dim.width < 0 &&
          crop.anchor.right
        ) {
          delete anchor.right;
          anchor.left = currPos.x;
          dim.width = Math.abs(dim.width);
        }
        const newCrop = {
          anchor,
          height: isShiftPressed ? Math.max(dim.height, dim.width) : dim.height,
          width: isShiftPressed ? Math.max(dim.height, dim.width) : dim.width,
        };
        return {
          crop: Object.assign(
            {},
            crop,
            newCrop,
          ),
        };
      });
    }
  }
  applyCrop = (e, crop = null) => {
    if (
      this.state.crop.height &&
      this.state.crop.width &&
      (
        this.state.images.blue ||
        this.state.images.green ||
        this.state.images.merge ||
        this.state.images.red
      )
    ) {
      // get channels to crop
      const channels = {};
      Object.entries(this.state.images).forEach(([key, image]) => {
        if (
          key !== 'original' &&
          image
        ) {
          channels[key] = true;
        }
      });
      // create post body
      const body = {
        brightness: this.state.brightness,
        channels,
        contrast: this.state.contrast,
        crop: crop || this.getCropParams(),
        fileID: this.props.item.files_id,
        toMerge: this.state.mergeOptions,
      };
      // toggle loading state
      this.setState(({ loading }) => {
        const newLoading = Object.assign({}, loading);
        Object.keys(channels).forEach((channel) => {
          newLoading[channel] = true;
        });
        return {
          loading: newLoading,
        };
      });
      CropImages(
        `image/crop/${this.props.item.files_id}`,
        body,
        this.props.token
      )
        .then((image) => {
          this.setState(({ images, loading }) => {
            const newLoading = Object.assign({}, loading);
            Object.keys(channels).forEach((channel) => {
              newLoading[channel] = false;
            });
            return {
              images: Object.assign(
                {},
                images,
                image
              ),
              loading: newLoading,
              mergeOutOfDate: false,
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
        crop: Object.assign({}, reset.crop),
        dialog: Object.assign({}, reset.dialog),
        isClearing: true,
      });
      ClearImages(`image/${this.props.item.files_id}`, this.props.token)
        .then(() => {
          this.setState(({ images }) => {
            return {
              brightness: Object.assign({}, reset.brightness),
              contrast: Object.assign({}, reset.contrast),
              crop: Object.assign({}, reset.crop),
              images: {
                original: images.original,
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
    } else {
      this.setState({
        crop: Object.assign({}, reset.crop),
        dialog: Object.assign({}, reset.dialog),
      });
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
      dialog: Object.assign({}, reset.dialog),
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
  exportDialogOpen = () => {
    this.setState(({ dialog, exportOptions, images }) => {
      const newDialog = Object.assign({}, dialog);
      newDialog.export = true;
      newDialog.text = null;
      newDialog.title = 'Export';
      const newExportOptions = {
        channels: {
          blue: images.blue !== null,
          original: images.original !== null,
          green: images.green !== null,
          merge: images.merge !== null,
          red: images.red !== null,
        },
        greyscale: Object.assign({}, exportOptions.greyscale),
      };
      return {
        dialog: newDialog,
        exportOptions: newExportOptions,
      };
    });
  }
  exportImages = () => {
    this.setState({
      isExporting: true,
    });
    // get channels to export
    const channels = {};
    Object.entries(this.state.images).forEach(([key, image]) => {
      if (
        key !== 'original' &&
        image
      ) {
        channels[key] = true;
      }
    });
    // create post body
    const body = {
      brightness: this.state.brightness,
      channels,
      contrast: this.state.contrast,
      crop: this.getCropParams(),
      fileID: this.props.item.files_id,
      filename: `images_${this.props.item.name}`,
      greyscale: this.state.exportOptions.greyscale,
      toExport: this.state.exportOptions.channels,
      toMerge: this.state.mergeOptions,
    };
    ExportImage(`images_${this.props.item.name}`, body, this.props.token)
      .then(() => {
        this.setState({
          isExporting: false,
          dialog: Object.assign({}, reset.dialog),
        });
      })
      .catch((error) => {
        this.setState({
          errorDialog: {
            show: true,
            text: error.text,
            title: error.title,
          },
          isExporting: false,
        });
      })
    ;
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
  initializeCrop = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.setState({
      crop: {
        active: true,
        anchor: {
          left: x,
          top: y,
        },
        dragging: true,
        height: 0,
        maxHeight: rect.height,
        maxWidth: rect.width,
        width: 0,
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
        `image/merge/${this.props.item.files_id}`,
        {
          brightness: this.state.brightness,
          contrast: this.state.contrast,
          crop: this.getCropParams(),
          toMerge: this.state.mergeOptions,
        },
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
              mergeOutOfDate: false,
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
  resetCrop = () => {
    this.setState({
      crop: Object.assign(
        {},
        reset.crop,
        {
          active: true,
        }
      ),
    });
    this.applyCrop(null, {});
  }
  saveImages = () => {
    if (
      this.state.mergeOptions.blue ||
      this.state.mergeOptions.green ||
      this.state.mergeOptions.red
    ) {
      this.setState({
        isSaving: true,
      });
      const body = {
        brightness: this.state.brightness,
        channels: {
          blue: this.state.images.blue,
          green: this.state.images.green,
          merge: this.state.images.merge,
          red: this.state.images.red,
        },
        contrast: this.state.contrast,
        crop: this.getCropParams(),
        mergeOptions: this.state.mergeOptions,
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
    // don't show full color image when crop is active
    if (
      channel !== 'original' ||
      !this.state.crop.active
    ) {
      this.setState(({ images, item }) => {
        let carouselImages = [];
        Object.keys(images).forEach((key) => {
          let title;
          if (key === 'original') {
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
    const body = {
      crop: this.getCropParams(),
    };
    DownloadImagePost(`image/split/${this.props.item.files_id}`, body, this.props.token)
      .then((splitImages) => {
        this.setState(({ images }) => {
          return {
            brightness: Object.assign({}, reset.brightness),
            contrast: Object.assign({}, reset.contrast),
            images: Object.assign(
              {},
              images,
              splitImages
            ),
            loading: {
              blue: false,
              original: false,
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
  storedCrop = (metadata) => {
    // Check if channel images have crop object in metadata
    // They should all have the same, so just use the first
    if (
      metadata.crop &&
      !objectEmpty(metadata.crop)
    ) {
      const channels = Object.keys(metadata.crop);
      return Object.assign(
        {},
        metadata.crop[channels[0]],
        {
          active: true,
          dragging: false,
        }
      );
    }
    return false;
  }
  toggleChannelExport = (channel) => {
    this.setState(({ exportOptions }) => {
      const newChannelOptions = Object.assign({}, exportOptions.channels);
      newChannelOptions[channel] = !newChannelOptions[channel];
      return {
        exportOptions: {
          channels: newChannelOptions,
          greyscale: exportOptions.greyscale,
        },
      };
    });
  }
  toggleCrop = () => {
    this.setState(({ crop }) => {
      return {
        crop: Object.assign(
          {},
          crop,
          {
            active: !crop.active,
          }
        ),
      };
    });
  }
  toggleGreyscaleExport = (channel) => {
    this.setState(({ exportOptions }) => {
      const newGreyscaleOptions = Object.assign({}, exportOptions.greyscale);
      newGreyscaleOptions[channel] = !newGreyscaleOptions[channel];
      return {
        exportOptions: {
          channels: exportOptions.channels,
          greyscale: newGreyscaleOptions,
        },
      };
    });
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
  resetBrightnessContrast = (channel) => {
    this.changeBrightness(channel, 0);
    this.changeContrast(channel, 0);
    this.updateBrightContrast(channel, 0, 0);
  }
  updateBrightContrast = (channel, brightness = null, contrast = null) => {
    const validBV = (value) => {
      return value === 0 ||
        (value > 0 && value <= 1) ||
        (value < 0 && value >= -1)
      ;
    };
    const body = {
      brightness: validBV(brightness) ? brightness : this.state.brightness[channel],
      channel,
      contrast: validBV(contrast) ? contrast : this.state.contrast[channel],
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
            mergeOutOfDate: true,
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
          adjustCrop={ this.adjustCrop }
          applyCrop={ this.applyCrop }
          brightness={ this.state.brightness }
          canEdit={ this.props.canEdit }
          changeBrightness={ this.changeBrightness }
          changeCarouselIndex={ this.changeCarouselIndex }
          changeContrast={ this.changeContrast }
          clearImages={ this.clearImages }
          contrast={ this.state.contrast }
          crop={ this.state.crop }
          deleteSample={ this.deleteSample }
          dialog={ {
            clear: this.state.dialog.clear,
            close: this.dialogClose,
            delete: this.state.dialog.delete,
            export: this.state.dialog.export,
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
          exportDialogOpen={ this.exportDialogOpen }
          exportImages={ this.exportImages }
          exportOptions={ this.state.exportOptions }
          getChannelImage={ this.getChannelImage }
          imageDialog={ Object.assign(
            {},
            this.state.imageDialog,
            {
              close: this.imageDialogClose,
            }
          ) }
          images={ this.state.images }
          initializeCrop={ this.initializeCrop }
          inputChange={ this.inputChange }
          inputWidth={ this.props.inputWidth }
          isClearing={ this.state.isClearing }
          isExporting={ this.state.isExporting }
          isSaving={ this.state.isSaving }
          loading={ this.state.loading }
          mergeChannels={ this.mergeChannels }
          mergeOptions={ this.state.mergeOptions }
          mergeOutOfDate={ this.state.mergeOutOfDate }
          resetBrightnessContrast={ this.resetBrightnessContrast }
          resetCrop={ this.resetCrop }
          sample={ this.state.item }
          saveImages={ this.saveImages }
          setCrop={ this.setCrop }
          showImage={ this.showImage }
          snackbar={ this.state.snackbar }
          splitAll={ this.splitAll }
          toggleChannelExport={ this.toggleChannelExport }
          toggleCrop={ this.toggleCrop }
          toggleGreyscaleExport={ this.toggleGreyscaleExport }
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
