import React from 'react';
import { Button } from '@blueprintjs/core';

type Props = {
    onCancel: () => void,
    onAdd: () => void,
    disabled?: boolean,
}

const NewNodeDialogFooter: React.FC<Props> = ({ onCancel, onAdd, disabled }) => {
  return (
    <div className="new-node-dialog-footer">
      <Button disabled={disabled} onClick={onCancel} className="cancel-btn">
        Cancel
      </Button>
      <Button disabled={disabled} onClick={onAdd} intent="success" className="add-btn">
        Add
      </Button>
    </div>
  );
};

export default React.memo(NewNodeDialogFooter);
