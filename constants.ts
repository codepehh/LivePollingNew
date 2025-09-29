import type { Question, Votes, AppState } from './types';

export const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'What is your favorite programming language?',
    options: [
      { id: 'q1o1', text: 'JavaScript' },
      { id: 'q1o2', text: 'Python' },
      { id: 'q1o3', text: 'Rust' },
      { id: 'q1o4', text: 'Go' },
    ],
  },
  {
    id: 'q2',
    text: 'Which frontend framework do you prefer?',
    options: [
      { id: 'q2o1', text: 'React' },
      { id: 'q2o2', text: 'Vue' },
      { id: 'q2o3', text: 'Svelte' },
      { id: 'q2o4', text: 'Angular' },
    ],
  },
  {
    id: 'q3',
    text: 'What is the most important factor in a new job?',
    options: [
      { id: 'q3o1', text: 'Salary' },
      { id: 'q3o2', text: 'Work-Life Balance' },
      { id: 'q3o3', text: 'Company Culture' },
      { id: 'q3o4', text: 'Career Growth' },
    ],
  },
];

export const generateInitialVotes = (questions: Question[]): Votes => {
  const votes: Votes = {};
  questions.forEach((question) => {
    votes[question.id] = {};
    question.options.forEach((option) => {
      votes[question.id][option.id] = 0;
    });
  });
  return votes;
};


export const getInitialState = (): AppState => {
    return {
        questions: DEFAULT_QUESTIONS,
        currentQuestionIndex: 0,
        votes: generateInitialVotes(DEFAULT_QUESTIONS),
    }
}
