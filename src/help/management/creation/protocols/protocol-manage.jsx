import React from 'react';

import HelpImage from '../../../help-image-container';
import ProtocolManageImg from './images/protocols-2.png';

class ProtocolManage extends React.Component {
  render() {
    return (
      <div>
        <p>
          On the protocol creation page users can select an existing protocol
          to view or edit, or create a new protocol. From the &apos;Templates&apos;
          dropdown, existing lab templates or default protocols can be selected
          for duplication and editting by the user.
        </p>
        <p>
          When creating a protocol the user gives it a name and then adds subfields
          to the protocol. In the example below, a subfield has been added for
          &apos;media&apos;, which has then been defined. Subfields are created using
          the &apos;New subsection name&apos; field and then hitting the adjacent
          plus button. As an alternative to defining multiple subsections, protocols
          can be created as a single stream of text (paragaph). Simply create a single
          subfield called &apos;description&apos; (or something suitable) and write
          the entire protocol in the this subfield&apos;s text box. The structure for
          protocols should be defined by the lab and adhered to by all its users.
        </p>
        <HelpImage
          caption="Creating protocols"
          height={ 600 }
          image={ ProtocolManageImg }
          legend="Managing protocols. 1) select an existing protocol to view or edit,
            2) click the button to create a new protocol, 3) the templates dropdown
            can be used to select an existing template or default protocol to use
            and/or modify as needed, 4) define a new subfield using the
            &apos;New subsection name&apos; field, 5) add a newly defined subfield
            to the protocol using the plus button"
        />
      </div>
    );
  }
}

export default ProtocolManage;
