import React, {Component} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Routes from './Routes';

export default class Router extends Component {
  /**
   * Render a individual link
   *
   * @param {object} link
   * @param {string} link.path
   * @param {ComponentType} link.component
   * @param {number} index
   * @returns {JSX.Element}
   */
  renderLink(link, index) {
    return (
      <Route exact path={link.path} component={link.component} key={index} />
    );
  }

  /**
   * Render the router
   *
   * @returns {JSX.Element}
   */
  render() {
    return (
      <BrowserRouter>
        <Switch>
          {Routes.map(this.renderLink)}
        </Switch>
      </BrowserRouter>
    )
  }
}
