import React, {Component} from 'react';
import Socket from "../Services/Socket";
import {Redirect} from 'react-router-dom';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import "./home.scss"

export default class Home extends Component {
  state = {
    create: {
      name: '',
      password: null
    },
    joinLobby: null
  }

  componentDidMount() {
    Socket.addListener('lobby.join', this.onLobbyJoin);
  }

  componentWillUnmount() {
    Socket.removeListener('lobby.join', this.onLobbyJoin);
  }

  onLobbyJoin = (slug) => {
    this.setState({
      joinLobby: slug
    });
  }

  joinLobby = (event) => {
    if (event.key !== "Enter") return;

    let val = event.target.value;
    Socket.joinLobby(val);
  };

  joinRandom = () => {
    Socket.joinRandom();
  }

  createInputChange = (event) => {
    const target = event.target;
    if (target.name !== 'name' && target.name !== 'password') return;

    this.setState({
      create: {
        ...this.state.create,
        [target.name]: target.value
      }
    });
  }

  createLobby = () => {
    const {create} = this.state;
    Socket.createLobby(create.name, create.password);
  }

  render() {
    if (this.state.joinLobby) {
      return <Redirect to={"/" + this.state.joinLobby} />
    }

    return (
      <div className="home">
        <div className="container">
          <div className="user">
            <img alt="User Avatar" src="https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"/>
            <span>Guest</span>
          </div>
          <div className="room">
            <div className="options">
              <button className="option">Join</button>
              <button className="option">Create</button>
            </div>
            {/*<div className="join">*/}
            {/*  <input onKeyDown={this.joinLobby} placeholder="Lobby slug"/>*/}
            {/*  <div className="flex">*/}
            {/*    <button onClick={() => this.joinRandom()}>Join</button>*/}
            {/*    <button onClick={() => this.joinRandom()}>Random</button>*/}
            {/*  </div>*/}
            {/*</div>*/}
            <div className="create">
              <input placeholder="Room Name" name="name" onChange={this.createInputChange}/>
              <input placeholder="Room Password" name="password" onChange={this.createInputChange}/>
              <button onClick={() => this.createLobby()}>Create Lobby</button>
            </div>
          </div>
          <div className="logins">
            <button className="login">
              {/*<FontAwesomeIcon icon={}/>*/}
              GitHub
            </button>
            <button className="login">Discord</button>
          </div>
        </div>
      </div>
    )
  }
}
