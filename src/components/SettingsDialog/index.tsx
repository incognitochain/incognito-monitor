import React from 'react';
import _ from 'lodash';

import Dialog from 'components/common/Dialog';
import SettingsDialogBody from './body';
import SettingsDialogFooter from './footer';

import './index.scss';

type Props = {
  isOpen?: boolean,
  onClose: () => Event,
  onSave: (setting: Setting) => void,
  error?: string,
  disabled?: boolean,
  settings: any,
}

type Setting = {
  [key:string]: any;
}

const SettingsDialog: React.FC<Props> = ({
  isOpen, onClose, onSave, error, disabled, settings,
}) => {
  const setting: Setting = { ...settings };

  /**
   * Update a field of new node
   * @param {Event} e
   */
  const updateNode = (e: React.FormEvent) => {
    const target = e.target as HTMLInputElement;

    if (target.id === 'clearDatabase') {
      setting[target.id] = target.checked;
    } else {
      setting[target.id] = _.trim(target.value);
    }
  };

  return (
    <Dialog
      title="Local Node Settings"
      isOpen={isOpen}
      canOutsideClickClose
      onClose={onClose}
      className="new-node-dialog"
      body={
        <SettingsDialogBody
          disabled={disabled}
          onChange={updateNode}
          error={error}
          settings={settings}
        />}
      footer={(
        <SettingsDialogFooter
          disabled={disabled}
          onSave={() => onSave(setting)}
          onCancel={onClose}
        />
      )}
    />
  );
};

export default React.memo(SettingsDialog);
