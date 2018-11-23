import React, { Component } from 'react';
import Video from '../Video';

class Game extends Component {
	constructor(props){
		super(props);
		this.state = {
			modalBottom: 0,
			modalClosed: false,
			modalAnimationInProgress: false,
			id: null
		};
	}

	animateTo = (position) => {
		if((this.state.modalBottom <= position && !this.state.modalClosed) ||
			(this.state.modalBottom >= position && this.state.modalClosed)){
			this.setState({
				modalClosed: !this.state.modalClosed,
				modalAnimationInProgress: false
			});
			clearInterval(this.state.aTo);
		} else {
			this.setState({
				modalBottom: this.state.modalClosed ? (this.state.modalBottom + 10) : (this.state.modalBottom - 10)
			});
		}
	}

	toggleModal = () => {
		let self = this;
		if(this.state.modalAnimationInProgress){
			return
		}
		this.setState({
			aTo: setInterval((() => {
				this.animateTo(
					this.state.modalClosed ? 0 : -320
				);
			}).bind(this), 5),
			modalAnimationInProgress: true
		});
	}

	render(){
		return(
			<div className="game-container">
				<Video />
				<div className="modal-container" style={{bottom: this.state.modalBottom}}>
					adf	
				</div>
				<div style={{position: "fixed", top: 0, backgroundColor: "blue", width: "50px"}} onClick={this.toggleModal}>toggle</div>
			</div>
		);
	}
}

export default Game;