import React from 'react';
import {
  Navbar as BSNavBar,
  NavbarGroup,
  Button,
  Alignment,
  Classes,
} from '@blueprintjs/core';
import { Link } from 'react-router-dom';

import './index.scss';

function Navbar() {
  return (
    <BSNavBar className="navbar no-padding-left">
      <NavbarGroup align={Alignment.LEFT}>
        <Link to="/">
          <Button large className={Classes.MINIMAL} icon="layout-grid" text="Nodes" />
        </Link>
        <Link to="/blocks">
          <Button large className={Classes.MINIMAL} icon="layout-grid" text="Blocks" />
        </Link>
      </NavbarGroup>
    </BSNavBar>
  );
}

export default React.memo(Navbar);
