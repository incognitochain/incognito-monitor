import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';

function NewNodeDialogFooter({ onCancel, onAdd }) {
  return (
    <div className="new-node-dialog-footer">
      <Button onClick={onCancel} className="cancel-btn">
        Cancel
      </Button>
      <Button onClick={onAdd} intent="success" className="add-btn">
        Add
      </Button>
    </div>
  );
}

NewNodeDialogFooter.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default React.memo(NewNodeDialogFooter);
