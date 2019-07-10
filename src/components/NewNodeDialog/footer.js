import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';

function NewNodeDialogFooter({ onCancel, onAdd, disabled }) {
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
}

NewNodeDialogFooter.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

NewNodeDialogFooter.defaultProps = {
  disabled: false,
};

export default React.memo(NewNodeDialogFooter);
