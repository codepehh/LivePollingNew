export interface Question {
  id: string;
  text: string;
  options: { id: string; text: string }[];
}

export interface Votes {
  [questionId: string]: {
    [optionId: string]: number;
  };
}

export interface AppState {
  questions: Question[];
  currentQuestionIndex: number;
  votes: Votes;
}
