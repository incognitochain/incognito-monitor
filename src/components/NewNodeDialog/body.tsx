import React from 'react';
import { InputGroup, FormGroup } from '@blueprintjs/core';

type Props = {
    onChange: (e: React.FormEvent) => void,
    error?: string,
    disabled?: boolean,
}

const NewNodeDialogBody: React.FC<Props> = ({ onChange, error, disabled }) => {
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
};

export default React.memo(NewNodeDialogBody);
