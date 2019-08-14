import React from 'react';
import { Button } from '@blueprintjs/core';

type Props = {
    onCancel: () => void,
    onSave: () => void,
    disabled?: boolean,
}

const SettingsDialogFooter: React.FC<Props> = ({ onCancel, onSave, disabled }) => {
  return (
    <div className="settings-dialog-footer">
      <Button disabled={disabled} onClick={onCancel} className="cancel-btn">
        Cancel
      </Button>
      <Button disabled={disabled} onClick={onSave} intent="success" className="add-btn">
        Save
      </Button>
    </div>
  );
};

export default React.memo(SettingsDialogFooter);
