import React, { Component } from 'react';
import RefreshContext from 'components/Contexts/RefreshContext';

function consumeRefreshContext(WrappedComponent: any) {
  return class extends Component<any> {
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
