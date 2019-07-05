import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup, FormGroup } from '@blueprintjs/core';

function NewNodeDialogBody({ onChange }) {
  return (
    <div className="new-node-dialog-body">
      <FormGroup
        label="Name"
        labelFor="name"
        inline
      >
        <InputGroup id="name" onChange={onChange} />
      </FormGroup>
      <FormGroup
        label="Host"
        labelFor="host"
        inline
      >
        <InputGroup id="host" onChange={onChange} />
      </FormGroup>
      <FormGroup
        label="Port"
        labelFor="port"
        inline
      >
        <InputGroup id="port" onChange={onChange} />
      </FormGroup>
    </div>
  );
}

NewNodeDialogBody.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default React.memo(NewNodeDialogBody);
