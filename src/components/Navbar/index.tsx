import React from 'react';
import {
  Navbar as BSNavBar,
  NavbarGroup,
  Button,
  Alignment,
  Classes,
  InputGroup, FormGroup,
} from '@blueprintjs/core';
import { NavLink } from 'react-router-dom';

import './index.scss';

type Props = {
  autoRefresh: boolean,
  onToggleAutoRefresh: () => void,
  refreshTime: string,
  onChangeRefreshTime: (time: React.FormEvent) => void,
}

const Navbar: React.FC<Props> = ({
  autoRefresh, onToggleAutoRefresh, refreshTime, onChangeRefreshTime
}) => {
  return (
    <BSNavBar className="navbar no-padding-left">
      <NavbarGroup align={Alignment.LEFT}>
        <NavLink
          isActive={(match, location) => location.pathname === '/'}
          to="/"
          activeClassName="is-active"
        >
          <Button large className={Classes.MINIMAL} text="Nodes" />
        </NavLink>
        <NavLink to="/nodes/" activeClassName="is-active">
          <Button large className={Classes.MINIMAL} text="Chains" />
        </NavLink>
        <NavLink to="/committees/" activeClassName="is-active">
          <Button large className={Classes.MINIMAL} text="Committees" />
        </NavLink>
        <NavLink to="/pending-transactions/" activeClassName="is-active">
          <Button large className={Classes.MINIMAL} text="Pending TXs" />
        </NavLink>
        <NavLink to="/tokens/" activeClassName="is-active">
          <Button large className={Classes.MINIMAL} text="Tokens" />
        </NavLink>
        <NavLink to="/rpc/" activeClassName="is-active">
          <Button large className={Classes.MINIMAL} text="RPC" />
        </NavLink>
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        <FormGroup
          className="refresh-time-input"
          label="Refresh time (ms)"
          labelFor="refresh-time"
        >
          <InputGroup
            onChange={onChangeRefreshTime}
            defaultValue={refreshTime}
            id="refresh-time"
          />
        </FormGroup>
        <Button icon="refresh" onClick={onToggleAutoRefresh} minimal>
          Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}
        </Button>
        <div className="app-version">
          V{process.env.REACT_APP_VERSION}
        </div>
      </NavbarGroup>
    </BSNavBar>
  );
};

export default React.memo(Navbar);
