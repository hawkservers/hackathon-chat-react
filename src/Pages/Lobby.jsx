import React, {Component} from 'react';
import Chat from "../Components/Lobby/Chat";
import Cams from "../Components/Lobby/Cams";
import "./lobby.scss";
import Socket from "../Services/Socket";
import {faMicrophone, faPhoneSlash, faRandom, faVideo} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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
            <button className="button">
              <FontAwesomeIcon icon={faMicrophone}/>
            </button>
            <button className="button">
              <FontAwesomeIcon icon={faVideo}/>
            </button>
            <button className="button" style={{background: "#FF5E5E"}}>
              <FontAwesomeIcon icon={faPhoneSlash}/>
            </button>
            <button type="button" className="button" onClick={() => Socket.joinRandom()}>
              <FontAwesomeIcon icon={faRandom}/>
            </button>
        </div>
        <Chat/>
      </div>
    )
  }
}
