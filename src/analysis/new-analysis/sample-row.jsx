import Cached from 'material-ui/svg-icons/action/cached';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import Radium from 'radium';
import React from 'react';
import ReactTooltip from 'react-tooltip';

import Tooltip from '../../tooltip/tooltip-container';

// style
const buttonContainer = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  paddingBottom: 10,
  paddingLeft: 10,
  width: 'auto',
};
const cellStyle = {
  borderRadius: 2,
  cursor: 'pointer',
  height: 30,
  maxWidth: 400,
  minWidth: 200,
  overflow: 'hidden',
  padding: 5,
  position: 'relative',
  textAlign: 'left',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  width: '40vw',
  ':focus': {
    outline: 0,
  },
};
const gridContainer = {
  display: 'flex',
  flexWrap: 'wrap',
};
const emptyCellStyle = {
  borderRadius: 2,
  height: 30,
  maxWidth: 400,
  minWidth: 200,
  width: '40vw',
};
const selectedContainer = {
  marginTop: 20,
  maxWidth: 400,
  minWidth: 200,
  width: '40vw',
};
const selectedHeaderStyle = {
  height: 20,
  marginBottom: 15,
  textAlign: 'center',
};
const unselectedHeaderStyle = {
  height: 20,
  textAlign: 'center',
  marginBottom: 10,
};
const unselectedContainer = {
  alignItems: 'center',
  display: 'inline-flex',
  flexDirection: 'column',
  marginRight: 20,
  marginTop: 20,
  maxWidth: 410,
  minWidth: 210,
  width: '41vw',
};
const unselectedGrid = {
  display: 'inline-flex',
  flexDirection: 'column',
  marginTop: 5,
  padding: 5,
  maxWidth: 400,
  minWidth: 200,
  width: '40vw',
};

class SampleRow extends React.Component {
  render() {
    return (
      <div
        style={ gridContainer }
      >
        <div
          style={ unselectedContainer }
        >
          <div
            style={ unselectedHeaderStyle }
          >
            Samples
            <input
              checked={ this.props.showTooltips }
              data-tip={ true }
              data-for={ 'checkbox-unselected-sample-tooltips' }
              onChange={ this.props.toggleTooltip }
              style={ {
                marginLeft: 5,
              } }
              type="checkbox"
            />
            <ReactTooltip
              effect="solid"
              id="checkbox-unselected-sample-tooltips"
              type="dark"
              place="top"
            >
              Show sample tooltips
            </ReactTooltip>
          </div>
          <div
            onDragOver={ (e) => { this.props.dragFuncs.dragOverTargetCell(e); } }
            onDrop={ (e) => {
              this.props.dragFuncs.droppedTargetCell(e, 'unselected');
            } }
            style={ Object.assign(
              {},
              unselectedGrid,
              {
                backgroundColor: this.props.muiTheme.palette.shading1,
                height: (this.props.gridRows * 30) +
                  ((this.props.gridRows - 1) * 5),
              }
            ) }
          >
            {
              this.props.unselectedSamples.map((sample, i) => {
                return (
                  <button
                    draggable={ true }
                    key={ `unselected-${sample._id}` }
                    onDragEnd={ () => {
                      this.props.dragFuncs.dragEndOrigin();
                    } }
                    onDragStart={ (e) => {
                      this.props.dragFuncs.dragStartOrigin(e, sample._id, sample.name, 'unselected', sample.replicate);
                    } }
                    onDrag={ () => {
                      this.props.dragFuncs.dragOrigin(sample._id);
                    } }
                    onMouseEnter={ (e) => {
                      this.props.sampleTooltip.showFunc(
                        e,
                        sample._id,
                        'right',
                        this.props.showTooltips
                      );
                    } }
                    onMouseLeave={ this.props.sampleTooltip.hideFunc }
                    ref={ `sampleTooltip-${sample._id}` }
                    style={ Object.assign(
                      {},
                      cellStyle,
                      {
                        backgroundColor: this.props.muiTheme.palette.accent4Color,
                        border: `2px solid ${this.props.muiTheme.palette.accent1Color}`,
                        display: sample._id !== this.props.dragID ? 'inline' : 'none',
                        marginTop: i !== 0 ? 5 : 0,
                      }
                    ) }
                  >
                    { `${sample._id}: ${sample.name}, rep: ${sample.replicate}`}
                  </button>
                );
              })
            }
          </div>
        </div>
        <div
          ref={ (container) => { this.gridSelected = container; } }
          style={ selectedContainer }
        >
          <div
            style={ {
              display: 'inline-grid',
              gridAutoRows: `repeat(${this.props.gridRows + 2}, 30px)`,
              gridGap: 5,
              padding: '0px 10px 10px 0px',
            } }
          >
            <div
              style={ Object.assign(
                {},
                selectedHeaderStyle,
                {
                  gridColumn: 1,
                  gridRow: 1,
                }
              ) }
            >
              Ordered samples
            </div>
            {
              [...Array(this.props.gridRows)].map((x, i) => {
                const rowPos = i + 2;
                return (
                  <div
                    key={ `row${rowPos}-body` }
                    onDragOver={ (e) => { this.props.dragFuncs.dragOverTargetCell(e); } }
                    onDrop={ (e) => {
                      this.props.dragFuncs.droppedTargetCell(e, 'selected', 1, rowPos);
                    } }
                    style={ Object.assign(
                      {},
                      emptyCellStyle,
                      {
                        backgroundColor: this.props.muiTheme.palette.primary4Color,
                        gridColumn: 1,
                        gridRow: rowPos,
                      }
                    ) }
                  />
                );
              })
            }
            {
              this.props.design.map((sampleSets) => {
                return (
                  sampleSets.items.map((sample) => {
                    return (
                      <div
                        onDragOver={ (e) => { this.props.dragFuncs.dragOverTargetCell(e); } }
                        onDrop={ (e) => {
                          this.props.dragFuncs.droppedTargetCell(e, 'selected', sample.col, sample.row);
                        } }
                        style={ {
                          display: sample._id !== this.props.dragID ? 'inline' : 'none',
                          gridColumn: sample.col,
                          gridRow: sample.row,
                        } }
                      >
                        <button
                          draggable={ true }
                          key={ `col-${sample.col}-row-${sample.row}-selected-${sample._id}` }
                          onDragEnd={ () => {
                            this.props.dragFuncs.dragEndOrigin();
                          } }
                          onDragStart={ (e) => {
                            this.props.dragFuncs.dragStartOrigin(e, sample._id, sample.name, 'selected', sample.replicate, sample.col);
                          } }
                          onDrag={ () => {
                            this.props.dragFuncs.dragOrigin(sample._id);
                          } }
                          onMouseEnter={ (e) => {
                            this.props.sampleTooltip.showFunc(
                              e,
                              sample._id,
                              'top',
                              this.props.showTooltips
                            );
                          } }
                          onMouseLeave={ this.props.sampleTooltip.hideFunc }
                          style={ Object.assign(
                            {},
                            cellStyle,
                            {
                              backgroundColor: this.props.muiTheme.palette.accent4Color,
                              border: `2px solid ${this.props.muiTheme.palette.accent1Color}`,
                            }
                          ) }
                        >
                          { `${sample._id}: ${sample.name}, rep: ${sample.replicate}`}
                        </button>
                      </div>

                    );
                  })
                );
              })
            }
          </div>
        </div>
        <div
          style={ buttonContainer }
        >
          <FloatingActionButton
            data-tip={ true }
            data-for={ 'fab-reset-sample-design' }
            mini={ true }
            onTouchTap={ this.props.resetDesign }
          >
            <Cached />
          </FloatingActionButton>
          <ReactTooltip
            effect="solid"
            id="fab-reset-sample-design"
            type="dark"
            place="top"
          >
            Reset sample design
          </ReactTooltip>
        </div>
        <Tooltip
          position={ this.props.sampleTooltip.position }
          rect={ this.props.sampleTooltip.rect }
          show={ this.props.sampleTooltip.show }
          text={ this.props.sampleTooltip.text }
          tooltipStyle={ {
            textAlign: 'left',
          } }
        />
      </div>
    );
  }
}

