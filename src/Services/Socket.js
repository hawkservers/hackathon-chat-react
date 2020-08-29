import io from 'socket.io-client';
import {EventEmitter} from 'events';

/**
 * @class Socket
 * @classdesc Singleton for interacting with the socket server
 */
class Socket extends EventEmitter {
  /**
   * Creates a new Socket instance and attempts to connect to the server
   */
  constructor() {
    super();

    this.io = io('ws://localhost:6969');

    this.io.on('connect', this.onConnected);
    this.io.on('disconnect', this.onDisconnected);
    this.io.on('chat.message', this.receiveMessage);
  }

  /**
   * Fired when the socket has successfully established a connection with the server
   */
  onConnected = () => {
    console.log('[WEBSOCKET] Connected to server.');
  }

  /**
   * Fired when the socket disconnects from the server
   */
  onDisconnected = () => {
    console.log('[WEBSOCKET] Disconnected from server.')
  }

  /**
   * Emit a chat message
   *
   * @param {string} msg
   */
  sendMessage = (msg) => {
    console.log(`[WEBSOCKET] Sending chat message (${msg})`)
    this.io.emit('chat.message', msg);
  }

  /**
   * Fired when the client receives a message
   *
   * @param {string} msg
   */
  receiveMessage = (msg) => {
    console.log(`[WEBSOCKET] Received chat message (${msg})`)
    this.emit('chat.message', msg);
  }

  sendWebcam = (str) => {
    this.io.emit('webcam', str);
  };
}

export default new Socket();
