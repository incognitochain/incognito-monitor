import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup, FormGroup } from '@blueprintjs/core';

function NewNodeDialogBody({ onChange, error, disabled }) {
  return (
    <div className="new-node-dialog-body">
      <FormGroup
        label="Name"
        labelFor="name"
        inline
      >
        <InputGroup disabled={disabled} id="name" onChange={onChange} />
      </FormGroup>
      <FormGroup
        label="Host"
        labelFor="host"
        inline
      >
        <InputGroup disabled={disabled} id="host" onChange={onChange} />
      </FormGroup>
      <FormGroup
        label="Port"
        labelFor="port"
        inline
      >
        <InputGroup disabled={disabled} id="port" onChange={onChange} />
      </FormGroup>
      <div className="error-msg">{error}</div>
    </div>
  );
}

NewNodeDialogBody.propTypes = {
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
};

NewNodeDialogBody.defaultProps = {
  error: null,
  disabled: false,
};

export default React.memo(NewNodeDialogBody);
