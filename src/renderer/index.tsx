import React from 'react';
import ReactDOM from 'react-dom';
import RootContainer from './containers/RootContainer';
import { Provider } from "react-redux";
import store from "./store/index";
import './assets/css/photon.scss';
import './assets/css/bootstrap-grid.scss';

let appEl = document.getElementById('app');
if (appEl) {
  appEl.classList.add('window');
}

const render = (App:any) => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('app'),
  );
};

render(RootContainer);

if (module.hot) {
  module.hot.accept('./components/Root', () => {
    // eslint-disable-next-line
    const nextApp = require('./components/Root').default;
    render(nextApp);
  });
}