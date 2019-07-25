import React from 'react';
import { Dialog as BluePrintDialog, Classes } from '@blueprintjs/core';

type Props = {
  title?: string,
  body?: any,
  footer?: any,
  canOutsideClickClose?: boolean,
  isOpen?: boolean,
  onClose?: () => Event,
  className?: string,
}

const Dialog: React.FC<Props> = ({
  title, body, footer, canOutsideClickClose, isOpen, onClose, className,
}) => {
  return (
    <BluePrintDialog
      className={`${className}`}
      onClose={onClose}
      title={title}
      canOutsideClickClose={canOutsideClickClose}
      isOpen={isOpen}
    >
      <div className={Classes.DIALOG_BODY}>
        {body}
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        {footer}
      </div>
    </BluePrintDialog>
  );
};

export default React.memo(Dialog);
