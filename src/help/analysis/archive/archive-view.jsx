import React from 'react';


class ArchiveView extends React.Component {
  render() {
    return (
      <div>
        <p>
          Task are viewed as heat map, with the samples as columns and the
          rows genes. The range of values displayed in the heat map can
          be capped using in the menu at left. You can apply filters to scores
          associated with each gene to limit the results. Enabling tooltips
          in the menu will show additional information about a gene and its
          sample when hovering over the cell on the heat map. The heat map
          will be cropped to fit the available display space. You can increase
          the amount of rows displayed on the heat map by changing the cell dimensions
          from the menu. The arrow icons adjacent to the image allow for navigation
          of the heat map. The innermost arrows will move up and down a single
          row, the next arrows will move forward and back a page and the outermost
          arrows will move you the start and end of the heat map. You can search
          the heat map for a specific gene using the search field in the menu.
          Clicking on a column heading will sort the heat map based on that
          sample set. Clicking again will sort in the reverse order.
        </p>
        IMAGE. Talk about reset button on menu and update filter button.
        <p>
          Since most images are quite large we have not yet implemented an export
          feature but we indeed on allowing for images to be imported, analyzed
          and exported via&nbsp;
          <a
            href="https://prohits-viz.lunenfeld.ca"
            target="_blank"
            rel="noopener noreferrer"
          >
            ProHits-viz
          </a>.
        </p>
      </div>
    );
  }
}

export default ArchiveView;
