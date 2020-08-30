import React, {Component} from 'react';
import Socket from "../Services/Socket";
import {Redirect} from 'react-router-dom';

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
      <div>
        <input onKeyDown={this.joinLobby} placeholder="Lobby slug"/>
        <button onClick={() => this.joinRandom()}>Join Random</button>

        <div style={{margin: 20}}>
          <input placeholder="Room Name" name="name" onChange={this.createInputChange}/>
          <input placeholder="Room Password" name="password" onChange={this.createInputChange}/>
          <button onClick={() => this.createLobby()}>Create Lobby</button>
        </div>
      </div>
    )
  }
}
