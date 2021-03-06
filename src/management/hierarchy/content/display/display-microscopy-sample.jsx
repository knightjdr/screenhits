import Checkbox from 'material-ui/Checkbox';
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import CircularProgress from 'material-ui/CircularProgress';
import ContentAdd from 'material-ui/svg-icons/content/add';
import DeleteForever from 'material-ui/svg-icons/action/delete-forever';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontAwesome from 'react-fontawesome';
import IconButton from 'material-ui/IconButton';
import HelpIcon from 'material-ui/svg-icons/action/help';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import Slider from 'material-ui/Slider';
import Snackbar from 'material-ui/Snackbar';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import RestoreIcon from 'material-ui/svg-icons/action/restore';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import UpdateIcon from 'material-ui/svg-icons/action/update';

import displayStyle from './display-style';
import Fields from '../../../../modules/fields';

const toggleStyle = {
  thumbOff: {
    backgroundColor: '#bdbdbd',
  },
  trackOff: {
    backgroundColor: '#9e9e9e',
  },
};

class DisplayMicroscopySample extends React.Component {
  channelHeader = () => {
    const header = (col, text) => {
      return (
        <div
          key={ `${text}-header` }
          style={ Object.assign(
            {},
            displayStyle.gridHeader,
            {
              backgroundColor: this.props.muiTheme.palette.keyColor,
              gridColumn: col,
            }
          ) }
        >
          { text }
        </div>
      );
    };
    return [
      header(1, 'Channel'),
      header(2, 'Wavelength'),
      header(3, 'Marker'),
      header(4, 'Antibody'),
      header(5, 'Dilution'),
    ];
  }
  confirmClear = () => {
    return (
    [
      <FlatButton
        backgroundColor={ this.props.muiTheme.palette.success }
        hoverColor={ this.props.muiTheme.palette.successHover }
        label="Confirm"
        onTouchTap={ () => { this.props.clearImages(); } }
      />,
    ]);
  }
  confirmDeletion = () => {
    return (
    [
      <FlatButton
        backgroundColor={ this.props.muiTheme.palette.success }
        hoverColor={ this.props.muiTheme.palette.successHover }
        label="Confirm"
        onTouchTap={ () => { this.props.deleteSample(this.props.sample._id); } }
      />,
    ]);
  }
  dialogClose = (label, closeFunc) => {
    return (
    [
      <FlatButton
        backgroundColor={ this.props.muiTheme.palette.warning }
        hoverColor={ this.props.muiTheme.palette.warningHover }
        label={ label }
        onTouchTap={ closeFunc }
        style={ {
          marginLeft: 10,
        } }
      />,
    ]);
  }
  displayElement = (sample, field, text) => {
    return sample[field] ?
      <div
        style={ displayStyle.elementContainer }
      >
        <div
          style={ Object.assign(
            {},
            displayStyle.elementKey,
            {
              backgroundColor: this.props.muiTheme.palette.keyColor,
              border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
            },
          ) }
        >
          <span>
            { text }:
          </span>
        </div>
        <div
          style={ displayStyle.elementValue }
        >
          { sample[field] }
        </div>
      </div>
      :
      null
    ;
  }
  exportImages = () => {
    return (
    [
      <FlatButton
        backgroundColor={ this.props.muiTheme.palette.success }
        hoverColor={ this.props.muiTheme.palette.successHover }
        label="Export"
        onTouchTap={ () => { this.props.exportImages(); } }
      />,
    ]);
  }
  exportImagesContent = (images, options) => {
    let currRow = 1;
    const imageOrder = ['original', 'blue', 'green', 'red', 'merge'];
    const headerStyle = Object.assign(
      {},
      displayStyle.gridHeader,
      {
        backgroundColor: this.props.muiTheme.palette.keyColor,
      }
    );
    return (
      <div
        style={ {
          display: 'grid',
          color: this.props.muiTheme.palette.textColor,
          gridColumnGap: 10,
          gridRowGap: 10,
          gridTemplateColumns: 'auto',
          gridTemplateRows: 'auto',
          justifyItems: 'center',
        } }
      >
        <div
          style={ Object.assign(
            {},
            headerStyle,
            {
              gridColumn: 1,
              gridRow: 1,
            }
          ) }
        >
          Channel
        </div>
        <div
          style={ Object.assign(
            {},
            headerStyle,
            {
              gridColumn: 2,
              gridRow: 1,
            }
          ) }
        >
          Greyscale
        </div>
        <div
          style={ Object.assign(
            {},
            headerStyle,
            {
              gridColumn: 3,
              gridRow: 1,
            }
          ) }
        >
          Export
        </div>
        {
          imageOrder.map((channel) => {
            if (images[channel]) {
              currRow += 1;
              return ([
                <div
                  key={ `channel-column-${channel}` }
                  style={ {
                    gridColumn: 1,
                    gridRow: currRow,
                  } }
                >
                  { channel }
                </div>,
                <div
                  key={ `greyscale-column-${channel}` }
                  style={ {
                    gridColumn: 2,
                    gridRow: currRow,
                  } }
                >
                  <Checkbox
                    checked={ options.greyscale[channel] }
                    onCheck={ () => { this.props.toggleGreyscaleExport(channel); } }
                  />
                </div>,
                <div
                  key={ `export-column-${channel}` }
                  style={ {
                    gridColumn: 3,
                    gridRow: currRow,
                  } }
                >
                  <Checkbox
                    checked={ options.channels[channel] }
                    onCheck={ () => { this.props.toggleChannelExport(channel); } }
                  />
                </div>,
              ]);
            }
            return null;
          })
        }
      </div>
    );
  }
  fillChannel = (color, channel, row) => {
    return [
      <div
        key={ `color-${color}` }
        style={ {
          gridColumn: 1,
          gridRow: row + 1,
          textAlign: 'center',
        } }
      >
        { color }
      </div>,
      <div
        key={ `wavelength-${color}` }
        style={ {
          gridColumn: 2,
          gridRow: row + 1,
          textAlign: 'center',
        } }
      >
        { channel.wavelength || '-' }
      </div>,
      <div
        key={ `marker-${color}` }
        style={ {
          gridColumn: 3,
          gridRow: row + 1,
          textAlign: 'center',
        } }
      >
        { channel.marker || '-' }
      </div>,
      <div
        key={ `antibody-${color}` }
        style={ {
          gridColumn: 4,
          gridRow: row + 1,
          textAlign: 'center',
        } }
      >
        { channel.antibody || '-' }
      </div>,
      <div
        key={ `dilution-${color}` }
        style={ {
          gridColumn: 5,
          gridRow: row + 1,
          textAlign: 'center',
        } }
      >
        { channel.dilution || '-' }
      </div>,
    ];
  }
  helpIconButton = (title, text) => {
    return (
      <IconButton
        onTouchTap={ () => {
          this.props.dialog.open(
            'help',
            `Help for the "${title}" field`,
            text
          );
        } }
        tooltip="Help"
        tooltipPosition="top-center"
      >
        <HelpIcon />
      </IconButton>
    );
  }
  imagePanelHeader = (text) => {
    return (
      <div
        key={ `${text}-header` }
        style={ Object.assign(
          {},
          displayStyle.gridHeader,
          {
            backgroundColor: this.props.muiTheme.palette.keyColor,
            marginBottom: 10,
          }
        ) }
      >
        { text }
      </div>
    );
  };
  imageDialogClose = () => {
    return (
    [
      <FlatButton
        backgroundColor={ this.props.muiTheme.palette.warning }
        hoverColor={ this.props.muiTheme.palette.warningHover }
        label="Close"
        onTouchTap={ this.props.imageDialog.close }
      />,
    ]);
  }
  imageDialogContent = (images, index = 0) => {
    const imageContent = images.length > 0 ?
      (
        <div
          style={ {
            maxHeight: 'calc(100vh - 180px)',
            maxWidth: 'calc(100vw - 150px)',
            overflowX: 'auto',
            overflowY: 'auto',
          } }
        >
          <img
            alt={ images[index].title }
            src={ images[index].image }
          />
        </div>
      )
      :
      null
    ;
    const imageTitle = (
      <div
        style={ {
          height: 20,
          marginBottom: 10,
          textAlign: 'center',
        } }
      >
        { images.length > 0 ? images[index].title : null }
      </div>
    );
    return (
      <div>
        { imageTitle }
        <div
          style={ {
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
          } }
        >
          {
            images.length > 1 &&
            <FloatingActionButton
              mini={ true }
              onTouchTap={ () => { this.props.changeCarouselIndex(-1); } }
              style={ {
                margin: '0 10px',
              } }
            >
              <ChevronLeft />
            </FloatingActionButton>
          }
          { imageContent }
          {
            images.length > 1 &&
            <FloatingActionButton
              mini={ true }
              onTouchTap={ () => { this.props.changeCarouselIndex(1); } }
              style={ {
                margin: '0 10px',
              } }
            >
              <ChevronRight />
            </FloatingActionButton>
          }
        </div>
      </div>
    );
  }
  imageOptions = () => {
    return (
      <div
        style={ {
          margin: 5,
        } }
      >
        { this.imagePanelHeader('Options') }
        <div
          style={ {
            alignItems: 'center',
            display: 'flex',
            height: 310,
            justifyContent: 'center',
            padding: 5,
            width: 310,
          } }
        >
          <div
            style={ {
              alignItems: 'center',
              display: 'grid',
              gridColumnGap: 10,
              gridRowGap: 10,
              gridTemplateColumns: 'auto',
              gridTemplateRows: '20px 50px 90px 20px 40px',
              justifyItems: 'center',
            } }
          >
            <div
              style={ Object.assign(
                {},
                displayStyle.gridHeader,
                {
                  gridColumn: 1,
                  gridRow: 1,
                  textDecoration: 'underline',
                }
              ) }
            >
              Channels
            </div>
            <div
              style={ {
                gridColumn: 1,
                gridRow: 2,
              } }
            >
              <FlatButton
                backgroundColor={ this.props.muiTheme.palette.buttonColor }
                hoverColor={ this.props.muiTheme.palette.buttonColorHover }
                label="Split all"
                onTouchTap={ () => { this.props.splitAll(); } }
              />
            </div>
            <div
              style={ {
                alignItems: 'center',
                display: 'flex',
                gridColumn: 1,
                gridRow: 3,
              } }
            >
              <div
                style={ {
                  display: 'flex',
                  flexDirection: 'column',
                  marginRight: 10,
                } }
              >
                <Toggle
                  label="B"
                  onToggle={ () => { this.props.toggleMerge('blue'); } }
                  thumbStyle={ toggleStyle.thumbOff }
                  thumbSwitchedStyle={ {
                    backgroundColor: this.props.muiTheme.palette.buttonColor,
                  } }
                  toggled={ this.props.mergeOptions.blue }
                  trackStyle={ toggleStyle.trackOff }
                  trackSwitchedStyle={ {
                    backgroundColor: this.props.muiTheme.palette.buttonColorHover,
                  } }
                />
                <Toggle
                  label="G"
                  onToggle={ () => { this.props.toggleMerge('green'); } }
                  thumbStyle={ toggleStyle.thumbOff }
                  thumbSwitchedStyle={ {
                    backgroundColor: this.props.muiTheme.palette.success,
                  } }
                  toggled={ this.props.mergeOptions.green }
                  trackStyle={ toggleStyle.trackOff }
                  trackSwitchedStyle={ {
                    backgroundColor: this.props.muiTheme.palette.successHover,
                  } }
                />
                <Toggle
                  label="R"
                  onToggle={ () => { this.props.toggleMerge('red'); } }
                  thumbStyle={ toggleStyle.thumbOff }
                  thumbSwitchedStyle={ {
                    backgroundColor: this.props.muiTheme.palette.warning,
                  } }
                  toggled={ this.props.mergeOptions.red }
                  trackStyle={ toggleStyle.trackOff }
                  trackSwitchedStyle={ {
                    backgroundColor: this.props.muiTheme.palette.warningHover,
                  } }
                />
              </div>
              <FlatButton
                backgroundColor={ this.props.muiTheme.palette.buttonColor }
                hoverColor={ this.props.muiTheme.palette.buttonColorHover }
                label="Merge"
                onTouchTap={ () => { this.props.mergeChannels(); } }
              />
            </div>
            <div
              style={ Object.assign(
                {},
                displayStyle.gridHeader,
                {
                  gridColumn: 2,
                  gridRow: 1,
                  textDecoration: 'underline',
                }
              ) }
            >
              Cropping
            </div>
            <div
              style={ {
                gridColumn: 2,
                gridRow: 2,
              } }
            >
              <Toggle
                label="Crop tool"
                onToggle={ this.props.toggleCrop }
                thumbStyle={ toggleStyle.thumbOff }
                thumbSwitchedStyle={ {
                  backgroundColor: this.props.muiTheme.palette.alternativeButtonColor,
                } }
                toggled={ this.props.crop.active }
                trackStyle={ toggleStyle.trackOff }
                trackSwitchedStyle={ {
                  backgroundColor: this.props.muiTheme.palette.alternativeButtonColorHover,
                } }
              />
            </div>
            <div
              style={ {
                gridColumn: 2,
                gridRow: 3,
              } }
            >
              <div
                style={ {
                  alignItems: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                } }
              >
                <FlatButton
                  backgroundColor={ this.props.muiTheme.palette.success }
                  hoverColor={ this.props.muiTheme.palette.successHover }
                  label="Apply"
                  onTouchTap={ this.props.applyCrop }
                  style={ {
                    marginBottom: 10,
                  } }
                />
                <FlatButton
                  backgroundColor={ this.props.muiTheme.palette.warning }
                  hoverColor={ this.props.muiTheme.palette.warningHover }
                  label="Reset"
                  onTouchTap={ this.props.resetCrop }
                />
              </div>
            </div>
            <div
              style={ Object.assign(
                {},
                displayStyle.gridHeader,
                {
                  textDecoration: 'underline',
                  gridColumn: '1 / 3',
                  gridRow: 4,
                }
              ) }
            >
              Images
            </div>
            <div
              style={ {
                display: 'flex',
                gridColumn: '1 / 3',
                gridRow: 5,
                justifyContent: 'center',
              } }
            >
              {
                this.props.canEdit &&
                <div
                  style={ {
                    textAlign: 'center',
                    width: 100,
                  } }
                >
                  {
                    this.props.isSaving ?
                      <div
                        style={ {
                          height: 36,
                        } }
                      >
                        <CircularProgress
                          size={ 30 }
                          thickness={ 3 }
                        />
                      </div>
                      : [
                        <FlatButton
                          backgroundColor={ this.props.muiTheme.palette.success }
                          data-tip={ true }
                          data-for="saveImages"
                          hoverColor={ this.props.muiTheme.palette.successHover }
                          label="Save"
                          key="SaveButton"
                          onTouchTap={ () => { this.props.saveImages(); } }
                        />,
                        <ReactTooltip
                          effect="solid"
                          id="saveImages"
                          key="SaveButtonTooltip"
                        >
                          Save all images and settings
                        </ReactTooltip>,
                      ]
                  }
                </div>

              }
              {
                this.props.canEdit &&
                <div
                  style={ {
                    textAlign: 'center',
                    width: 100,
                  } }
                >
                  {
                    this.props.isClearing ?
                      <div
                        style={ {
                          height: 36,
                        } }
                      >
                        <CircularProgress
                          size={ 30 }
                          thickness={ 3 }
                        />
                      </div>
                      :
                      <FlatButton
                        backgroundColor={ this.props.muiTheme.palette.warning }
                        hoverColor={ this.props.muiTheme.palette.warningHover }
                        label="Clear"
                        onTouchTap={ () => { this.props.dialog.open('clear'); } }
                      />
                  }
                </div>
              }
              <div
                style={ {
                  textAlign: 'center',
                  width: 100,
                } }
              >
                {
                  this.props.isExporting ?
                    <div
                      style={ {
                        height: 36,
                      } }
                    >
                      <CircularProgress
                        size={ 30 }
                        thickness={ 3 }
                      />
                    </div>
                    :
                    <FlatButton
                      backgroundColor={ this.props.muiTheme.palette.buttonColor }
                      hoverColor={ this.props.muiTheme.palette.buttonColorHover }
                      label="Export"
                      onTouchTap={ this.props.exportDialogOpen }
                    />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  showChannels = (channels) => {
    if (
      channels.blue &&
      (
        channels.blue.antibody ||
        channels.blue.dilution ||
        channels.blue.marker ||
        channels.blue.wavelength
      )
    ) {
      return true;
    } else if (
      channels.green &&
      (
        channels.green.antibody ||
        channels.green.dilution ||
        channels.green.marker ||
        channels.green.wavelength
      )
    ) {
      return true;
    } else if (
      channels.red &&
      (
        channels.red.antibody ||
        channels.red.dilution ||
        channels.red.marker ||
        channels.red.wavelength
      )
    ) {
      return true;
    }
    return false;
  }
  showImage = (altText, channel, image, loading) => {
    let content;
    if (
      !image &&
      loading
    ) {
      content = <CircularProgress />;
    } else if (
      image &&
      channel === 'original'
    ) {
      content = (
        <div
          style={ {
            alignSelf: 'flex-start',
            maxHeight: 300,
            position: 'relative',
          } }
        >
          <button
            onClick={ () => { this.props.showImage(channel); } }
            style={ displayStyle.noButton }
          >
            <img
              alt={ altText }
              draggable={ false }
              src={ image }
              style={ {
                cursor: 'zoom-in',
                display: 'block',
                maxHeight: 300,
                maxWidth: 300,
              } }
            />
          </button>
          {
            this.props.crop.active &&
            <button
              onMouseDown={ this.props.initializeCrop }
              onMouseMove={ this.props.adjustCrop }
              onMouseUp={ this.props.setCrop }
              style={ Object.assign(
                {},
                displayStyle.noButton,
                {
                  backgroundColor: 'transparent',
                  cursor: 'crosshair',
                  height: '100%',
                  left: 0,
                  position: 'absolute',
                  top: 0,
                  width: '100%',
                }
              ) }
            >
              <div
                style={ Object.assign(
                  {},
                  this.props.crop.anchor,
                  {
                    backgroundColor: 'transparent',
                    border: this.props.crop.height ? '1px dotted white' : 'none',
                    height: this.props.crop.height,
                    pointerEvents: 'none',
                    position: 'absolute',
                    width: this.props.crop.width,
                  }
                ) }
              />
            </button>
          }
        </div>
      );
    } else if (image) {
      content = (
        <div
          style={ {
            display: 'flex',
            flexDirection: 'column',
          } }
        >
          <div
            style={ {
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
              minHeight: 300,
              minWidth: 300,
            } }
          >
            <button
              onClick={ () => { this.props.showImage(channel); } }
              style={ Object.assign(
                {},
                displayStyle.noButton,
                {
                  position: 'relative',
                }
              ) }
            >
              <img
                alt={ altText }
                src={ image }
                style={ {
                  cursor: 'zoom-in',
                  display: 'block',
                  maxHeight: 300,
                  maxWidth: 300,
                } }
              />
              {
                loading &&
                <div
                  style={ {
                    left: '50%',
                    position: 'absolute',
                    top: 'calc(50% - 20px)',
                    transform: 'translate(-50%, calc(50% - 20px))',
                  } }
                >
                  <CircularProgress />
                </div>
              }
            </button>
          </div>
          <div
            style={ {
              alignItems: 'center',
              display: 'grid',
              gridTemplateColumns: '20px auto 55px',
              gridTemplateRows: '40px 40px',
              justifyItems: 'center',
              width: '100%',
            } }
          >
            <div
              style={ {
                justifySelf: 'start',
                gridColumn: 1,
                gridRow: 1,
                marginTop: 3,
              } }
            >
              B:
            </div>
            <div
              style={ {
                gridColumn: 2,
                gridRow: 1,
                justifySelf: 'stretch',
              } }
            >
              <Slider
                defaultValue={ 0 }
                max={ 1 }
                min={ -1 }
                onChange={ (e, value) => { this.props.changeBrightness(channel, value); } }
                sliderStyle={ {
                  margin: '10px 0 5px 0',
                } }
                value={ this.props.brightness[channel] }
              />
            </div>
            <div
              style={ {
                justifySelf: 'start',
                gridColumn: 1,
                gridRow: 2,
                marginTop: 3,
              } }
            >
              C:
            </div>
            <div
              style={ {
                gridColumn: 2,
                gridRow: 2,
                justifySelf: 'stretch',
              } }
            >
              <Slider
                defaultValue={ 0 }
                max={ 1 }
                min={ -1 }
                onChange={ (e, value) => { this.props.changeContrast(channel, value); } }
                sliderStyle={ {
                  margin: '10px 0 5px 0',
                } }
                value={ this.props.contrast[channel] }
              />
            </div>
            <div
              style={ {
                gridColumn: 3,
                gridRow: 1,
              } }
            >
              <IconButton
                onTouchTap={ () => { this.props.updateBrightContrast(channel); } }
                tooltip="Update brightness and contrast"
                tooltipPosition="top-center"
              >
                <UpdateIcon />
              </IconButton>
            </div>
            <div
              style={ {
                gridColumn: 3,
                gridRow: 2,
              } }
            >
              <IconButton
                onTouchTap={ () => { this.props.resetBrightnessContrast(channel); } }
                tooltip="Reset brightness and contrast"
                tooltipPosition="bottom-center"
              >
                <RestoreIcon />
              </IconButton>
            </div>
          </div>
        </div>
      );
    } else {
      content = ([
        <FloatingActionButton
          data-for={ `channel${channel}Button` }
          data-tip={ true }
          key="channelFab"
          mini={ true }
          onTouchTap={ () => { this.props.getChannelImage(channel); } }
        >
          <ContentAdd />
        </FloatingActionButton>,
        <ReactTooltip
          effect="solid"
          id={ `channel${channel}Button` }
          key="channelTooltip"
        >
          { `Split ${channel} channel` }
        </ReactTooltip>,
      ]);
    }
    return (
      <div
        style={ {
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          margin: 5,
        } }
      >
        { this.imagePanelHeader(altText) }
        <div
          style={ {
            alignItems: 'center',
            backgroundColor: '#e0e0e0',
            display: 'flex',
            height: 'auto',
            justifyContent: 'center',
            minHeight: 304,
            padding: 5,
            width: 310,
          } }
        >
          { content }
        </div>
      </div>
    );
  }
  showMerge = (image, loading) => {
    let content;
    if (loading) {
      content = <CircularProgress />;
    } else if (image) {
      content = (
        <div
          style={ {
            display: 'flex',
            flexDirection: 'column',
          } }
        >
          <button
            onClick={ () => { this.props.showImage('merge'); } }
            style={ displayStyle.noButton }
          >
            <img
              alt="Merge"
              src={ image }
              style={ {
                cursor: 'zoom-in',
                maxHeight: 300,
                maxWidth: 300,
              } }
            />
          </button>
          {
            this.props.mergeOutOfDate &&
            <div
              style={ {
                color: this.props.muiTheme.palette.warning,
                fontSize: 12,
                padding: 5,
              } }
            >
              <FontAwesome name="exclamation-triangle " /> Merge is not in sync
              with channels. Click merge button under options to update.
            </div>
          }
        </div>
      );
    } else {
      content = (
        <div>
          Merge
        </div>
      );
    }
    return (
      <div
        style={ {
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          margin: 5,
        } }
      >
        { this.imagePanelHeader('Merge') }
        <div
          style={ {
            alignItems: 'center',
            backgroundColor: '#e0e0e0',
            display: 'flex',
            height: 'auto',
            justifyContent: 'center',
            minHeight: 304,
            padding: 5,
            width: 310,
          } }
        >
          { content }
        </div>
      </div>
    );
  }
  render() {
    return (
      <div>
        { !this.props.edit &&
          <div>
            { this.displayElement(this.props.sample, 'name', 'name') }
            { this.displayElement(this.props.sample, 'replicate', 'Replicate') }
            { this.displayElement(this.props.sample, 'concentration', 'Concentration') }
            { this.displayElement(this.props.sample, 'timepoint', 'Timepoint') }
            { this.displayElement(this.props.sample, 'microscope', 'Microscope') }
            { this.displayElement(this.props.sample, 'objective', 'Objective') }
            { this.displayElement(this.props.sample, 'digitalZoom', 'Digital zoom') }
            { this.displayElement(this.props.sample, 'comment', 'Comment') }
            { this.displayElement(this.props.sample, 'creatorName', 'Creator') }
            { this.displayElement(this.props.sample, 'creationDate', 'Creation date') }
            {
              this.showChannels(this.props.sample.channels) &&
              <div
                style={ displayStyle.elementContainer }
              >
                <div
                  style={ Object.assign(
                    {},
                    displayStyle.elementKey,
                    {
                      backgroundColor: this.props.muiTheme.palette.keyColor,
                      border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                    },
                  ) }
                >
                  <span>
                    Channels:
                  </span>
                </div>
                <div
                  style={ displayStyle.elementValue }
                >
                  <div
                    style={ Object.assign(
                      {},
                      displayStyle.elementValue,
                      {
                        display: 'grid',
                        gridColumnGap: 10,
                        gridRowGap: 10,
                        gridTemplateColumns: 'auto',
                      }
                    ) }
                  >
                    { this.channelHeader() }
                    { this.fillChannel('blue', this.props.sample.channels.blue, 1) }
                    { this.fillChannel('green', this.props.sample.channels.green, 2) }
                    { this.fillChannel('red', this.props.sample.channels.red, 3) }
                  </div>
                </div>
              </div>
            }
            {
              this.props.images.original &&
              <div
                style={ {
                  display: 'flex',
                  flexWrap: 'wrap',
                  padding: 5,
                } }
              >
                { this.showImage(
                  'Original',
                  'original',
                  this.props.images.original,
                  this.props.loading.original
                ) }
                { this.showImage('Blue', 'blue', this.props.images.blue, this.props.loading.blue) }
                { this.showImage('Green', 'green', this.props.images.green, this.props.loading.green) }
                { this.showImage('Red', 'red', this.props.images.red, this.props.loading.red) }
                { this.showMerge(this.props.images.merge, this.props.loading.merge) }
                { this.imageOptions() }
              </div>
            }
            <div
              style={ displayStyle.deleteContainer }
            >
              {
                this.props.canEdit &&
                <IconButton
                  iconStyle={ {
                    color: this.props.muiTheme.palette.warning,
                  } }
                  onTouchTap={ () => { this.props.dialog.open('delete'); } }
                  tooltip="Delete sample"
                  tooltipPosition="bottom-left"
                >
                  <DeleteForever />
                </IconButton>
              }
            </div>
          </div>
        }
        { this.props.edit &&
          <div
            style={ displayStyle.container }
          >
            <TextField
              errorText={ this.props.errors.name }
              floatingLabelText="Sample name (short)"
              fullWidth={ true }
              multiLine={ true }
              onChange={ (e) => { this.props.inputChange('name', e.target.value); } }
              rows={ 1 }
              rowsMax={ 2 }
              style={ displayStyle.input }
              value={ this.props.sample.name }
            />
            <div
              style={ Object.assign(
                {},
                displayStyle.inputWithHelp,
                {
                  width: this.props.inputWidth,
                },
              ) }
            >
              <TextField
                errorText={ this.props.errors.replicate }
                floatingLabelText="Replicate"
                fullWidth={ true }
                multiLine={ true }
                onChange={ (e) => { this.props.inputChange('replicate', e.target.value); } }
                rows={ 1 }
                rowsMax={ 2 }
                style={ displayStyle.inputWithHelpInput }
                value={ this.props.sample.replicate }
              />
              { this.helpIconButton('Replicate', Fields.sample.replicate.help) }
            </div>
            <div
              style={ Object.assign(
                {},
                displayStyle.inputWithHelp,
                {
                  width: this.props.inputWidth,
                },
              ) }
            >
              <TextField
                floatingLabelText="Concentration"
                fullWidth={ true }
                multiLine={ true }
                onChange={ (e) => { this.props.inputChange('concentration', e.target.value); } }
                rows={ 1 }
                rowsMax={ 2 }
                style={ displayStyle.inputWithHelpInput }
                value={ this.props.sample.concentration }
              />
              { this.helpIconButton('Concentration', Fields.sample.concentration.help) }
            </div>
            <div
              style={ Object.assign(
                {},
                displayStyle.inputWithHelp,
                {
                  width: this.props.inputWidth,
                },
              ) }
            >
              <TextField
                floatingLabelText="Timepoint"
                fullWidth={ true }
                multiLine={ true }
                onChange={ (e) => { this.props.inputChange('timepoint', e.target.value); } }
                rows={ 1 }
                rowsMax={ 2 }
                style={ displayStyle.inputWithHelpInput }
                value={ this.props.sample.timepoint }
              />
              { this.helpIconButton('Time point', Fields.sample.timepoint.help) }
            </div>
            <div
              style={ Object.assign(
                {},
                displayStyle.inputWithHelp,
                {
                  width: this.props.inputWidth,
                },
              ) }
            >
              <TextField
                floatingLabelText="Microscope"
                fullWidth={ true }
                multiLine={ true }
                onChange={ (e) => { this.props.inputChange('microscope', e.target.value); } }
                rows={ 1 }
                rowsMax={ 2 }
                style={ displayStyle.inputWithHelpInput }
                value={ this.props.sample.microscope }
              />
              { this.helpIconButton('Microscope', Fields.sample.microscope.help) }
            </div>
            <div
              style={ Object.assign(
                {},
                displayStyle.inputWithHelp,
                {
                  width: this.props.inputWidth,
                },
              ) }
            >
              <TextField
                floatingLabelText="Objective"
                fullWidth={ true }
                multiLine={ true }
                onChange={ (e) => { this.props.inputChange('objective', e.target.value); } }
                rows={ 1 }
                rowsMax={ 2 }
                style={ displayStyle.inputWithHelpInput }
                value={ this.props.sample.objective }
              />
              { this.helpIconButton('Objective', Fields.sample.objective.help) }
            </div>
            <div
              style={ Object.assign(
                {},
                displayStyle.inputWithHelp,
                {
                  width: this.props.inputWidth,
                },
              ) }
            >
              <TextField
                floatingLabelText="Digital zoom"
                fullWidth={ true }
                multiLine={ true }
                onChange={ (e) => { this.props.inputChange('digitalZoom', e.target.value); } }
                rows={ 1 }
                rowsMax={ 2 }
                style={ displayStyle.inputWithHelpInput }
                value={ this.props.sample.digitalZoom }
              />
              { this.helpIconButton('Digital zoom', Fields.sample.digitalZoom.help) }
            </div>
            <TextField
              floatingLabelText="Comments (optional)"
              fullWidth={ true }
              multiLine={ true }
              onChange={ (e) => { this.props.inputChange('comment', e.target.value); } }
              rows={ 1 }
              rowsMax={ 5 }
              style={ displayStyle.input }
              value={ this.props.sample.comment }
            />
            <div
              style={ {
                marginTop: 20,
              } }
            >
              Channels
              <div
                style={ {
                  alignItems: 'center',
                  display: 'flex',
                  marginLeft: 10,
                } }
              >
                <div
                  style={ {
                    flexBasis: 50,
                    flexGrow: 0,
                    flexShrink: 0,
                    marginRight: 15,
                    marginTop: 25,
                    textAlign: 'right',
                  } }
                >
                  Blue:
                </div>
                <TextField
                  floatingLabelText="Wavelength"
                  fullWidth={ true }
                  onChange={ (e) => { this.props.updateChannel('blue', 'wavelength', Number(e.target.value)); } }
                  style={ displayStyle.input }
                  type="number"
                  value={ this.props.sample.channels.blue.wavelength || '' }
                />
                <TextField
                  floatingLabelText="Marker"
                  fullWidth={ true }
                  onChange={ (e) => { this.props.updateChannel('blue', 'marker', e.target.value); } }
                  style={ displayStyle.input }
                  type="text"
                  value={ this.props.sample.channels.blue.marker || '' }
                />
                <TextField
                  floatingLabelText="Antibody"
                  fullWidth={ true }
                  onChange={ (e) => { this.props.updateChannel('blue', 'antibody', e.target.value); } }
                  style={ displayStyle.input }
                  type="text"
                  value={ this.props.sample.channels.blue.antibody || '' }
                />
                <TextField
                  floatingLabelText="Dilution"
                  fullWidth={ true }
                  onChange={ (e) => { this.props.updateChannel('blue', 'dilution', e.target.value); } }
                  style={ displayStyle.input }
                  type="text"
                  value={ this.props.sample.channels.blue.dilution || '' }
                />
              </div>
              <div
                style={ {
                  alignItems: 'center',
                  display: 'flex',
                  marginLeft: 10,
                } }
              >
                <div
                  style={ {
                    flexBasis: 50,
                    flexGrow: 0,
                    flexShrink: 0,
                    marginRight: 15,
                    marginTop: 25,
                    textAlign: 'right',
                  } }
                >
                  Green:
                </div>
                <TextField
                  floatingLabelText="Wavelength"
                  fullWidth={ true }
                  onChange={ (e) => { this.props.updateChannel('green', 'wavelength', Number(e.target.value)); } }
                  style={ displayStyle.input }
                  type="number"
                  value={ this.props.sample.channels.green.wavelength || '' }
                />
                <TextField
                  floatingLabelText="Marker"
                  fullWidth={ true }
                  onChange={ (e) => { this.props.updateChannel('green', 'marker', e.target.value); } }
                  style={ displayStyle.input }
                  type="text"
                  value={ this.props.sample.channels.green.marker || '' }
                />
                <TextField
                  floatingLabelText="Antibody"
                  fullWidth={ true }
                  onChange={ (e) => { this.props.updateChannel('green', 'antibody', e.target.value); } }
                  style={ displayStyle.input }
                  type="text"
                  value={ this.props.sample.channels.green.antibody || '' }
                />
                <TextField
                  floatingLabelText="Dilution"
                  fullWidth={ true }
                  onChange={ (e) => { this.props.updateChannel('green', 'dilution', e.target.value); } }
                  style={ displayStyle.input }
                  type="text"
                  value={ this.props.sample.channels.green.dilution || '' }
                />
              </div>
              <div
                style={ {
                  alignItems: 'center',
                  display: 'flex',
                  marginLeft: 10,
                } }
              >
                <div
                  style={ {
                    flexBasis: 50,
                    flexGrow: 0,
                    flexShrink: 0,
                    marginRight: 15,
                    marginTop: 25,
                    textAlign: 'right',
                  } }
                >
                  Red:
                </div>
                <TextField
                  floatingLabelText="Wavelength"
                  fullWidth={ true }
                  onChange={ (e) => { this.props.updateChannel('red', 'wavelength', Number(e.target.value)); } }
                  style={ displayStyle.input }
                  type="number"
                  value={ this.props.sample.channels.red.wavelength || '' }
                />
                <TextField
                  floatingLabelText="Marker"
                  fullWidth={ true }
                  onChange={ (e) => { this.props.updateChannel('red', 'marker', e.target.value); } }
                  style={ displayStyle.input }
                  type="text"
                  value={ this.props.sample.channels.red.marker || '' }
                />
                <TextField
                  floatingLabelText="Antibody"
                  fullWidth={ true }
                  onChange={ (e) => { this.props.updateChannel('red', 'antibody', e.target.value); } }
                  style={ displayStyle.input }
                  type="text"
                  value={ this.props.sample.channels.red.antibody || '' }
                />
                <TextField
                  floatingLabelText="Dilution"
                  fullWidth={ true }
                  onChange={ (e) => { this.props.updateChannel('red', 'dilution', e.target.value); } }
                  style={ displayStyle.input }
                  type="text"
                  value={ this.props.sample.channels.red.dilution || '' }
                />
              </div>
            </div>
          </div>
        }
        <Dialog
          actions={ [
            this.confirmDeletion(),
            this.dialogClose('Close', this.props.dialog.close),
          ] }
          modal={ false }
          onRequestClose={ this.props.dialog.close }
          open={ this.props.dialog.delete }
          title="Confirmation"
        >
          This action will permanently delete the sample. Press confirm to proceed.
        </Dialog>
        <Dialog
          actions={ [
            this.confirmClear(),
            this.dialogClose('Close', this.props.dialog.close),
          ] }
          modal={ false }
          onRequestClose={ this.props.dialog.close }
          open={ this.props.dialog.clear }
          title="Confirmation"
        >
          This action will permanently remove images in the red, green, blue and
          merged channels from the database and all settings will be returned to defaults.
        </Dialog>
        <Dialog
          actions={ this.dialogClose('Close', this.props.dialog.close) }
          modal={ false }
          onRequestClose={ this.props.dialog.close }
          open={ this.props.dialog.help }
          title={ this.props.dialog.title }
        >
          { this.props.dialog.text }
        </Dialog>
        <Dialog
          actions={ this.dialogClose('Close', this.props.errorDialog.close) }
          modal={ false }
          onRequestClose={ this.props.errorDialog.close }
          open={ this.props.errorDialog.show }
          title={ this.props.errorDialog.title }
        >
          { this.props.errorDialog.text }
        </Dialog>
        <Dialog
          actions={ this.imageDialogClose(null, this.props.imageDialog.close) }
          autoDetectWindowHeight={ false }
          contentStyle={ {
            maxWidth: 'calc(100vw - 20px)',
            transform: 'translateY(20)',
            width: 'auto',
          } }
          modal={ false }
          onRequestClose={ this.props.imageDialog.close }
          open={ this.props.imageDialog.show }
          overlayStyle={ {
            backgroundColor: 'none',
          } }
          style={ {
            height: 'calc(100vh-20px)',
            left: '50%',
            paddingTop: 0,
            transform: 'translateX(-50%)',
            width: 'auto',
          } }
        >
          {
            this.imageDialogContent(
              this.props.imageDialog.images,
              this.props.imageDialog.index
            )
          }
        </Dialog>
        <Dialog
          actions={ [
            this.exportImages(),
            this.dialogClose('Cancel', this.props.dialog.close),
          ] }
          contentStyle={ {
            width: 'auto',
          } }
          modal={ false }
          onRequestClose={ this.props.dialog.close }
          open={ this.props.dialog.export }
          title={ this.props.dialog.title }
        >
          { this.exportImagesContent(this.props.images, this.props.exportOptions) }
        </Dialog>
        <Snackbar
          autoHideDuration={ this.props.snackbar.duration }
          message={ this.props.snackbar.message }
          open={ this.props.snackbar.open }
          onRequestClose={ this.props.snackbar.close }
        />
      </div>
    );
  }
}

DisplayMicroscopySample.propTypes = {
  adjustCrop: PropTypes.func.isRequired,
  applyCrop: PropTypes.func.isRequired,
  brightness: PropTypes.shape({
    blue: PropTypes.number,
    green: PropTypes.number,
    merge: PropTypes.number,
    red: PropTypes.number,
  }).isRequired,
  canEdit: PropTypes.bool.isRequired,
  changeBrightness: PropTypes.func.isRequired,
  changeCarouselIndex: PropTypes.func.isRequired,
  changeContrast: PropTypes.func.isRequired,
  clearImages: PropTypes.func.isRequired,
  contrast: PropTypes.shape({
    blue: PropTypes.number,
    green: PropTypes.number,
    merge: PropTypes.number,
    red: PropTypes.number,
  }).isRequired,
  crop: PropTypes.shape({
    active: PropTypes.bool,
    anchor: PropTypes.shape({}),
    height: PropTypes.number,
    width: PropTypes.number,
  }).isRequired,
  deleteSample: PropTypes.func.isRequired,
  dialog: PropTypes.shape({
    clear: PropTypes.bool,
    close: PropTypes.func,
    delete: PropTypes.bool,
    export: PropTypes.bool,
    help: PropTypes.bool,
    open: PropTypes.func,
    text: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  edit: PropTypes.bool.isRequired,
  errorDialog: PropTypes.shape({
    close: PropTypes.func,
    show: PropTypes.bool,
    text: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  exportDialogOpen: PropTypes.func.isRequired,
  exportOptions: PropTypes.shape({
    channels: PropTypes.shape({
      original: PropTypes.bool,
      blue: PropTypes.bool,
      green: PropTypes.bool,
      merge: PropTypes.bool,
      red: PropTypes.bool,
    }),
    greyscale: PropTypes.shape({
      original: PropTypes.bool,
      blue: PropTypes.bool,
      green: PropTypes.bool,
      merge: PropTypes.bool,
      red: PropTypes.bool,
    }),
  }).isRequired,
  errors: PropTypes.shape({
    name: PropTypes.string,
    replicate: PropTypes.string,
  }).isRequired,
  exportImages: PropTypes.func.isRequired,
  getChannelImage: PropTypes.func.isRequired,
  imageDialog: PropTypes.shape({
    close: PropTypes.func,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        image: PropTypes.string,
        title: PropTypes.string,
      }),
    ),
    index: PropTypes.number,
    show: PropTypes.bool,
  }).isRequired,
  images: PropTypes.shape({
    blue: PropTypes.string,
    original: PropTypes.string,
    green: PropTypes.string,
    merge: PropTypes.string,
    red: PropTypes.string,
  }).isRequired,
  initializeCrop: PropTypes.func.isRequired,
  inputChange: PropTypes.func.isRequired,
  inputWidth: PropTypes.number.isRequired,
  isClearing: PropTypes.bool.isRequired,
  isExporting: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  loading: PropTypes.shape({
    blue: PropTypes.bool,
    original: PropTypes.bool,
    green: PropTypes.bool,
    merge: PropTypes.bool,
    red: PropTypes.bool,
  }).isRequired,
  mergeChannels: PropTypes.func.isRequired,
  mergeOptions: PropTypes.shape({
    blue: PropTypes.bool,
    green: PropTypes.bool,
    red: PropTypes.bool,
  }).isRequired,
  mergeOutOfDate: PropTypes.bool.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      accent4Color: PropTypes.string,
      alternativeButtonColor: PropTypes.string,
      alternativeButtonColorHover: PropTypes.string,
      buttonColor: PropTypes.string,
      buttonColorHover: PropTypes.string,
      keyColor: PropTypes.string,
      keyColorBorder: PropTypes.string,
      offWhite: PropTypes.string,
      primary3Color: PropTypes.string,
      primary4Color: PropTypes.string,
      success: PropTypes.string,
      successHover: PropTypes.string,
      textColor: PropTypes.string,
      warning: PropTypes.string,
      warningHover: PropTypes.string,
    }),
  }).isRequired,
  resetBrightnessContrast: PropTypes.func.isRequired,
  resetCrop: PropTypes.func.isRequired,
  sample: PropTypes.shape({
    _id: PropTypes.number,
    channels: PropTypes.shape({
      blue: PropTypes.shape({
        antibody: PropTypes.string,
        dilution: PropTypes.string,
        marker: PropTypes.string,
        wavelength: PropTypes.number,
      }),
      green: PropTypes.shape({
        antibody: PropTypes.string,
        dilution: PropTypes.string,
        marker: PropTypes.string,
        wavelength: PropTypes.number,
      }),
      red: PropTypes.shape({
        antibody: PropTypes.string,
        dilution: PropTypes.string,
        marker: PropTypes.string,
        wavelength: PropTypes.number,
      }),
    }),
    comment: PropTypes.string,
    concentration: PropTypes.string,
    creatorEmail: PropTypes.string,
    creatorName: PropTypes.string,
    description: PropTypes.string,
    digitalZoom: PropTypes.string,
    microscope: PropTypes.string,
    name: PropTypes.string,
    objective: PropTypes.string,
    replicate: PropTypes.string,
    timepoint: PropTypes.string,
    creationDate: PropTypes.string,
    updateDate: PropTypes.string,
  }).isRequired,
  saveImages: PropTypes.func.isRequired,
  setCrop: PropTypes.func.isRequired,
  showImage: PropTypes.func.isRequired,
  snackbar: PropTypes.shape({
    close: PropTypes.func,
    duration: PropTypes.number,
    message: PropTypes.string,
    open: PropTypes.bool,
  }).isRequired,
  splitAll: PropTypes.func.isRequired,
  toggleChannelExport: PropTypes.func.isRequired,
  toggleCrop: PropTypes.func.isRequired,
  toggleGreyscaleExport: PropTypes.func.isRequired,
  toggleMerge: PropTypes.func.isRequired,
  updateBrightContrast: PropTypes.func.isRequired,
  updateChannel: PropTypes.func.isRequired,
};

export default muiThemeable()(DisplayMicroscopySample);
