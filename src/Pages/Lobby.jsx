import React, {Component} from 'react';
import Chat from "../Components/Lobby/Chat";
import Cams from "../Components/Lobby/Cams";

import "./lobby.scss";
import Socket from "../Services/Socket";

export default class Lobby extends Component {
  lobbyId = this.props.match.params.lobby;

  componentDidMount() {
    Socket.joinLobby(this.lobbyId);
  }

  render() {
    return (
      <div className="lobby">
        <span className="title">{this.lobbyId}</span>
          <Cams/>
        <div className="buttons">
            <div className="button"/>
            <div className="button"/>
            <div className="button"/>
            <div className="button"/>
        </div>
        <Chat/>
      </div>
    )
  }
}
