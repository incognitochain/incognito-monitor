import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Dialog from 'components/common/Dialog';
import NewNodeDialogBody from './body';
import NewNodeDialogFooter from './footer';

import './index.scss';

function NewNodeDialog({
  isOpen, onClose, onAdd, error, data,
}) {
  const node = data;

  /**
   * Update a field of new node
   * @param {Event} e
   */
  const updateNode = (e) => {
    node[e.target.id] = _.trim(e.target.value);
  };

  return (
    <Dialog
      title="New node"
      isOpen={isOpen}
      canOutsideClickClose
      onClose={onClose}
      className="new-node-dialog"
      body={<NewNodeDialogBody onChange={updateNode} error={error} />}
      footer={<NewNodeDialogFooter onAdd={() => onAdd(node)} onCancel={onClose} />}
    />
  );
}

NewNodeDialog.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  error: PropTypes.string,
  data: PropTypes.shape({}),
};

NewNodeDialog.defaultProps = {
  isOpen: false,
  error: null,
  data: {},
};

export default React.memo(NewNodeDialog);
