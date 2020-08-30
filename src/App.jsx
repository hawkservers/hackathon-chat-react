import React, {Component} from 'react';
import Router from "./Components/Router";
import Notifications from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

export default class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Router/>
        <Notifications/>
      </React.Fragment>
    )
  }
}
