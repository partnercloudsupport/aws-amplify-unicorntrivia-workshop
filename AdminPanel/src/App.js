import React, { Component } from 'react';
import {
	createQuestion,
	updateQuestion
} from './graphql/mutations.js';
import {
	onCreateQuestion
} from './graphql/subscriptions.js';
import aws_exports from './aws-exports';
import logo from './logo.svg';
import './App.css';
import myJson from './questions.json';
import JsonTable from 'ts-react-json-table';
import Popup from 'react-popup';
import Amplify, { API, graphqlOperation } from "aws-amplify";

Amplify.configure(aws_exports);

var columns = [{
	key: 'Question',
	label: 'Questions:'
},{
	key: 'button1',
	label: ' ',
	cell: (row, columnKey) => {
		return <button>Post Question</button>;
	}
},{
	key: 'button2',
	label: ' ',
	cell: (row, columnKey) => {
		return <button>Post Answer</button>;
	}
}];

class Content extends React.Component {
	tableSettings = {
		header: false
	}

	onClickCell = (event, columnName, rowData) => {
		if(columnName === 'button1'){
			//LOCATION1
			const question = {
				input: {
					question: rowData["Question"],
					answers: rowData["Answers"]
				}
			};
			API.graphql(
				graphqlOperation(createQuestion, question)
			).then((response) => {
				rowData["id"] = response.data.createQuestion.id;
				console.log(response.data.createQuestion);
			});
	    } else if(columnName === 'button2'){
			if(rowData["id"] != null){
				//LOCATION2
				const question = {
					input: {
						id: rowData["id"],
						answerId: rowData["Answer"]
					}
				};
				API.graphql(
					graphqlOperation(updateQuestion, question)
				).then((response) => {
					console.log(response.data.updateQuestion)
				});
			} else {
				console.log("Nothing");
				Popup.alert('Error: You have not submitted this question yet');
			}
		}
	}
	
	render() {
		return (
			<JsonTable rows={ myJson.Questions } columns={columns} settings={this.tableSettings} onClickCell={this.onClickCell} className="tabelsa"/>
		);
	}
}

class App extends Component {
	render() {
		return (
			<div className="App">
				<Popup />
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to Unicorn Trivia</h1>
				</header>
				<br/>
				<Content/>
			</div>
		);
	}
}


export default App;
