import React from 'react';

import HelpImage from '../../help-image-container';
import CreateScreenImg from './images/create-screen.png';

class CreateScreen extends React.Component {
  render() {
    return (
      <div>
        <p>
          The screen level is where the most tracking information is specified.
          This includes the screen type, species of the host cell, cell type, cell line
          modification and drug treatments. Certain types of screens will have additional
          fields. Clicking on the help icons next to fields will open a dialog box
          with additional information.
        </p>
        <HelpImage
          caption="Creating screens"
          height={ 600 }
          image={ CreateScreenImg }
          legend="Creating experiments"
        />
      </div>
    );
  }
}

export default CreateScreen;
