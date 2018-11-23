import React, { Component } from 'react';
import Hls from 'hls.js';

class Video extends Component {
	constructor(props) {
		super(props);
		this.state = {
			src: 'https://dax6jm3kkv5ekk.data.mediastore.us-west-2.amazonaws.com/p/index.m3u8'
		};
	}

	componentDidMount(){
		// Supports MediaSource API
		if(Hls.isSupported()) {
			var hls = new Hls();
			hls.loadSource(this.state.src);
			hls.attachMedia(this.player);
			hls.on(Hls.Events.MANIFEST_PARSED, (() => {
				this.player.play();
			}).bind(this));
		// Safari Mobile Detected
		} else if (this.player.canPlayType('application/vnd.apple.mpegurl')) {
			this.player.src = this.state.src;
			this.player.addEventListener('loadedmetadata', (() => {
				this.player.play();
			}).bind(this));
		}
	}

	render(){
		return(
			<div className="video-container">
				<video ref={(player) => this.player = player} autoPlay muted></video>
				<div className="mute-container">
					<button onClick={this.toggleMute} className="mute-button btn btn-sm btn-warning">Un-mute</button>	
				</div>
			</div>
		);
	}
}

export default Video;