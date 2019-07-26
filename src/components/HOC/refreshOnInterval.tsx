import React, { Component, Fragment } from 'react';
import _ from 'lodash';
import { Spinner } from '@blueprintjs/core';

import './index.scss';

type Props = {
  autoRefresh: boolean,
  refreshTime: string,
}

type State = {
  loading: boolean,
}

function refreshOnInterval(WrappedComponent: any) {
  return class extends Component<Props, State> {
    interval?: number;
    refreshAction: (() => void) = _.noop;

    state: State = {
      loading: false,
    };

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
      this.interval = window.setInterval(async () => {
        const { loading } = this.state;
        if (!loading) {
          this.setState({ loading: true });
          await this.refreshAction();
          this.setState({ loading: false });
        }
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
      const { loading } = this.state;
      return (
        <Fragment>
          {loading && <Spinner size={Spinner.SIZE_SMALL} className="refresh-spinner" />}
          <WrappedComponent
            {...this.props}
            setRefreshAction={this.setRefreshAction}
          />
        </Fragment>
      );
    }
  };
}

export default refreshOnInterval;
