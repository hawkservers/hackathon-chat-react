import React, {Component} from 'react';
import Chat from "../Components/Lobby/Chat";

export default class Lobby extends Component {
  lobbyId = this.props.match.params.lobby;

  render() {
    return (
      <div>
        {this.lobbyId}
        <Chat/>
      </div>
    )
  }
}
