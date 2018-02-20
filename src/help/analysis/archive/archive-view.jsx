import React from 'react';

import HelpImage from '../../help-image-container';
import AnalysisArchiveViewImg from './images/analysis-archive-view.png';

class ArchiveView extends React.Component {
  render() {
    return (
      <div>
        <p>
          Tasks are viewed as heat maps, with the samples sets columns and the
          rows genes. The range of values displayed in the heat map can
          be capped in the panel at left. You can apply filters to scores
          associated with each gene to limit the displayed results. Enabling tooltips
          in the menu will show additional information about a gene and its
          sample when hovering over the cell on the heat map. The heat map
          will be cropped to fit the available display space. You can increase
          the number of rows displayed on the heat map by changing the cell dimensions
          from the menu (or enlarging your browser if possible). The arrow icons
          adjacent to the image allow for navigation
          of the heat map. The innermost arrows will move up and down a single
          row, the next arrows will move forward and back a page and the outermost
          arrows will move to the start and end of the heat map. You can search
          the heat map for a specific gene using the search field in the menu.
          Clicking on a column heading will sort the heat map based on that
          sample set. Clicking again will sort in the reverse order.
        </p>
        <HelpImage
          caption="Viewing analysis results"
          height={ 600 }
          image={ AnalysisArchiveViewImg }
          legend="Viewing analysis results. Image configuration and display
            options are available in the panel at left. &#9312; The reset button
            will reset all menu options to their defaults and re-display
            the image in its orignal state. &#9313; the navigation arrows can
            be used to move around the image. &#9314; Clicking on any column
            heading will sort the rows by that sample set."
        />
        <p>
          Since most images are quite large we have not yet implemented an export
          feature but we intend on allowing for images to be imported, analyzed
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
