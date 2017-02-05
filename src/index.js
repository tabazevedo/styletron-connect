import React from 'react';
import { getStylesProp } from './internals';

const connect = (Component, styles, key = 'styles') => {
  const StyledElement = (props, { styletron }) => {
    return React.createElement(Component, {
      ...props,
      [key]: getStylesProp(styles, styletron, props),
    });
  };

  if (Component.displayName || Component.name) StyledElement.displayName = `Styled:${Component.displayName || Component.name}`;

  StyledElement.contextTypes = {
    styletron: React.PropTypes.object.isRequired,
  };

  return StyledElement;
};

export default connect;
