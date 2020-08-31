import {EventEmitter} from 'events';
import LocalCamera from "./LocalCamera";
import PeerJs from "peerjs";

class LobbyController extends EventEmitter {
  isLobbyCreator = false;
  roomId;
  selfPeer;
  peerId;
  peers = {};

  iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      {
        urls: 'turn:turn.zeodev.cc:5379',
        username: '',
        credential: '',
      },
    ],
  };

  constructor() {
    super();

    this.getPeer();
  }

  getPeer() {
    this.selfPeer = new PeerJs(undefined, {
      host: '/',
      port: 9000,
      config: this.iceServers
    });

    this.selfPeer.on('open', (id) => {
      this.peerId = id;
      this.emit('peer', this.peerId);
    })


    this.selfPeer.on('call', async (call) => {
      console.log('call');
      call.answer(await LocalCamera.startCamera());

      this.setupCall(call);
      this.emit('call', this.peers[call.peer]);
    });
  }

  setupCall(call) {
    this.peers[call.peer] = {
      call: call,
    };

    call.on('close', () => {
      this.emit('close', this.peers[call.peer]);
      delete this.peers[call.peer];
    })
  }

  registerEvents = (io) => {
    // Joining events
    io.on('lobby.created', this.roomCreated);
    io.on('lobby.join', this.roomJoin)

    // User events
    io.on('lobby.user.join', this.userJoin);
    io.on('lobby.user.disconnected', this.userJoin);
  }

  roomCreated = () => {
    console.debug('[WEBSOCKET] [LOBBY:ROOM] Created lobby');

    this.isLobbyCreator = true;
    this.emit('room.created');
  }

  roomJoin = () => {
    console.debug('[WEBSOCKET] [LOBBY:ROOM] Joined lobby');

    this.isLobbyCreator = false;
    this.emit('room.joined')
  }

  userJoin = async (data) => {
    console.debug('[WEBSOCKET] [LOBBY:USER] User joined lobby', data.username);

    const call = this.selfPeer.call(data.peer, await LocalCamera.startCamera());

    this.setupCall(call);
    this.emit('call', this.peers[call.peer]);
  }

  userDisconnect = (data) => {
    console.debug('[WEBSOCKET] [LOBBY:USER] User joined left', data.username);
    this.peers[data.peer].call.close();
  }
}

export default new LobbyController();
