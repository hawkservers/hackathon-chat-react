import React, {Component} from 'react';
import "./chat.scss"
import Socket from "../../Services/Socket";

export default class Chat extends Component {
  state = {
    messages: []
  };

  messageList = React.createRef();

  componentDidMount() {
    Socket.addListener('chat.message', this.onMessage);
  }

  componentWillUnmount() {
    Socket.removeListener('chat.message', this.onMessage);
  }

  onMessage = (msg) => {
    this.setState({
      messages: [
        ...this.state.messages,
        msg
      ]
    });
  };

  /**
   * Sends a message through the websocket client
   *
   * @param {KeyboardEvent<HTMLInputElement>} event
   */
  sendMessage = (event) => {
    if (event.key !== "Enter") return;

    let msg = event.target.value;
    if (msg.trim() === '') return;

    Socket.sendMessage(msg);
    event.target.value = '';
  }

  /**
   * Renders an individual message
   *
   * @param {string} msg
   * @param {number} index
   * @returns {JSX.Element}
   */
  renderMessage = (msg, index) => {
    return (
      <div className="messageContainer" key={index}>
        <span className="name">Guest</span>
        <div className="splitter">
          <img alt="User Image" src="https://i.pinimg.com/736x/33/32/6d/33326dcddbf15c56d631e374b62338dc.jpg" className="image"/>
          <div className="message">
            {msg}
          </div>
        </div>
      </div>
    )
  };

  /**
   * Renders the lobby chat
   *
   * @returns {JSX.Element}
   */
  render() {
    const {messages} = this.state;

    return (
      <div className="chat">
        <div className="messageList" ref={this.messageList}>
          {messages.map(this.renderMessage)}
        </div>
        <input placeholder="Send a message" onKeyDown={this.sendMessage} />
      </div>
    )
  }
}
