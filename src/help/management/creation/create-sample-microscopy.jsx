import React from 'react';

import HelpImage from '../../help-image-container';
import CreateSampleMicroscopy1Img from './images/create-sample-microscopy-1.png';
import CreateSampleMicroscopy2Img from './images/create-sample-microscopy-2.png';

class CreateProject extends React.Component {
  render() {
    return (
      <div>
        <p>
          Microscopy images can be uploaded in BMP, PNG, JPG or TIF format. These
          should be full colour images. In addition to the standard fields required
          for sample upload, users should also specify the microscope and objective
          used, as well as any digital zoom applied to the image. Channel information
          should also be added for tracking and searching. A preview of the image
          will be shown after selecting the file to upload, although this is not
          supported for TIF formatted files.
        </p>
        <HelpImage
          caption="Micrscopy fields"
          height={ 765 }
          image={ CreateSampleMicroscopy1Img }
          legend="Microscopy samples have additional fields, including channels, that
            should be completed for searching and tracking purposes"
        />
        <p>
          The image and sample information will be inserted into the database
          immediately upon upload although it will not be available for viewing until the
          user updates the sample store in their browser. On the action menu hit the
          &apos;Update sample store&apos; button to refresh the list of available
          samples, or you can simply refresh the browser.
        </p>
        <HelpImage
          caption="Sample store"
          height={ 765 }
          image={ CreateSampleMicroscopy2Img }
          legend="The action menu at bottom left includes an option to update
            the sample store"
        />
        <p>
          The input form will not reset after upload, allowing you to change the sample
          name, replicate and other fields as required, as well as selecting a different
          image to upload.
        </p>
      </div>
    );
  }
}

export default CreateProject;
