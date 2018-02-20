import React from 'react';

import HelpImage from '../help-image-container';
import DeleteImg from './images/delete.png';
import EditImg from './images/edit.png';

class Edit extends React.Component {
  render() {
    return (
      <div>
        <p>
          If you have write permission for a project you can edit all content it contains.
          This is done by selecting the &apos;Edit&apos; option from the action menu
          which will open a form with fields that are available for editing.
        </p>
        <HelpImage
          caption="Editing items"
          height={ 600 }
          image={ EditImg }
          legend="Open action menu and click to edit an item"
        />
        <p>
          You can also delete an item if you have write permission for its containing
          project. This is done when viewing an item by clicking the trash can icon
          in the upper right.
        </p>
        <HelpImage
          caption="Deleting items"
          height={ 600 }
          image={ DeleteImg }
          legend="Delete an item by clicking the trash can icon"
        />
      </div>
    );
  }
}

export default Edit;
