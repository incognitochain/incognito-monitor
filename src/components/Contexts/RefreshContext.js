import React from 'react';

const RefreshContext = React.createContext({
  autoRefresh: true,
  refreshTime: 5000,
});

export default RefreshContext;
