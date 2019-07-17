import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from '@blueprintjs/core';

class BackButton extends Component {
  onBack = () => {
    const { history } = this.props;
    history.goBack();
  };

  render() {
    return (
      <Button minimal onClick={this.onBack}>
        <Icon icon="arrow-left" />
      </Button>
    );
  }
}

BackButton.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default BackButton;
