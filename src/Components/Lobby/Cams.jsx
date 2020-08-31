import React, {Component} from "react";
import LocalCamera from "../../Services/LocalCamera";
import "./cams.scss";

export default class Cams extends Component {
  camRefs = {};
  state = {camSet: false};

  componentDidMount() {
    if (this.state.camSet) {
      this.setLocalStream();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.camSet && !prevState.camSet) {
      this.setLocalStream();
    }
  }

  async setLocalStream() {
    this.camRefs.local.srcObject = await LocalCamera.startCamera();
  }

  render() {
    return (
      <div className="cams">
        <video muted autoPlay className="cam" ref={ref => {
          this.camRefs.local = ref;
          if (!this.state.camSet)
            this.setState({camSet: true})
        }}/>
        {/*<div className="cam"/>*/}
        {/*<div className="cam"/>*/}
        {/*<div className="cam"/>*/}
      </div>
    )
  }
}
