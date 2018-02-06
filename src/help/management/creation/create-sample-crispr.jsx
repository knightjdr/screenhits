import React from 'react';

import HelpImage from '../../help-image-container';
import CreateSampleCrispr1Img from './images/create-sample-crispr-1.png';
import CreateSampleCrispr2Img from './images/create-sample-crispr-2.png';
import CreateSampleCrispr3Img from './images/create-sample-crispr-3.png';

class CreateSampleCRISPR extends React.Component {
  render() {
    return (
      <div>
        <p>
          CRISPR sequencing files to upload must be in tab-delimited text format with
          the following headers:
        </p>
        <div
          style={ {
            display: 'flex',
            justifyContent: 'center',
          } }
        >
          <div
            style={ {
              display: 'inline-grid',
              gridColumnGap: 20,
            } }
          >
            <div
              style={ {
                fontWeight: 'bold',
                gridColumn: 1,
                gridRow: 1,
              } }
            >
              GENE_CLONE
            </div>
            <div
              style={ {
                fontWeight: 'bold',
                gridColumn: 2,
                gridRow: 1,
              } }
            >
              GENE
            </div>
            <div
              style={ {
                fontWeight: 'bold',
                gridColumn: 3,
                gridRow: 1,
              } }
            >
              Sample1
            </div>
            <div
              style={ {
                fontWeight: 'bold',
                gridColumn: 4,
                gridRow: 1,
              } }
            >
              Sample2
            </div>
            <div
              style={ {
                gridColumn: 1,
                gridRow: 2,
              } }
            >
              A1BG_CACCTTCGAGCTGCTGCGCG
            </div>
            <div
              style={ {
                gridColumn: 2,
                gridRow: 2,
              } }
            >
              A1BG
            </div>
            <div
              style={ {
                gridColumn: 3,
                gridRow: 2,
              } }
            >
              94
            </div>
            <div
              style={ {
                gridColumn: 4,
                gridRow: 2,
              } }
            >
              713
            </div>
          </div>
        </div>
        <p>
          The files can have any number of samples following the guide and gene columns.
          After selecting the file to upload, information will be displayed to indicate
          how the file is going to be processed.
        </p>
        <HelpImage
          caption="Uploading CRISPR samples"
          height={ 765 }
          image={ CreateSampleCrispr1Img }
          legend="Columns from the selected file to upload will be defined and parsed
            as indicated"
        />
        <p>
          The guide and gene columns should be automatically recognized in the
          &apos;Definitions&apos; section. Each sample will correspond to a single
          column in the input file and the form will prompt you to specify the column
          in the &apos;Required&apos; section. After selecting the sample in the dropdown,
          press the plus button to add it to your list of column definitions.
        </p>
        <HelpImage
          caption="Defining sample columns"
          height={ 765 }
          image={ CreateSampleCrispr2Img }
          legend="Select the required sample column from the dropdown and press the
            plus button to add it to your definitions. In this example the columns
            'SN_TO' will be defined as our time 0 sample"
        />
        <p>
          The form will also show you any special parsing rules that will be applied
          to your file as a sanity check. In the case of CRISPR sequenceing files the
          &apos;GENE_CLONE&apos; column contains both the gene and the guide sequence.
          The guide sequence needs to be extracted from this, so if your file is properly
          formatted you should see this conveyed in the &apos;Parsing rules&apos; section
        </p>
        <p>
          Finally the form will display any unused columns. If the input file contained
          additional columns with metadata for example, these could be defined here
          and included with the upload. This section was designed to support generic
          screen types in the future and is not currently relevant for CRISPR data.
        </p>
        <p>
          The input form will not reset after upload, allowing you to change the sample
          name, replicate and other fields as required, as well as selecting a different
          sample column from your file to proceed with the next sample upload.
        </p>
        <p>
          After hitting the upload button the sample will get put into a processing queue.
          Insertion of the sample into the database can be slow (~10 minutes) due to the
          database structure. The database structure was designed to make sample searches
          and analysis as rapid as possible but this compromises data insertion. To view the
          status of your upload, click the information button at the button right of the window
          to view the queue.
        </p>
        <HelpImage
          caption="Sample queue and store"
          height={ 765 }
          image={ CreateSampleCrispr3Img }
          legend="The information menu at 1) will open a dropdown from which the sample
            queue can be accessed. The action menu at bottom left includes an option to update
            the sample store"
        />
        <p>
          When a sample has finished uploading it will not be immediately available for viewing
          in ScreenHits. On the action menu hit the &apos;Update sample store&apos; button to
          refresh the list of available samples, or you can simply refresh the browser.
        </p>
      </div>
    );
  }
}

export default CreateSampleCRISPR;
