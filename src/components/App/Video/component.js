import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import ReactNativeVideoPlayer from 'react-native-video';

class Video extends Component {
	constructor(props){
		super(props);
		this.state = {
			dimensions: Dimensions.get('window'),
			styles: {
				height: null,
				width: null
			}
		};
	}

	setVideoDimensions = () => {
		this.setState({
			styles: {
				...this.state.styles,
				height: this.state.dimensions.scale * this.state.dimensions.width,
				width: this.state.dimensions.scale * this.state.dimensions.height
			}
		});
	}

	componentDidMount(){
		this.setVideoDimensions();
	}

	render(){
		return(
			<ReactNativeVideoPlayer
				//source={{uri: "https://content.jwplatform.com/manifests/yp34SRmf.m3u8"}}
				source={{uri: "https://dax6jm3kkv5ekk.data.mediastore.us-west-2.amazonaws.com/p/index.m3u8"}}
				ref={(ref) => {
					this.player = ref
				}}
				resizeMode={"stretch"}
				muted={true}
				style={{
					minWidth: Dimensions.get('window').width + 200,
					minHeight: Dimensions.get('window').height,
					left: -100
				}}
			/>
		);
	}
}

export default Video;
