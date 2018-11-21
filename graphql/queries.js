// this is an auto generated file. This will be overwritten
import gql from "graphql-tag";

export const GetQuestion = gql`
  query GetQuestion($id: ID!) {
    getQuestion(id: $id) {
      id
      question
      answers
      answerId
    }
  }
`;
export const ListQuestions = gql`
  query ListQuestions(
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuestions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        question
        answers
        answerId
      }
      nextToken
    }
  }
`;
export const GetAnswer = gql`
  query GetAnswer($id: ID!) {
    getAnswer(id: $id) {
      id
      username
      answer
    }
  }
`;
export const ListAnswers = gql`
  query ListAnswers(
    $filter: ModelAnswerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAnswers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        answer
      }
      nextToken
    }
  }
`;
