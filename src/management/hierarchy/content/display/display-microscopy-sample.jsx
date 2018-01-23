import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import CircularProgress from 'material-ui/CircularProgress';
import ContentAdd from 'material-ui/svg-icons/content/add';
import DeleteForever from 'material-ui/svg-icons/action/delete-forever';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import HelpIcon from 'material-ui/svg-icons/action/help';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from 'material-ui/TextField';

import displayStyle from './display-style';
import Fields from '../../../../modules/fields';

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
  dialogClose = () => {
    return (
    [
      <FlatButton
        backgroundColor={ this.props.muiTheme.palette.warning }
        hoverColor={ this.props.muiTheme.palette.warningHover }
        label="Close"
        onTouchTap={ this.props.dialog.close }
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
  errorDialogClose = () => {
    return (
    [
      <FlatButton
        backgroundColor={ this.props.muiTheme.palette.warning }
        hoverColor={ this.props.muiTheme.palette.warningHover }
        label="Close"
        onTouchTap={ this.props.errorDialog.close }
      />,
    ]);
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
        <img
          alt={ images[index].title }
          src={ images[index].image }
        />
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
                margin: 20,
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
                margin: 20,
              } }
            >
              <ChevronRight />
            </FloatingActionButton>
          }
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
    if (loading) {
      content = <CircularProgress />;
    } else if (image) {
      content = (
        <button
          onClick={ () => { this.props.showImage(channel); } }
          style={ displayStyle.noButton }
        >
          <img
            alt={ altText }
            src={ image }
            style={ {
              cursor: 'zoom-in',
              maxHeight: 300,
              maxWidth: 300,
            } }
          />
        </button>
      );
    } else {
      content = (
        <FloatingActionButton
          mini={ true }
          onTouchTap={ () => { this.props.getChannelImage(channel); } }
        >
          <ContentAdd />
        </FloatingActionButton>
      );
    }
    const header = (text) => {
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
    return (
      <div
        style={ {
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          margin: 5,
        } }
      >
        { header(altText) }
        <div
          style={ {
            alignItems: 'center',
            backgroundColor: '#e0e0e0',
            display: 'flex',
            height: 310,
            justifyContent: 'center',
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
              this.props.images.fullColor &&
              <div
                style={ {
                  display: 'flex',
                  flexWrap: 'wrap',
                  padding: 5,
                } }
              >
                { this.showImage(
                  'Full color',
                  'fullColor',
                  this.props.images.fullColor,
                  this.props.loading.fullColor
                ) }
                { this.showImage('Blue', 'blue', this.props.images.blue, this.props.loading.blue) }
                { this.showImage('Green', 'green', this.props.images.green, this.props.loading.green) }
                { this.showImage('Red', 'red', this.props.images.red, this.props.loading.red) }
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
              <IconButton
                onTouchTap={ () => {
                  this.props.dialog.open('help', 'Help for the "Replicate" field', Fields.sample.replicate.help);
                } }
                tooltip="Help"
                tooltipPosition="top-center"
              >
                <HelpIcon />
              </IconButton>
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
                floatingLabelText="Concentration (optional)"
                fullWidth={ true }
                multiLine={ true }
                onChange={ (e) => { this.props.inputChange('concentration', e.target.value); } }
                rows={ 1 }
                rowsMax={ 2 }
                style={ displayStyle.inputWithHelpInput }
                value={ this.props.sample.concentration }
              />
              <IconButton
                onTouchTap={ () => {
                  this.props.dialog.open('help', 'Help for the "Concentration" field', Fields.sample.concentration.help);
                } }
                tooltip="Help"
                tooltipPosition="top-center"
              >
                <HelpIcon />
              </IconButton>
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
                floatingLabelText="Timepoint (optional)"
                fullWidth={ true }
                multiLine={ true }
                onChange={ (e) => { this.props.inputChange('timepoint', e.target.value); } }
                rows={ 1 }
                rowsMax={ 2 }
                style={ displayStyle.inputWithHelpInput }
                value={ this.props.sample.timepoint }
              />
              <IconButton
                onTouchTap={ () => {
                  this.props.dialog.open('help', 'Help for the "Time point" field', Fields.sample.timepoint.help);
                } }
                tooltip="Help"
                tooltipPosition="top-center"
              >
                <HelpIcon />
              </IconButton>
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
          </div>
        }
        <Dialog
          actions={ [
            this.confirmDeletion(),
            this.dialogClose(),
          ] }
          modal={ false }
          onRequestClose={ this.props.dialog.close }
          open={ this.props.dialog.delete }
          title="Confirmation"
        >
          This action will permanently delete the sample. Press confirm to proceed.
        </Dialog>
        <Dialog
          actions={ this.dialogClose() }
          modal={ false }
          onRequestClose={ this.props.dialog.close }
          open={ this.props.dialog.help }
          title={ this.props.dialog.title }
        >
          { this.props.dialog.text }
        </Dialog>
        <Dialog
          actions={ this.errorDialogClose() }
          modal={ false }
          onRequestClose={ this.props.errorDialog.close }
          open={ this.props.errorDialog.show }
          title={ this.props.errorDialog.title }
        >
          { this.props.errorDialog.text }
        </Dialog>
        <Dialog
          actions={ this.imageDialogClose() }
          contentStyle={ {
            width: 'auto',
          } }
          modal={ false }
          onRequestClose={ this.props.imageDialog.close }
          open={ this.props.imageDialog.show }
        >
          {
            this.imageDialogContent(
              this.props.imageDialog.images,
              this.props.imageDialog.index
            )
          }
        </Dialog>
      </div>
    );
  }
}

DisplayMicroscopySample.propTypes = {
  canEdit: PropTypes.bool.isRequired,
  changeCarouselIndex: PropTypes.func.isRequired,
  deleteSample: PropTypes.func.isRequired,
  dialog: PropTypes.shape({
    close: PropTypes.func,
    delete: PropTypes.bool,
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
  errors: PropTypes.shape({
    name: PropTypes.string,
    replicate: PropTypes.string,
  }).isRequired,
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
    fullColor: PropTypes.string,
    green: PropTypes.string,
    red: PropTypes.string,
  }).isRequired,
  inputChange: PropTypes.func.isRequired,
  inputWidth: PropTypes.number.isRequired,
  loading: PropTypes.shape({
    blue: PropTypes.bool,
    fullColor: PropTypes.bool,
    green: PropTypes.bool,
    red: PropTypes.bool,
  }).isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      buttonColor: PropTypes.string,
      buttonColorHover: PropTypes.string,
      keyColor: PropTypes.string,
      keyColorBorder: PropTypes.string,
      offWhite: PropTypes.string,
      primary3Color: PropTypes.string,
      primary4Color: PropTypes.string,
      success: PropTypes.string,
      successHover: PropTypes.string,
      warning: PropTypes.string,
      warningHover: PropTypes.string,
    }),
  }).isRequired,
  sample: PropTypes.shape({
    _id: PropTypes.number,
    channels: PropTypes.shape({
      blue: PropTypes.shape({}),
      green: PropTypes.shape({}),
      red: PropTypes.shape({}),
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
  showImage: PropTypes.func.isRequired,
};

export default muiThemeable()(DisplayMicroscopySample);
