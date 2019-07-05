import React from 'react';
import {
  Navbar as BSNavBar,
  NavbarGroup,
  NavbarHeading,
  NavbarDivider,
  Button,
  Alignment,
  Classes,
} from '@blueprintjs/core';
import { Link } from 'react-router-dom';

import logo from 'logo.svg';
import './index.scss';

function Navbar() {
  return (
    <BSNavBar className="navbar">
      <NavbarGroup align={Alignment.Left}>
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <NavbarHeading>Incognito Monitor</NavbarHeading>
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        <NavbarDivider />
        <Link to="/">
          <Button className={Classes.MINIMAL} icon="layout-grid" text="Nodes" />
        </Link>
        <Link to="/blocks">
          <Button className={Classes.MINIMAL} icon="layout-grid" text="Blocks" />
        </Link>
      </NavbarGroup>
    </BSNavBar>
  );
}

export default React.memo(Navbar);
