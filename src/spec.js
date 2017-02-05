import { expect } from 'chai';
import { shallow } from 'enzyme';
import { describe, it } from 'mocha';
import React from 'react';
import sinon from 'sinon';
import Styletron from 'styletron-server';
import styletronUtils from 'styletron-utils';

import * as styletronConnect from './index';

const Mock = () => <span />;

const { default: connect, getStylesProp, stylesHandlers } = styletronConnect;

describe('styletron-connect/connect', () => {
  it('returns a higher order component which resolves styles', () => {
    const styletron = new Styletron();
    const styleMap = { test: true };
    const atomicStyles = { test: 'some classnames' };
    const stub = sinon
      .stub(styletronConnect, 'getStylesProp')
      .returns(atomicStyles);

    const HOC = connect(Mock, styleMap);
    const wrapper = shallow(<HOC />, { context: { styletron } });

    expect(stub).to.have.been.calledWith(styleMap, styletron, {});
    expect(wrapper.find(Mock).props()).to.contain({ styles: atomicStyles });
    stub.restore();
  });

  it('passes through other props to wrapped component', () => {
    const styletron = new Styletron();
    const styleMap = { test: true };
    const props = { hello: 'world' };
    const stub = sinon.stub(styletronConnect, 'getStylesProp').returns(styleMap);

    const HOC = connect(Mock, styleMap);
    const wrapper = shallow(<HOC {...props} />, { context: { styletron } });

    expect(stub).to.have.been.calledWith(styleMap, styletron, props);
    expect(wrapper.find(Mock).props()).to.contain(props);
    stub.restore();
  });

  it('allows mapping styles to a custom prop key', () => {
    const styletron = new Styletron();
    const styleMap = { test: true };
    const atomicStyles = { test: 'some classnames' };
    const key = 'booty';
    const stub = sinon
      .stub(styletronConnect, 'getStylesProp')
      .returns(atomicStyles);

    const HOC = connect(Mock, styleMap, key);
    const wrapper = shallow(<HOC />, { context: { styletron } });

    expect(stub).to.have.been.calledWith(styleMap, styletron, {});
    expect(wrapper.find(Mock).props()).to.contain({ [key]: atomicStyles });
    stub.restore();
  });
});

describe('styletron-connect/getStylesProp', () => {
  it('passes arguments to correct handler based on passed type', () => {
    const styletron = new Styletron();
    const props = {};
    const stubs = [
      sinon.stub(stylesHandlers, 'object'),
      sinon.stub(stylesHandlers, 'function'),
      sinon.stub(stylesHandlers, 'default'),
    ];

    let args = [{ test: true }, styletron, props];
    getStylesProp(...args);
    expect(stylesHandlers.object).to.have.been.calledWith(...args);

    args = [() => ({ test: true }), styletron, props];
    getStylesProp(...args);
    expect(stylesHandlers.function).to.have.been.calledWith(...args);

    // Use default for unhandled types
    args = ['hello', styletron, props];
    getStylesProp(...args);
    expect(stylesHandlers.default).to.have.been.calledWith(...args);

    stubs.forEach(s => s.restore());
  });
});

describe('styletron-connect/stylesHandlers:object', () => {
  it('maps object values to atomic classes when value is an object', () => {
    const styletron = new Styletron();
    const stub = sinon.stub(styletronUtils, 'injectStyle').returns('classname');

    const styleMap = {
      col: { someCSSProperty: '12px' },
      row: { someCSSProperty: '15px' },
    };

    const styles = stylesHandlers.object(styleMap, styletron);

    expect(stub).to.have.been.calledWith(styletron, styleMap.col);
    expect(stub).to.have.been.calledWith(styletron, styleMap.row);

    expect(styles).to.deep.eq({
      col: 'classname',
      row: 'classname',
    });

    stub.restore();
  });

  it('leaves values in place when value is not an object', () => {
    const styletron = new Styletron();
    const stub = sinon.stub(styletronUtils, 'injectStyle').returns('a');

    const styleMap = {
      col: { someCSSProperty: '12px' },
      row: 'row',
    };

    const styles = stylesHandlers.object(styleMap, styletron);

    expect(stub).to.have.been.calledWith(styletron, styleMap.col);
    expect(stub).not.to.have.been.calledWith(styletron, styleMap.row);

    expect(styles).to.deep.eq({
      col: 'a',
      row: 'row',
    });

    stub.restore();
  });
});

describe('styletron-connect/stylesHandlers:function', () => {
  it('resolves function with passed props, and passes to handler', () => {
    const styletron = new Styletron();
    const stub = sinon
      .stub(styletronUtils, 'injectStyle')
      .returns('classname');

    const spy = sinon.spy(stylesHandlers, 'object');

    const resolveStyles = (props) => ({
      col: { someCSSProperty: `${props.width}` }
    });

    const props = { width: 100 };

    const styles = stylesHandlers.function(resolveStyles, styletron, props);

    expect(spy).to.have.been.calledWith(resolveStyles(props), styletron);
    expect(stub).to.have.been.calledWith(styletron, resolveStyles(props).col);

    expect(styles).to.deep.eq({
      col: 'classname',
    });

    stub.restore();
    spy.restore();
  });
});

describe('styletron-connect/stylesHandlers:default', () => {
  it('throws an exception for unhandled types', () => {
    const fn = (st) => () => stylesHandlers.default(st);
    expect(fn(null)).to.throw;
    expect(fn(12)).to.throw;
    expect(fn(['hey'])).to.throw;
    expect(fn(undefined)).to.throw;
  });
});
