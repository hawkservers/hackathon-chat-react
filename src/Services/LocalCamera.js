class LocalCamera {
  localStream;

  async startCamera() {
    if (this.localStream) return this.localStream;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {width: 1280, height: 720},
    }).catch(err => {
      console.debug('[WEBSOCKET] [CAMERA] Failed to start camera', err);

      alert('Failed to start camera');
    });

    this.localStream = stream

    return stream;
  }
}

export default new LocalCamera();
