import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

/* Pages */
import Home from './pages/Home';

class PageManager extends Component {
  render() {
    return (
      <React.Fragment>
        <header>
        </header>
        <main>
          <Switch>
            <Route exact path="/" component={Home} />
          </Switch>
        </main>
        <footer>
        </footer>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  router: state.router
});

export default connect(mapStateToProps)(PageManager);
