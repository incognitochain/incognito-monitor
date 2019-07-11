import React, { Component } from 'react';
import PropTypes from 'prop-types';

function refreshOnInterval(WrappedComponent) {
  return class extends Component {
    static propTypes = {
      autoRefresh: PropTypes.bool.isRequired,
      refreshTime: PropTypes.number.isRequired,
    };

    componentDidUpdate(prevProps) {
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
      this.interval = setInterval(() => {
        this.refreshAction();
      }, refreshTime);
    };

    setRefreshAction = (action) => {
      this.refreshAction = action;
      this.startRefresh();
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
