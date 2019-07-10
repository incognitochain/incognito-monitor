import React from 'react';
import {
  Navbar as BSNavBar,
  NavbarGroup,
  Button,
  Alignment,
  Classes,
} from '@blueprintjs/core';
import { NavLink } from 'react-router-dom';

import './index.scss';

function Navbar() {
  return (
    <BSNavBar className="navbar no-padding-left">
      <NavbarGroup align={Alignment.LEFT}>
        <NavLink
          to="/"
          isActive={(match, location) => location.pathname === '/'
            || location.pathname.indexOf('index.html') > -1}
          activeClassName="is-active"
        >
          <Button large className={Classes.MINIMAL} icon="database" text="Nodes" />
        </NavLink>
        <NavLink to="/nodes/" activeClassName="is-active">
          <Button large className={Classes.MINIMAL} icon="code-block" text="Chains" />
        </NavLink>
      </NavbarGroup>
    </BSNavBar>
  );
}

export default React.memo(Navbar);
