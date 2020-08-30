import React, {Component} from 'react';
import Socket from "../Services/Socket";
import {Redirect} from 'react-router-dom';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub, faDiscord} from "@fortawesome/free-brands-svg-icons";

import "./home.scss"

export default class Home extends Component {
  state = {
    user: null,
    create: {
      name: '',
      password: null
    },
    joinLobbyInput: '',
    joinLobby: null
  }

  componentDidMount() {
    Socket.addListener('lobby.join', this.onLobbyJoin);
    Socket.addListener('user', this.onUserInfo);
  }

  componentWillUnmount() {
    Socket.removeListener('lobby.join', this.onLobbyJoin);
    Socket.removeListener('user', this.onUserInfo);
  }

  onLobbyJoin = (lobby) => {
    this.setState({
      joinLobby: lobby.slug
    });
  }

  onUserInfo = (user) => {
    this.setState({
      user
    });
  }

  joinInputChange = (lobby) => {
    this.setState({
      joinLobbyInput: lobby
    });
  }

  joinLobby = () => {
    let {joinLobbyInput} = this.state;
    if (joinLobbyInput.trim() === '') return;

    Socket.joinLobby(joinLobbyInput);
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

  redirectToAuth = (method) => {
    window.location.href = 'http://localhost:4000/login/' + method;
  }

  toggleTab = (event) => {
    let el = event.target;
    let id = el.id;

    let curActive = document.getElementsByClassName('tab-active');
    if (curActive.length > 0) {
      curActive[0].classList.remove('tab-active');
    }

    let curActiveOption = document.getElementsByClassName('option-active');
    if (curActiveOption.length > 0) {
      curActiveOption[0].classList.remove('option-active');
    }

    let tabName = id.split('-')[1];
    if (!tabName) return;

    let tab = document.getElementById(`${tabName}-tab`);
    tab.classList.add('tab-active');
    el.classList.add('option-active');
  }

  createLobby = () => {
    const {create} = this.state;
    Socket.createLobby(create.name, create.password);
  }

  render() {
    if (this.state.joinLobby) {
      return <Redirect to={"/" + this.state.joinLobby} />
    }

    const {user} = this.state;

    return (
      <div className="home">
        <div className="container">
          <div className="user">
            <img alt="User Avatar" src={user?.avatar || '/img/guest.png'}/>
            <span>{user?.username || 'Guest'}</span>
          </div>
          <div className="room">
            <div className="options">
              <button className="option option-active" id="toggle-join" onClick={this.toggleTab}>Join</button>
              <button className="option" id="toggle-create" onClick={this.toggleTab}>Create</button>
            </div>
            <div className="join tab tab-active" id="join-tab">
              <input onChange={(e) => this.joinInputChange(e.target.value)} placeholder="Lobby ID"/>
              <div className="flex">
                <button onClick={() => this.joinLobby()}>Join</button>
                <button onClick={() => this.joinRandom()}>Random</button>
              </div>
            </div>
            <div className="create tab" id="create-tab">
              <input placeholder="Name" name="name" onChange={this.createInputChange}/>
              <input placeholder="Password (Optional)" name="password" onChange={this.createInputChange}/>
              <button onClick={() => this.createLobby()}>Create Lobby</button>
            </div>
          </div>
          <div className="logins">
            <button className="login" onClick={() => this.redirectToAuth('github')}>
              <FontAwesomeIcon className="icon" icon={faGithub}/>
              Login with GitHub
            </button>
            <button className="login" style={{background: "#738ADB"}} onClick={() => this.redirectToAuth('discord')}>
              <FontAwesomeIcon className="icon" icon={faDiscord}/>
              Login with Discord
            </button>
          </div>
        </div>
      </div>
    )
  }
}