SampleRow.defaultProps = {
  dragID: null,
};

SampleRow.propTypes = {
  design: PropTypes.arrayOf(
    PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({}),
      ),
      name: PropTypes.string,
    }),
  ).isRequired,
  dragFuncs: PropTypes.shape({
    dragEndOrigin: PropTypes.func,
    dragOrigin: PropTypes.func,
    dragOverTargetCell: PropTypes.func,
    droppedTargetCell: PropTypes.func,
    dragStartOrigin: PropTypes.func,
  }).isRequired,
  dragID: PropTypes.number,
  gridRows: PropTypes.number.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      accent1Color: PropTypes.string,
      accent4Color: PropTypes.string,
      alternativeButtonColor: PropTypes.string,
      primary4Color: PropTypes.string,
      shading1: PropTypes.string,
    }),
  }).isRequired,
  resetDesign: PropTypes.func.isRequired,
  sampleTooltip: PropTypes.shape({
    _id: PropTypes.number,
    hideFunc: PropTypes.func,
    position: PropTypes.string,
    rect: PropTypes.shape({
      bottom: PropTypes.number,
      height: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number,
      top: PropTypes.number,
      width: PropTypes.number,
      x: PropTypes.number,
      y: PropTypes.number,
    }),
    show: PropTypes.bool,
    showFunc: PropTypes.func,
    text: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.string,
      ),
      PropTypes.string,
    ]),
  }).isRequired,
  showTooltips: PropTypes.bool.isRequired,
  toggleTooltip: PropTypes.func.isRequired,
  unselectedSamples: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.number,
      name: PropTypes.string,
      group: PropTypes.shape({
        experiment: PropTypes.number,
        project: PropTypes.number,
        screen: PropTypes.number,
      }),
      replicate: PropTypes.string,
    })
  ).isRequired,
};

export default muiThemeable()(Radium(SampleRow));
