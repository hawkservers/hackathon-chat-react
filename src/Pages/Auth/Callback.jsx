import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import Socket from "../../Services/Socket";

export default class Callback extends Component {
  componentDidMount() {
    const {match: {params: {token}}} = this.props;
    Socket.setToken(token);
  }

  render() {
    return (
      <Redirect to={"/"} />
    )
  }
}
