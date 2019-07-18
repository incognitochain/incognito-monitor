import React from 'react';
import PropTypes from 'prop-types';
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

function Navbar({
  autoRefresh, onToggleAutoRefresh, refreshTime, onChangeRefreshTime,
}) {
  return (
    <BSNavBar className="navbar no-padding-left">
      <NavbarGroup align={Alignment.LEFT}>
        <NavLink
          to="/"
          isActive={(match, location) => location.pathname === '/'
            || location.pathname.indexOf('index.html') > -1}
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
      </NavbarGroup>
    </BSNavBar>
  );
}

Navbar.propTypes = {
  autoRefresh: PropTypes.bool.isRequired,
  onToggleAutoRefresh: PropTypes.func.isRequired,
  refreshTime: PropTypes.number.isRequired,
  onChangeRefreshTime: PropTypes.func.isRequired,
};

export default React.memo(Navbar);
