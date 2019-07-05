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
        <Button className={Classes.MINIMAL} icon="home" text="Home" />
        <Button className={Classes.MINIMAL} icon="document" text="Files" />
      </NavbarGroup>
    </BSNavBar>
  );
}

export default React.memo(Navbar);
