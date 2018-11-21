// this is an auto generated file. This will be overwritten
import gql from "graphql-tag";

export const CreateQuestion = gql`
  mutation CreateQuestion($input: CreateQuestionInput!) {
    createQuestion(input: $input) {
      id
      question
      answers
      answerId
    }
  }
`;
export const UpdateQuestion = gql`
  mutation UpdateQuestion($input: UpdateQuestionInput!) {
    updateQuestion(input: $input) {
      id
      question
      answers
      answerId
    }
  }
`;
export const DeleteQuestion = gql`
  mutation DeleteQuestion($input: DeleteQuestionInput!) {
    deleteQuestion(input: $input) {
      id
      question
      answers
      answerId
    }
  }
`;
export const CreateAnswer = gql`
  mutation CreateAnswer($input: CreateAnswerInput!) {
    createAnswer(input: $input) {
      id
      username
      answer
    }
  }
`;
export const UpdateAnswer = gql`
  mutation UpdateAnswer($input: UpdateAnswerInput!) {
    updateAnswer(input: $input) {
      id
      username
      answer
    }
  }
`;
export const DeleteAnswer = gql`
  mutation DeleteAnswer($input: DeleteAnswerInput!) {
    deleteAnswer(input: $input) {
      id
      username
      answer
    }
  }
`;
