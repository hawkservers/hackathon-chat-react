import React, {Component} from 'react';
import "./chat.scss";
import Socket from "../../Services/Socket";

export default class Chat extends Component {
  state = {
    messages: []
  };

  msgContainer = React.createRef();

  /**
   * Add event listener for messages when mounted
   */
  componentDidMount() {
    Socket.addListener('chat.message', this.onMessage);
  }

  /**
   * Remove event listener for messages when the component is about the be unmounted
   */
  componentWillUnmount() {
    Socket.removeListener('chat.message', this.onMessage);
  }

  /**
   * On message event
   *
   * @param {object} msg
   */
  onMessage = (msg) => {
    this.setState({
      messages: [
        ...this.state.messages,
        msg
      ]
    }, () => {
      // Scroll container to bottom
      let {current} = this.msgContainer;
      current.scrollTop = current.scrollHeight;
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
   * @param {object} msg
   * @param {string} msg.message
   * @param {object} msg.user
   * @param {string} msg.user.username
   * @parma {string} [msg.user.avatar]
   * @param {number} index
   * @returns {JSX.Element}
   */
  renderMessage = (msg, index) => {
    return (
      <div className="messageContainer" key={index}>
        <span className="name">{ msg.user.username }</span>
        <div className="splitter">
          <img alt="User Avatar" src={msg.user.avatar || '/img/guest.png'} className="image"/>
          <div className="message">
            { msg.message }
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
        <div className="messageList" ref={this.msgContainer}>
          {messages.map(this.renderMessage)}
        </div>
        <input placeholder="Send a message" onKeyDown={this.sendMessage} />
      </div>
    )
  }
}
