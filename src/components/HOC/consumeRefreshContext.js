import React, { Component } from 'react';
import RefreshContext from 'components/Contexts/RefreshContext';

function consumeRefreshContext(WrappedComponent) {
  return class extends Component {
    render() {
      return (
        <RefreshContext.Consumer>
          {({ autoRefresh, refreshTime }) => (
            <WrappedComponent
              autoRefresh={autoRefresh}
              refreshTime={refreshTime}
              {...this.props}
            />
          )}
        </RefreshContext.Consumer>
      );
    }
  };
}

export default consumeRefreshContext;
