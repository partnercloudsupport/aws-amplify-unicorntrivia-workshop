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
		/* Code goes here */
	}

	listenForAnswers = () => {
		/* Code goes here */
	}
	
	answerChosen = (index) => {
		/* Code goes here */
	}

	answerButtons = () => {
		let self = this;
		if(this.state.questionAvailable){
			return this.state.question.onCreateQuestion.answers.map((value, index) => {
				return(
					<TouchableOpacity
						key={index}
						disabled={self.state.buttonsDisabled}
						onPress={(e) => self.answerChosen(index)}
						style={{
							...styles.answerButton,
							backgroundColor: self.state.selectedAnswerButton == index ? "#666666" : "#FFFFFF",
							borderColor: self.state.selectedAnswerButton == index ? "#666666" : "#CCCCCC"
						}}
					>
						<Text
							key={index}
							style={{
								...styles.answerButtonText,
								color: self.state.selectedAnswerButton == index ? "#FFFFFF" : "#000"
							}}
						>{ value }</Text>
					</TouchableOpacity>
				);
			})
		} else if(this.state.answerAvailable){
			return this.state.answer.onUpdateQuestion.answers.map((value, index) => {
				if(value == self.state.answer.onUpdateQuestion.answers[self.state.answer.onUpdateQuestion.answerId]){
					return(
						<TouchableOpacity
							key={index}
							disabled={self.state.buttonsDisabled}
							style={{
								...styles.answerButton,
								backgroundColor: "#02DC2A",
								borderColor: "#02DC2A"
							}}
						>
							<Text
								key={index}
								style={{
									...styles.answerButtonText,
									color: "white"
								}}
							>{ value }</Text>
						</TouchableOpacity>
					);
				}
				return(
					<TouchableOpacity
						key={index}
						disabled={self.state.buttonsDisabled}
						style={{
							...styles.answerButton,
							backgroundColor: self.state.answerChosen.index == index ? "#FE0000" : "#FFFFFF",
							borderColor: self.state.answerChosen.index == index ? "#FE0000" : "#CCCCCC"
						}}
					>
						<Text
							key={index}
							style={{
								...styles.answerButtonText,
								color: self.state.answerChosen.index == index ? "#FFFFFF" : "#000"
							}}
						>{ value }</Text>
					</TouchableOpacity>
				);
			})
		}
	}

	question = () => {
		/* Code goes here */
	}

	answer = () => {
		/* Code goes here */	
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