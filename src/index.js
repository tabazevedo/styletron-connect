import React from 'react';
import { injectStyle } from 'styletron-utils';

export const getStylesProp = (styles, styletron, props) => {
  const handler = exports.stylesHandlers[typeof styles] ||
    exports.stylesHandlers.default;
  return handler(styles, styletron, props);
};

export const stylesHandlers = {
  object: (st, styletron) => {
    const styles = {};
    Object.keys(st).forEach(k => {
      styles[k] = (typeof st[k] === 'object' ? injectStyle(styletron, st[k]) : st[k])
    });
    return styles;
  },
  function: (st, styletron, props) =>
    exports.getStylesProp(st(props), styletron, props),
  default: st => {
    throw new Error(`you must pass a function or object to styletron-connect (got ${typeof st})`);
  },
};

const connect = (Component, styles, key = 'styles') => {
  const StyledElement = (props, { styletron }) => {
    return React.createElement(Component, {
      ...props,
      [key]: exports.getStylesProp(styles, styletron, props),
    });
  };

  if (Component.displayName || Component.name) StyledElement.displayName = `Styled:${Component.displayName || Component.name}`;

  StyledElement.contextTypes = {
    styletron: React.PropTypes.object.isRequired,
  };

  return StyledElement;
};

export default connect;
