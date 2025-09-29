import React, { useState, useEffect } from 'react';
import useLiveState from '../hooks/useLiveState';
import { getInitialState } from '../constants';
import type { AppState } from '../types';
import Button from './common/Button';
import Card from './common/Card';
import { CheckCircle, Vote, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ParticipantView: React.FC = () => {
  const [appState, setAppState] = useLiveState<AppState>('live-poll-app', getInitialState());
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [votedQuestions, setVotedQuestions] = useState<Set<string>>(() => {
    try {
      const saved = sessionStorage.getItem('votedQuestions');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  
  const currentQuestion = appState.questions[appState.currentQuestionIndex];
  const hasVotedOnCurrent = currentQuestion && votedQuestions.has(currentQuestion.id);

  useEffect(() => {
    // Reset selection when question changes
    setSelectedOptionId(null);
  }, [appState.currentQuestionIndex]);
  
  useEffect(() => {
    // Save voted questions to session storage
    sessionStorage.setItem('votedQuestions', JSON.stringify(Array.from(votedQuestions)));
  }, [votedQuestions]);

  const handleVote = () => {
    if (!selectedOptionId || !currentQuestion) {
      alert('Please select an option to vote.');
      return;
    }

    setAppState(prev => {
      const newVotes = JSON.parse(JSON.stringify(prev.votes)); // Deep copy
      if(!newVotes[currentQuestion.id]) {
        newVotes[currentQuestion.id] = {};
      }
      if(!newVotes[currentQuestion.id][selectedOptionId]){
          newVotes[currentQuestion.id][selectedOptionId] = 0;
      }
      newVotes[currentQuestion.id][selectedOptionId]++;
      return { ...prev, votes: newVotes };
    });

    setVotedQuestions(prev => new Set(prev).add(currentQuestion.id));
  };
  
  // Handle case where there are no questions
  if (!currentQuestion) {
    return (
        <div className="min-h-screen bg-indigo-600 flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-2xl text-center">
                <div className="py-12">
                    <AlertTriangle className="w-24 h-24 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-slate-800">Waiting for questions...</h2>
                    <p className="text-slate-600 mt-2">The administrator has not added any questions yet.</p>
                </div>
            </Card>
            <div className="mt-4">
                <Link to="/" className="text-indigo-200 hover:text-white transition-colors">
                    Back to Home
                </Link>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-600 flex flex-col items-center justify-center p-4 animate-fade-in">
        <Card className="w-full max-w-2xl text-center">
            {hasVotedOnCurrent ? (
                <div className="py-12 animate-fade-in">
                    <CheckCircle className="w-24 h-24 text-emerald-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-slate-800">Thank you for your vote!</h2>
                    <p className="text-slate-600 mt-2">Please wait for the administrator to move to the next question.</p>
                </div>
            ) : (
                <>
                    <p className="text-sm font-medium text-indigo-600">Question {appState.currentQuestionIndex + 1} of {appState.questions.length}</p>
                    <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-8">{currentQuestion.text}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        {currentQuestion.options.map(option => (
                        <button
                            key={option.id}
                            onClick={() => setSelectedOptionId(option.id)}
                            className={`p-4 rounded-lg text-lg font-semibold border-4 transition-all duration-200 ${
                            selectedOptionId === option.id
                                ? 'bg-indigo-500 text-white border-indigo-700 shadow-lg scale-105'
                                : 'bg-slate-100 text-slate-800 border-transparent hover:bg-indigo-100 hover:border-indigo-200'
                            }`}
                        >
                            {option.text}
                        </button>
                        ))}
                    </div>
                    <Button onClick={handleVote} disabled={!selectedOptionId}>
                       <Vote className="w-5 h-5 mr-2" /> Submit Vote
                    </Button>
                </>
            )}
        </Card>
        <div className="mt-4">
            <Link to="/" className="text-indigo-200 hover:text-white transition-colors">
                Back to Home
            </Link>
        </div>
    </div>
  );
};

export default ParticipantView;
