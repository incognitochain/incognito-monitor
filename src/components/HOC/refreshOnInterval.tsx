import React, { Component } from 'react';
import _ from 'lodash';

type Props = {
  autoRefresh: boolean,
  refreshTime: string,
}

function refreshOnInterval(WrappedComponent: any) {
  return class extends Component<Props> {
    interval?: number;
    refreshAction: (() => void) = _.noop;

    componentDidUpdate(prevProps: Props) {
      const { autoRefresh: prevAutoRefresh, refreshTime: prevRefreshTime } = prevProps;
      const { autoRefresh: currentAutoRefresh, refreshTime: currentRefreshTime } = this.props;

      if (prevRefreshTime !== currentRefreshTime || prevAutoRefresh !== currentAutoRefresh) {
        this.stopRefresh();

        if (currentAutoRefresh) {
          this.startRefresh();
        }
      }
    }

    componentWillUnmount() {
      this.stopRefresh();
    }

    startRefresh = () => {
      const { refreshTime } = this.props;
      this.interval = window.setInterval(() => {
        this.refreshAction();
      }, parseInt(refreshTime, 10));
    };

    setRefreshAction = (action: () => void) => {
      const { autoRefresh } = this.props;
      this.refreshAction = action;
      if (autoRefresh) {
        this.startRefresh();
      }
    };

    stopRefresh = () => {
      clearInterval(this.interval);
    };

    render() {
      // Wraps the input component in a container, without mutating it. Good!
      return (
        <WrappedComponent
          {...this.props}
          setRefreshAction={this.setRefreshAction}
        />
      );
    }
  };
}

export default refreshOnInterval;
