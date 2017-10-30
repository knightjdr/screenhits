import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import Radium from 'radium';
import React from 'react';

const cellStyle = {
  borderRadius: 2,
  cursor: 'pointer',
  height: 30,
  overflow: 'hidden',
  padding: 5,
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
const headerStyle = {
  height: 20,
  textAlign: 'center',
  width: 110,
};
const unselectedGrid = {
  display: 'inline-grid',
  gridGap: 5,
  width: 110,
};

class SampleGrid extends React.Component {
  render() {
    return (
      <div
        style={ {
          marginTop: 20,
        } }
      >
        <div
          style={ unselectedGrid }
        >
          <div
            style={ headerStyle }
          >
            Samples
          </div>
          {
            this.props.unselectedSamples.map((sample) => {
              return (
                <button
                  draggable={ true }
                  key={ `unselected-${sample._id}` }
                  onDragEnd={ () => {
                    this.props.dragFuncs.dragEndOrigin();
                  } }
                  onDragStart={ (e) => {
                    this.props.dragFuncs.dragStartOrigin(e, sample._id, sample.name, 'unselected');
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
                      display: sample._id !== this.props.dragID ? 'inline' : 'none',
                    }
                  ) }
                >
                  { `${sample._id}: ${sample.name}`}
                </button>
              );
            })
          }
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
                    headerStyle,
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
                      onDragEnter={ () => {
                        this.props.dragFuncs.dragEnterTargetCell(colPos, rowPos);
                      } }
                      onDragLeave={ () => {
                        this.props.dragFuncs.dragLeaveTargetCell(colPos, rowPos);
                      } }
                      onDragOver={ (e) => { this.props.dragFuncs.dragOverTargetCell(e); } }
                      onDrop={ (e) => {
                        this.props.dragFuncs.droppedTargetCell(e, colPos, rowPos);
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
                          display: sample._id !== this.props.dragID ? 'inline' : 'none',
                          gridColumn: sample.col,
                          gridRow: sample.row,
                        }
                      ) }
                    >
                      { `${sample._id}: ${sample.name}`}
                    </button>
                  );
                })
              );
            })
          }
        </div>
      </div>
    );
  }
}

SampleGrid.defaultProps = {
  dragID: null,
};

SampleGrid.propTypes = {
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
    dragEnterTargetCell: PropTypes.func,
    dragLeaveTargetCell: PropTypes.func,
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
    }),
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
