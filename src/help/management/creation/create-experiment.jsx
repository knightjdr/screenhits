import React from 'react';

import HelpImage from '../../help-image-container';
import HelpLink from '../../help-link';
import CreateExperimentImg from './images/create-experiment.png';

class CreateExperiment extends React.Component {
  render() {
    return (
      <div>
        <p>
          Tracking information specific to the experiment level includes the concentration
          or timepoint of the drug treatment and the protocols used. A typical screen
          will be performed with a fixed drug/reagent concentration and the experimental
          samples will then be harvested at varying timepoints. For this type of procedure,
          the drug concentration field will be entered accordingly at the experiment level
          while the timepoint field would be left blank (filled at the sample level).
          Alternatively, if the experiment is performed at a specific timepoint
          with varying drug concentrations the tracking information would be reversed:
          timepoint entered at the experiment level and drug concentration at the sample
          level.
        </p>
        <p>
          Users should also specify all protocols used in the experiment by clicking the
          dropdown menu laballed &apos;Protocols&apos; and selecting from those available.
          The procedure for creating protocols is discussed in the&nbsp;
          <HelpLink
            text="&apos;Protocol&apos;"
            to="/help/management/creation/protocols"
          /> section.
        </p>
        <HelpImage
          caption="Creating experiments"
          height={ 600 }
          image={ CreateExperimentImg }
          legend="Creating experiments. Protocols available to the user are available from
            the dropdown menu"
        />
      </div>
    );
  }
}

export default CreateExperiment;
