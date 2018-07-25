import React from 'react';
import ReactDOM from 'react-dom';
import { Root } from './components/Root';

const render = (App: React.ComponentType) => {
  ReactDOM.render(
      <App />,
    document.getElementById('app'),
  );
};

render(Root);

if (module.hot) {
  module.hot.accept('./components/Root', () => {
    // eslint-disable-next-line
    const nextApp = require('./components/Root').default;
    render(nextApp);
  });
}