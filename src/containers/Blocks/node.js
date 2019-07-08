import React from 'react';
import { MenuItem } from '@blueprintjs/core';

export default function Node(node) {
  return (
    <MenuItem
      text={node.name}
    />
  );
}
