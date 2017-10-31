import AddBoxIcon from 'material-ui/svg-icons/content/add-box';
import IconButton from 'material-ui/IconButton';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import Radium from 'radium';
import React from 'react';
import RemoveCircle from 'material-ui/svg-icons/content/remove-circle';

import Tooltip from '../../tooltip/tooltip-container';

const cellStyle = {
  borderRadius: 2,
  cursor: 'pointer',
  height: 30,
  overflow: 'hidden',
  padding: 5,
  position: 'relative',
  textAlign: 'left',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  width: 110,
  ':focus': {
    outline: 0,
  },
};
const emptyCellStyle = {
  borderRadius: 2,
  height: 30,
  width: 110,
};
const selectedHeaderStyle = {
  height: 20,
  marginBottom: 5,
  textAlign: 'center',
  width: 110,
};
const unselectedHeaderStyle = {
  height: 20,
  textAlign: 'center',
  width: 120,
};
const unselectedContainer = {
  display: 'inline-flex',
  flexDirection: 'column',
};
const unselectedGrid = {
  display: 'inline-flex',
  flexDirection: 'column',
  marginTop: 5,
  padding: 5,
  width: 110,
};

class SampleGrid extends React.Component {
  render() {
    return (
      <div>
        <div
          style={ unselectedContainer }
        >
          <div
            style={ unselectedHeaderStyle }
          >
            Samples
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
                minHeight: (this.props.gridDimensions.rows * 30) +
                  ((this.props.gridDimensions.rows - 1) * 5),
              }
            ) }
          >
            {
              this.props.unselectedSamples.map((sample, i) => {
                return (
                  <button
                    draggable={ true }
                    key={ `unselected-${sample._id}` }
                    onClick={ (e) => { this.props.sampleTooltip.func(e, sample._id); } }
                    onDragEnd={ () => {
                      this.props.dragFuncs.dragEndOrigin();
                    } }
                    onDragStart={ (e) => {
                      this.props.dragFuncs.dragStartOrigin(e, sample._id, sample.name, 'unselected');
                    } }
                    onDrag={ () => {
                      this.props.dragFuncs.dragOrigin(sample._id);
                    } }
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
                    { `${sample._id}: ${sample.name}`}
                  </button>
                );
              })
            }
          </div>
        </div>
        <div
          style={ {
            display: 'inline-grid',
            marginLeft: 30,
            gridAutoColumns: `repeat(${this.props.gridDimensions.cols}, 110px)`,
            gridAutoRows: `repeat(${this.props.gridDimensions.rows + 1}, 30px)`,
            gridGap: 5,
          } }
        >
          {
            [...Array(this.props.gridDimensions.cols)].map((x, i) => {
              const colPos = i + 1;
              return ([
                <div
                  key={ `col${colPos}-row1-header` }
                  style={ Object.assign(
                    {},
                    selectedHeaderStyle,
                    {
                      gridColumn: colPos,
                      gridRow: 1,
                    }
                  ) }
                >
                  { this.props.design[i].name }
                </div>,
                [...Array(this.props.gridDimensions.rows)].map((y, j) => {
                  const rowPos = j + 2;
                  return (
                    <div
                      id="analysisDesignSampleSelectedGrid"
                      key={ `col${colPos}-row${rowPos}-body` }
                      onDragOver={ (e) => { this.props.dragFuncs.dragOverTargetCell(e); } }
                      onDrop={ (e) => {
                        this.props.dragFuncs.droppedTargetCell(e, 'selected', colPos, rowPos);
                      } }
                      style={ Object.assign(
                        {},
                        emptyCellStyle,
                        {
                          backgroundColor: this.props.muiTheme.palette.primary4Color,
                          gridColumn: colPos,
                          gridRow: rowPos,
                        }
                      ) }
                    />
                  );
                }),
              ]);
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
                          this.props.dragFuncs.dragStartOrigin(e, sample._id, sample.name, 'selected', sample.col);
                        } }
                        onDrag={ () => {
                          this.props.dragFuncs.dragOrigin(sample._id);
                        } }
                        style={ Object.assign(
                          {},
                          cellStyle,
                          {
                            backgroundColor: this.props.muiTheme.palette.accent4Color,
                            border: `2px solid ${this.props.muiTheme.palette.accent1Color}`,
                          }
                        ) }
                      >
                        { `${sample._id}: ${sample.name}`}
                      </button>
                    </div>

                  );
                })
              );
            })
          }
        </div>
        <div
          style={ {
            display: 'inline-flex',
            flexDirection: 'column',
            position: 'relative',
            top: 37,
          } }
        >
          <IconButton
            onTouchTap={ this.props.addColumn }
            style={ {
              padding: '12px 12px 0px 12px',
            } }
            tooltip="Add sample set"
            tooltipPosition="top-center"
          >
            <AddBoxIcon />
          </IconButton>
          {
            this.props.gridDimensions.cols > 1 &&
            <IconButton
              onTouchTap={ this.props.removeColumn }
              style={ {
                padding: '0px 12px',
              } }
              tooltip="Remove sample set"
              tooltipPosition="bottom-center"
            >
              <RemoveCircle />
            </IconButton>
          }
        </div>
        <Tooltip
          offsetTop={ 60 }
          position="left"
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

SampleGrid.defaultProps = {
  dragID: null,
};

SampleGrid.propTypes = {
  addColumn: PropTypes.func.isRequired,
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
  gridDimensions: PropTypes.shape({
    cols: PropTypes.number,
    rows: PropTypes.number,
  }).isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      accent1Color: PropTypes.string,
      accent4Color: PropTypes.string,
      primary4Color: PropTypes.string,
      shading1: PropTypes.string,
    }),
  }).isRequired,
  removeColumn: PropTypes.func.isRequired,
  sampleTooltip: PropTypes.shape({
    _id: PropTypes.number,
    func: PropTypes.func.string,
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
    text: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.string,
      ),
      PropTypes.string,
    ]),
  }).isRequired,
  unselectedSamples: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.number,
      name: PropTypes.string,
      group: PropTypes.shape({
        experiment: PropTypes.number,
        project: PropTypes.number,
        screen: PropTypes.number,
      }),
    })
  ).isRequired,
};

export default muiThemeable()(Radium(SampleGrid));
