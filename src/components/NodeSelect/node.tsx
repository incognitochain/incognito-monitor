import React from 'react';
import { MenuItem } from '@blueprintjs/core';
import { ItemRenderer } from "@blueprintjs/select";

import { Node } from 'interfaces';

export const renderNode: ItemRenderer<Node> = (node: Node, { handleClick }) => {
  return (
      <MenuItem text={node.name} onClick={handleClick} />
  );
};