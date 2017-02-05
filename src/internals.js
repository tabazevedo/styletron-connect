import { injectStyle } from 'styletron-utils';

export const getStylesProp = (styles, styletron, props) => {
  const handler = stylesHandlers[typeof styles] ||
    stylesHandlers.default;
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
    getStylesProp(st(props), styletron, props),
  default: st => {
    throw new Error(`you must pass a function or object to styletron-connect (got ${typeof st})`);
  },
};
