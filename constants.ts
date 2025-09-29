import type { Question, Votes, AppState } from './types';

export const QUESTIONS_STORAGE_KEY = 'live-poll-questions';

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


// New function to get questions from localStorage
const getStoredQuestions = (): Question[] => {
    try {
      const item = window.localStorage.getItem(QUESTIONS_STORAGE_KEY);
      if (item) {
        const questions = JSON.parse(item);
        // Basic validation that we have an array
        if (Array.isArray(questions)) {
            return questions;
        }
      }
    } catch (error) {
      console.error('Error reading questions from localStorage', error);
    }
    // Fallback to default questions if nothing is stored or data is invalid
    return DEFAULT_QUESTIONS;
};

// New function to save questions to localStorage
export const storeQuestions = (questions: Question[]): void => {
    try {
        window.localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
    } catch (error) {
        console.error('Error writing questions to localStorage', error);
    }
};


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
    const questions = getStoredQuestions();
    // On first-ever run for a user, this will store the default questions.
    // On subsequent runs, it just re-stores the loaded questions, which is harmless.
    storeQuestions(questions);
    return {
        questions: questions,
        currentQuestionIndex: 0,
        votes: generateInitialVotes(questions),
    }
}