import React, { Component } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { print as gqlToString } from 'graphql/language';
import { onCreateQuestion, onUpdateQuestion } from '../../graphql/subscriptions';

import Video from '../Video';
import Modal from '../Modal';

class Game extends Component {
	constructor(props){
		super(props);
		this.state = {
			modalVisible: false,
			modalBackground: "#FFFFFF",
			question: {},
			answer: {},
			questionAvailable: false,
			answerAvailable: false,
			answerChosen: "",
			selectedAnswerButton: null,
			buttonsDisabled: false,
			questionCount: 0,
			wrongQuestions: [],
			gameOver: false,
			winner: false,
			loser: false
		};
	}

	componentDidMount(){
		this.listenForQuestions();
		this.listenForAnswers();
	}

	listenForQuestions = () => {
		let self = this;
		API.graphql(
			graphqlOperation(onCreateQuestion)
		).subscribe({
			next: (data) => {
				self.setState({
					question: data.value.data,
					answerAvailable: false,
					questionAvailable: true,
					modalVisible: true
				});
			}
		})
	}

	listenForAnswers = () => {
		let self = this;
		API.graphql(
			graphqlOperation(onUpdateQuestion)
		).subscribe({
			next: (data) => {
				self.setState({
					answer: data.value.data,
					answerAvailable: true,
					questionAvailable: false,
					modalVisible: true
				});
			}
		})
	}

	game = () => {
		return(
			<div>asdfadsfadfadfa</div>
		);
	}

	render(){
		return(
			<div className="game-container">
				<Video />
				<Modal visible={this.state.modalVisible}>
					{ this.game() }
				</Modal>
			</div>
		);
	}
}

export default Game;