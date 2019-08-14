import React from 'react';
import {InputGroup, FormGroup, Switch} from '@blueprintjs/core';

type Props = {
  onChange: (e: React.FormEvent) => void,
  error?: string,
  disabled?: boolean,
  settings: any,
}

const SettingsDialogBody: React.FC<Props> = ({ onChange, error, disabled, settings }) => {
  return (
    <div className="settings-dialog-body">
      <FormGroup
        label="Private Key"
        labelFor="privateKey"
        inline
      >
        <InputGroup
          disabled={disabled}
          id="privateKey"
          onChange={onChange}
          defaultValue={settings.privateKey}
        />
      </FormGroup>
      <Switch
        id="clearDatabase"
        defaultChecked={settings.clearDatabase}
        label="Clear database when restarting node"
        onChange={onChange}
      />
      <div className="error-msg">{error}</div>
    </div>
  );
};

export default React.memo(SettingsDialogBody);
