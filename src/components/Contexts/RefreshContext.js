import React from 'react';

const RefreshContext = React.createContext({
  autoRefresh: false,
  refreshTime: 5000,
});

export default RefreshContext;
