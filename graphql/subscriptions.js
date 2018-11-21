// this is an auto generated file. This will be overwritten
import gql from "graphql-tag";

export const OnCreateQuestion = gql`
  subscription OnCreateQuestion {
    onCreateQuestion {
      id
      question
      answers
      answerId
    }
  }
`;
export const OnUpdateQuestion = gql`
  subscription OnUpdateQuestion {
    onUpdateQuestion {
      id
      question
      answers
      answerId
    }
  }
`;
export const OnDeleteQuestion = gql`
  subscription OnDeleteQuestion {
    onDeleteQuestion {
      id
      question
      answers
      answerId
    }
  }
`;
export const OnCreateAnswer = gql`
  subscription OnCreateAnswer {
    onCreateAnswer {
      id
      username
      answer
    }
  }
`;
export const OnUpdateAnswer = gql`
  subscription OnUpdateAnswer {
    onUpdateAnswer {
      id
      username
      answer
    }
  }
`;
export const OnDeleteAnswer = gql`
  subscription OnDeleteAnswer {
    onDeleteAnswer {
      id
      username
      answer
    }
  }
`;
