import React from 'react';

class NewAnalysis extends React.Component {
  render() {
    return (
      <div>
        <p>
          Begin analysis by selecting the type of screen you would like to analyze
          and naming your task. Currently there is only a single option when selecting
          screen type (CRISPR) but more will be added in the future as we
          support more screen types.
        </p>
        IMAGE
        <p>
          You will then need to select the samples to analyze. The samples you can choose
          will depend on you access permissions. Any projects to which you have
          at least view access will be available for you to use when performing
          analysis. You can select samples individually from the list or select
          samples by project, screen or experiment. You can also filter the lists
          by user, lab, sample name or date to narrow the available items.
        </p>
        IMAGE: do not forgot to show tooltip and explain
        <p>
          After selecting your sample the next step is to specify the type of analysis,
          adjust input parameters and design your analysis.&nbsp;
          <a
            href="https://sourceforge.net/projects/bagel-for-knockout-screens/"
            target="_blank"
            rel="noopener noreferrer"
          >
            BAGEL
          </a>,&nbsp;
          <a
            href="https://github.com/hart-lab/drugz"
            target="_blank"
            rel="noopener noreferrer"
          >
            DrugZ
          </a>,&nbsp;
          <a
            href="https://sourceforge.net/p/mageck/wiki/Home"
            target="_blank"
            rel="noopener noreferrer"
          >
            MAGeCK
          </a> and&nbsp;
          <a
            href="https://github.com/JCHuntington/RANKS"
            target="_blank"
            rel="noopener noreferrer"
          >
            RANKS
          </a>
          are the types of analysis available. MAGeCK has two options for
          analyzing CRISPR data: test and mle. Please refer to their documentation
          for specifics. After selecting the software tool to use, you can
          adjust your input parameters although defaults are provided. If you do not
          wish to analyze data but instead simply compare raw results from samples,
          select the &apos;generic&apos; analysis option from the menu. This will
          display raw or normalized read counts as a heat map. These generic comparisons
          are not saved to the database, in contrast to results from the software
          tools.
        </p>
        IMAGE
        <p>
          It is important to note that all of the normalization and filtering
          functions native to the above-mentioned software packages have been
          removed. Normalization and filtering is done using our own custom
          code to ensure that this is performed consistently regardless of the
          analysis type selected. After normalization and filtering, identical
          data can be fed into each software tool making it more legitimate
          to perform comparisons between them.
        </p>
        <p>
          The final step in initializing your analysis is to define the samples
          and specify the replicates to compare. In the design area all selected
          sample will begin in the left hand column. Start by dragging your control
          samples into the first column of the design grid. Next drag your first
          set of replicates into the second column of the design grid. For example,
          if you have three replicates that were harvested 10 minutes post-treatment,
          drag these samples into the second column. These replicate group are
          called samples sets. The control sample in the same row as a sample
          set replicate is the control that replicate will be compared against, so
          reorder your sample set replicates or controls as needed. You can add
          additional colums or rows to the design grid by clicking the appropriate
          plus button. Empty rows or columns will be ignored. Any samples that
          remain in the unselected column will be excluded from your analysis. Be sure
          to edit the name of each sample set to the name you would like it to have
          on your visualized results. In the example mentioned above
          &apos;Sample set 1&apos; could be changed to something like
          &apos;My screen name, Drug X, time 10min&apos;. Put enough information in
          the name to make it easy to know what the sample set refers to. For generic
          analysis the design step can be ignored if you are happy with the ordering
          of your samples in the left column. If not, reorder your samples in the right
          column to how you would like them to appear on your image. Top to bottom on
          the grid would become left to right on the image.
        </p>
        IMAGE: do not forgot to show tooltip and explain
        <p>
          After submitting your analysis it will get added to the processing queue.
          Proceed to the archive (accessible from the action menu in the bottom left)
          to view archived and queued analysis.
        </p>
      </div>
    );
  }
}

export default NewAnalysis;
