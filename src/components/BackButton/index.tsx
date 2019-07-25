import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Icon } from '@blueprintjs/core';

type Props = {
  history: RouteComponentProps['history'],
}

export const BackButton: React.FC<Props> = props => {
  const onBack = () => {
    const { history } = props;
    history.goBack();
  };

  return (
    <Button minimal onClick={onBack}>
      <Icon icon="arrow-left" />
    </Button>
  );
};

export default React.memo(BackButton);
