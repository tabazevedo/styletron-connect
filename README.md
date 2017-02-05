# styletron-connect

[![Build Status](https://circleci.com/gh/tabazevedo/styletron-connect.svg?style=shield)](https://circleci.com/gh/tabazevedo/styletron-connect)

`npm install --save styletron-connect`

### What is it?

`styletron-connect` provides an alternative higher-level API to styletron-react.
Instead of wrapping single components in a `styled()` call, you add a decorator around
your entire component which will resolve a styles object and pass it through for you.

### Usage

`styletron-connect`, like `styletron-react`, supports passing both a static
object and a function that takes props, and returns an object.

##### Static styles

```js
import connectStyles from 'styletron-connect';

const Panel = ({ styles, children }) => (
  <div className={styles.panel}>
    {children}
  </div>
);

export default connectStyles(Panel, {
  panel: {
    backgroundColor: 'lightblue',
    fontSize: '12px'
  }
});

<Panel>Hello World</Panel>
```

##### Using props in styles

```js
import connectStyles from 'styletron-connect';

const Panel = ({ styles, children }) => (
  <div className={styles.main}>
    {children}
  </div>
);

export default connectStyles(Panel, (props) => ({
  backgroundColor: props.alert ? 'orange' : 'lightblue',
  fontSize: '12px'
}));

<Panel alert>Danger!</Panel>
```
