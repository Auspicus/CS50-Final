/* React */
import React, { Component } from 'react';
import { createBrowserHistory } from 'history'
import { ConnectedRouter, connectRouter, routerMiddleware } from 'connected-react-router'

/* Pages */
import PageManager from './PageManager';

/* State */
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import reducers from './state/reducers';
import middleware from './state/middleware';
import logger from './state/logger';
if (process.env.NODE_ENV === 'development') {
  middleware.push(logger);
}
const history = createBrowserHistory();
history.listen(() => {
  window.scrollTo(0, 0);
});
middleware.push(routerMiddleware(history));
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const preloadedState = window.__PRELOADED_STATE__ || {};
const store = createStore(
  connectRouter(history)(reducers),
  preloadedState,
  composeEnhancers(applyMiddleware.apply(null, middleware)),
);

class App extends Component {
  componentDidMount() {
    /**
      = SSR =
      This interval loops until your content has loaded.
      This should be instantly on the client but it will
      loop for a while on the server until your API responds
      with the initial data.
    */
    let snapshot;
    const interval = setInterval(() => {
      snapshot = store.getState();
      if (
        true // Use this to check whether your state has already been loaded
      ) {
        const preloadedState = document.createElement('script');
        preloadedState.innerHTML = `window.__PRELOADED_STATE__ = ${JSON.stringify(snapshot)};`;
        document.body.insertBefore(preloadedState, document.body.firstChild);
        clearInterval(interval);
      }
    }, 1000);
    /** END SSR **/
  }

  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <PageManager />
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
