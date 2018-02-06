import React from 'react';

class ProtocolTemplates extends React.Component {
  render() {
    return (
      <div>
        <p>
          Lab administrators can create protocol templates and default protocols
          for their lab to use. A template is simply a protocol with a collection
          of defined subfields that have not been filled out, while a default
          protocol has the subfields filled with suitable text. Both of these are created
          in the same way as regular protocols but via the &apos;Protocol templating&apos;
          option in the action menu.
        </p>
      </div>
    );
  }
}

export default ProtocolTemplates;
