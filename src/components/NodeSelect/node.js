import React from 'react';
import { MenuItem } from '@blueprintjs/core';

export default function Node(node, { handleClick }) {
  return (
    <MenuItem text={node.name} onClick={handleClick} />
  );
}
