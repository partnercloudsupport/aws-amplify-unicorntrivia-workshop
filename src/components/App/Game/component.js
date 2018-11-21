import React, { Component } from 'react';
import { Image, Platform, View, TouchableOpacity, Text } from 'react-native';
// Amplify and GraphQL
import { API, graphqlOperation } from "aws-amplify";
import { print as gqlToString } from 'graphql/language';
import { OnCreateQuestion, OnUpdateQuestion } from '../../../../graphql/subscriptions';
// UI Components
import ViewContainer from '../../Common/ViewContainer';
import Video from '../Video';
import Modal from '../Modal';
import Timer from '../Timer';
import styles from './styles';

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
			graphqlOperation(gqlToString(OnCreateQuestion))
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
			graphqlOperation(gqlToString(OnUpdateQuestion))
		).subscribe({
			next: (data) => {
				setTimeout(() => {
					self.setState({
						answer: data.value.data,
						answerAvailable: true,
						questionAvailable: false,
						modalVisible: true
					});
				}, 1000);
			}
		})
	}
	
	answerChosen = (index) => {
		this.setState({
			questionsAnswered: true,
			selectedAnswerButton: index,
			buttonsDisabled: true,
			answerChosen: {
				index: index,
				answer: this.state.question.onCreateQuestion.answers[index]
			},
			questionCount: this.state.questionCount + 1
		});
	}

	button = (index, value) => {
		let self = this;
		let touchableOpacityBackgroundColor,
			touchableOpacityBorderColor,
			textColor;
		if(this.state.questionAvailable){
			backgroundColor = this.state.selectedAnswerButton == index ? "#666666" : "#FFFFFF";
			borderColor = this.state.selectedAnswerButton == index ? "#666666" : "#CCCCCC";
			color = this.state.selectedAnswerButton == index ? "#FFFFFF" : "#000";

		} else if(this.state.answerAvailable){
			if(value == this.state.answer.onUpdateQuestion.answers[this.state.answer.onUpdateQuestion.answerId]){
				touchableOpacityBackgroundColor = "#02DC2A";
				touchableOpacityBorderColor = "#02DC2A";
				textColor = "#FFFFFF";
			} else {
				backgroundColor = this.state.answerChosen.index == index ? "#FE0000" : "#FFFFFF";
				borderColor = this.state.answerChosen.index == index ? "#FE0000" : "#CCCCCC";
				color = this.state.answerChosen.index == index ? "#FFFFFF" : "#000";
			}
		}
		return(
			<TouchableOpacity
				key={index}
				disabled={this.state.buttonsDisabled}
				onPress={this.state.questionAvailable ? ((e) => self.answerChosen(index)) : null}
				style={{
					...styles.answerButton,
					backgroundColor: touchableOpacityBackgroundColor,
					borderColor: touchableOpacityBorderColor
				}}
			>
				<Text
					key={index}
					style={{
						...styles.answerButtonText,
						color: textColor
					}}
				>{ value }</Text>
			</TouchableOpacity>
		);
	}

	answerButtons = () => {
		let self = this;
		if(this.state.questionAvailable){
			return this.state.question.onCreateQuestion.answers.map((value, index) => {
				return self.button(index, value);
			})
		} else if(this.state.answerAvailable){
			return this.state.answer.onUpdateQuestion.answers.map((value, index) => {
				return self.button(index, value);
			})
		}
	}


	question = () => {
		if(this.state.questionAvailable){
			setTimeout((() => {
				this.setState({
					modalVisible: false,
					questionAvailable: false,
					buttonsDisabled: true,
					selectedAnswerButton: null
				});
			}).bind(this), 10000);
			return(
				<View style={styles.questionContainer}>
					<View style={styles.question}>
						<View style={styles.questionTitleContainer}>
							<Text style={styles.questionTitle}>{ this.state.question.onCreateQuestion.question }</Text>
						</View>
						<View style={styles.answerButtonContainer}>
							{ this.answerButtons() }
						</View>
					</View>
				</View>
			);
		}
	}

	answer = () => {
		let self = this;
		if(this.state.answerAvailable){
			setTimeout((()=> {
				let gameOver = this.state.questionCount == 1 ? true : false;
				let wrongQuestions = this.state.answerChosen.answer !== this.state.answer.onUpdateQuestion.answers[this.state.answer.onUpdateQuestion.answerId] ? [...this.state.wrongQuestions, {question: this.state.answer, answer: this.state.answerChosen.answer}] : [...this.state.wrongQuestions];
				if(gameOver){
					setTimeout(() => {
						self.setState({
							modalVisible: true,
							modalBackground: "transparent"
						}, () => {
							console.log("final state: ", self.state);
						})
					}, 2000);
				}
				this.setState({
					modalVisible: false,
					answerAvailable: false,
					buttonsDisabled: false,
					wrongQuestions: wrongQuestions,
					answerChosen: {},
					selectedAnswerButton: null,
					gameOver: gameOver,
					winner: gameOver == true && wrongQuestions.length == 0 ? true : false,
					loser: gameOver == true && wrongQuestions.length > 0 ? true : false
				});
			}).bind(this), 10000);
			return(
				<View style={styles.questionContainer}>
					<View style={styles.question}>
						<View style={styles.questionTitleContainer}>
							<Text style={styles.questionTitle}>{ this.state.answer.onUpdateQuestion.question }</Text>
						</View>
						<View style={styles.answerButtonContainer}>
							{ this.answerButtons()}
						</View>
					</View>
				</View>
			);
		}
	}


	winner = () => {
		return(
			<Image source={require('../../../../assets/winner.png')} style={{width: "100%", height: "100%"}} />
		);	
	}

	loser = () => {
		return(
			<Image source={require('../../../../assets/loser.png')} style={{width: "100%", height: "100%"}} />
		);
	}

	game = () => {
		if(this.state.questionAvailable && !this.state.answerAvailable)
			return(
				<View style={{width: "100%", height: "100%", zIndex: 2}}>
					{ Platform.OS === 'ios' ? <Timer /> : null }
					{this.question()}
				</View>
			);
		else if(this.state.answerAvailable && !this.state.questionAvailable)
			return(
				<View style={{width: "100%", height: "100%", zIndex: 2}}>
					{this.answer()}
				</View>
			);
		else if(this.state.gameOver)
			if(this.state.winner)
				return(
					<View style={{width: "100%", height: "100%", zIndex: 2}}>
						{this.winner()}
					</View>
				);
			else if(this.state.loser)
				return(
					<View style={{width: "100%", height: "100%", zIndex: 2}}>
						{this.loser()}
					</View>
				);
	}

	render(){
		return(
			<ViewContainer>
				<Video />
				<Modal visible={this.state.modalVisible} transparent={true} style={{backgroundColor: this.state.modalBackground}}>
					<View style={{overflow: 'visible', width:"100%", height: "100%", zIndex: 1}}>
						{this.game()}
					</View>
				</Modal>
			</ViewContainer>
		);
	}
}

export default Game;