import React from 'react';

import HelpImage from '../help-image-container';
import Microscope1Img from './images/microscopy-1.png';
import Microscope2Img from './images/microscopy-2.png';
import Microscope3Img from './images/microscopy-3.png';
import Microscope4Img from './images/microscopy-4.png';

class Microscopy extends React.Component {
  render() {
    return (
      <div>
        <p>
          Microscopy images can be processed in several ways. First, the full colour
          image can be split to separate colour channels. This can be done individually
          for a channel by clicking the plus button within it, or all channels can be
          split simultaneously by clicking the &apos;Split all&apos; button. Any changes
          made to an image, whether splitting to channels or otherwise, will only be saved
          to the database if the user hits the &apos;Save&apos; button. Images that
          have been saved can be cleared from the database using the &apos;Clear&apos;
          button. Images can be exported using the &apos;Export&apos; button (they do
          not need to be saved prior to export).
        </p>
        <HelpImage
          caption="Processing microscope images"
          height={ 875 }
          image={ Microscope1Img }
          legend="Processing microscopy images. &#9312; Split a particular channel by clicking
           the plus button within it; &#9313; split all channels by clicking the &apos;Split all&apos;
           button; &#9314; save, clear and export images by clicking the appropriate button
           under the options panel"
        />
        <p>
          After splitting a channel its brightness and contrast can be adjusted
          using the sliders beneath it. The changes will be applied after the update
          icon is pressed. Any changes can be reverted by clicking the reset icon.
          Channels can be selectively merged using the toggles in the options panel.
        </p>
        <HelpImage
          caption="Adjusting channels and merging"
          height={ 945 }
          image={ Microscope2Img }
          legend="Channel and merge options. Channel brightness and contrast can
            be adjusted with its sliders. These changes will be applied after pressing
            &#9312; and reverted by pressing &#9313;. Selectively merge channels using the toggles
            at &#9314;"
        />
        <p>
          The channel and merged images can be cropped. Activate the crop tool in
          the options panel and then drag the mouse over the original full colour
          image to select the area to crop. If you hold the shift key while dragging,
          the crop area will have equivalent height and width dimensions. After
          selecting the area to crop, hit the &apos;Apply&apos; button to crop
          channels and the merged image. Press the &apos;reset&apos; button to
          revert the crop.
        </p>
        <HelpImage
          caption="Cropping the image"
          height={ 945 }
          image={ Microscope3Img }
          legend="Cropping. &#9312; Activate the crop tool; &#9313; select the area to crop;
            &#9314; apply a new crop or revert the existing crop"
        />
        <p>
          You can export the original image, the merged image or any processed channels.
          All adjustments made (brightness, contrast and cropping) will be applied
          to the exported images. If desired, images can be converted to greyscale
          during export.
        </p>
        <HelpImage
          caption="Exporting images"
          height={ 945 }
          image={ Microscope4Img }
          legend="Export dialog with options"
        />
      </div>
    );
  }
}

export default Microscopy;
