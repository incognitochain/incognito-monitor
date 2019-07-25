import React from 'react';
import _ from 'lodash';

import Dialog from 'components/common/Dialog';
import NewNodeDialogBody from 'components/NewNodeDialog/body';
import NewNodeDialogFooter from 'components/NewNodeDialog/footer';

import './index.scss';

type Props = {
  isOpen?: boolean,
  onClose: () => Event,
  onAdd: (node: Node) => Event,
  error?: string,
  disabled?: boolean,
}

type Node = {
  [key:string]: any;
}

const NewNodeDialog: React.FC<Props> = ({
  isOpen, onClose, onAdd, error, disabled,
}) => {
  const node: Node = {};

  /**
   * Update a field of new node
   * @param {Event} e
   */
  const updateNode = (e: React.FormEvent) => {
    const target = e.target as HTMLInputElement;
    node[target.id] = _.trim(target.value);
  };

  return (
    <Dialog
      title="New node"
      isOpen={isOpen}
      canOutsideClickClose
      onClose={onClose}
      className="new-node-dialog"
      body={<NewNodeDialogBody disabled={disabled} onChange={updateNode} error={error} />}
      footer={(
        <NewNodeDialogFooter
          disabled={disabled}
          onAdd={() => onAdd(node)}
          onCancel={onClose}
        />
      )}
    />
  );
};

export default React.memo(NewNodeDialog);
