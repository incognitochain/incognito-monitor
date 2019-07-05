import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'components/common/Dialog';
import NewNodeDialogBody from './body';
import NewNodeDialogFooter from './footer';

import './index.scss';

function NewNodeDialog({
  isOpen, onClose, onAdd,
}) {
  const node = { id: '' };

  /**
   * Update a field of new node
   * @param {Event} e
   */
  const updateNode = (e) => {
    node[e.target.id] = e.target.value;
  };

  return (
    <Dialog
      title="New node"
      isOpen={isOpen}
      canOutsideClickClose
      onClose={onClose}
      className="new-node-dialog"
      body={<NewNodeDialogBody onChange={updateNode} />}
      footer={<NewNodeDialogFooter onAdd={() => onAdd(node)} onCancel={onClose} />}
    />
  );
}

NewNodeDialog.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

NewNodeDialog.defaultProps = {
  isOpen: false,
};

export default React.memo(NewNodeDialog);
