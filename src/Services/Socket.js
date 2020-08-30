import io from 'socket.io-client';
import {EventEmitter} from 'events';

/**
 * @class Socket
 * @classdesc Singleton for interacting with the socket server
 */
class Socket extends EventEmitter {
  /**
   * Creates a new Socket instance
   */
  constructor() {
    super();

    this.queued = [];
    this.connect();
  }

  /**
   * Attempts to establish a connection to the server
   */
  connect() {
    const token = localStorage.getItem('token') || '';
    this.io = io('ws://localhost:6969', {
      query: {token}
    });

    this.io.on('connect', this.onConnected);
    this.io.on('disconnect', this.onDisconnected);
    this.io.on('error', this.onError);

    this.io.on('chat.message', this.receiveMessage);
    this.io.on('lobby.join', this.receiveJoinLobby);
    this.io.on('user', this.receiveUserInfo);
  }

  /**
   * Set token for authentication
   *
   * @param {string} token
   */
  setToken(token) {
    localStorage.setItem('token', token);

    this.io.disconnect();
    this.connect();
  }

  wsEmit(...args) {
    if (!this.io.connected) {
      this.queued.push([...args]);
      return;
    }

    this.io.emit(...args);
  }

  /**
   * Fired when the socket has successfully established a connection with the server
   */
  onConnected = () => {
    console.log('[WEBSOCKET] Connected to server.');

    this.queued.forEach((queue, index) => {
      this.io.emit(...queue);
      delete this.queued[index];
    });
  }

  /**
   * Fired when the socket disconnects from the server
   */
  onDisconnected = () => {
    console.warn('[WEBSOCKET] Disconnected from server.')
  }

  /**
   * Fires when an error occurred with the client
   *
   * @param {Error} e
   */
  onError = (e) => {
    console.error('[WEBSOCKET] ' + e);
  }

  receiveUserInfo = (user) => {
    this.user = user;
    this.emit('user', user);
  }

  /**
   * Tries to create a lobby
   *
   * @param {string} slug
   * @param {string} password
   */
  createLobby(slug, password) {
    console.debug(`[WEBSOCKET] Attempting to create lobby: ${slug}.`)
    this.wsEmit('lobby.create', {
      slug, password, private: (password && password.trim() !== '')
    });
  }

  /**
   * Attempts to join a lobby
   *
   * @param {string} lobby
   * @param {string} [password]
   */
  joinLobby(lobby, password) {
    console.log(lobby);
    console.debug(`[WEBSOCKET] Attempting to join lobby (${lobby}).`);
    this.wsEmit('lobby.join', {
      lobby, password
    });
  }

  /**
   * Attempts to join a random lobby
   */
  joinRandom() {
    console.debug('[WEBSOCKET] Attempting to join a random lobby.');
    this.wsEmit('lobby.random');
  }

  /**
   * Fired when the server sends us back a server to join
   *
   * @param {string} slug
   */
  receiveJoinLobby = (slug) => {
    this.emit('lobby.join', slug);
  }

  /**
   * Emit a chat message
   *
   * @param {string} msg
   */
  sendMessage(msg) {
    console.debug(`[WEBSOCKET] Sending chat message (${msg})`);
    this.wsEmit('chat.message', msg);
  }

  /**
   * Fired when the client receives a message
   *
   * @param {object} msg
   * @param {string} msg.message
   * @param {object} msg.user
   * @param {string} msg.user.username
   * @param {string} [msg.user.avatar]
   */
  receiveMessage = (msg) => {
    console.debug(`[WEBSOCKET] Received chat message (${msg})`)
    this.emit('chat.message', msg);
  }
}

export default new Socket();
