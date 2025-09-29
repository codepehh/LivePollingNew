import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useLiveState from '../hooks/useLiveState';
import { getInitialState, generateInitialVotes } from '../constants';
import type { AppState, Question } from '../types';
import ResultsChart from './ResultsChart';
import QRCode from './QRCode';
import Button from './common/Button';
import Card from './common/Card';
import QuestionForm from './QuestionForm';
import { ChevronLeft, ChevronRight, Home, RefreshCw, Edit, Trash2, Plus, Presentation as PresentationIcon } from 'lucide-react';

const AdminView: React.FC = () => {
  const [appState, setAppState] = useLiveState<AppState>('live-poll-app', getInitialState());
  const [localIp, setLocalIp] = useState('');
  
  // UI state, not shared
  const [mode, setMode] = useState<'setup' | 'presentation'>('presentation'); 
  const [editingQuestion, setEditingQuestion] = useState<Question | undefined>(undefined);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const currentQuestion = appState.questions[appState.currentQuestionIndex];
  const totalQuestions = appState.questions.length;

  const goToNextQuestion = () => {
    setAppState(prev => ({
      ...prev,
      currentQuestionIndex: Math.min(prev.currentQuestionIndex + 1, totalQuestions - 1),
    }));
  };

  const goToPrevQuestion = () => {
    setAppState(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(prev.currentQuestionIndex - 1, 0),
    }));
  };

  const resetSession = () => {
    if (window.confirm('Are you sure you want to reset the session? This will restore default questions and clear all votes.')) {
        setAppState(getInitialState());
    }
  };

  const handleSaveQuestion = (question: Question) => {
    setAppState(prev => {
        const newQuestions = [...prev.questions];
        const existingIndex = newQuestions.findIndex(q => q.id === question.id);

        if (existingIndex > -1) {
            newQuestions[existingIndex] = question;
        } else {
            newQuestions.push(question);
        }
        
        const newVotes = generateInitialVotes(newQuestions);
        Object.keys(prev.votes).forEach(qId => {
            if (newVotes[qId]) {
                Object.keys(prev.votes[qId]).forEach(oId => {
                    if (newVotes[qId][oId] !== undefined) {
                        newVotes[qId][oId] = prev.votes[qId][oId];
                    }
                })
            }
        });


        return {
            ...prev,
            questions: newQuestions,
            votes: newVotes,
        };
    });
    setEditingQuestion(undefined);
    setIsAddingNew(false);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    
    setAppState(prev => {
        const newQuestions = prev.questions.filter(q => q.id !== questionId);
        const newVotes = { ...prev.votes };
        delete newVotes[questionId];
        
        let newIndex = prev.currentQuestionIndex;
        if(newIndex >= newQuestions.length){
            newIndex = Math.max(0, newQuestions.length - 1);
        }

        return {
            questions: newQuestions,
            votes: newVotes,
            currentQuestionIndex: newIndex
        }
    });
  }
  
  const cancelEdit = () => {
    setEditingQuestion(undefined);
    setIsAddingNew(false);
  }

  // Generate participant URL dynamically
  const hostname = localIp.trim() || window.location.hostname;
  const port = window.location.port ? `:${window.location.port}` : '';
  const pathname = window.location.pathname.endsWith('/') ? window.location.pathname : `${window.location.pathname}/`;
  const participantUrl = `${window.location.protocol}//${hostname}${port}${pathname}#/participant`;


  // Render Setup View
  if (mode === 'setup' || isAddingNew || editingQuestion) {
    return (
        <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-800">Manage Questions</h1>
                    <Button onClick={() => setMode('presentation')} disabled={isAddingNew || !!editingQuestion}>
                        <PresentationIcon className="w-5 h-5 mr-2" /> Go to Presentation
                    </Button>
                </header>

                {isAddingNew || editingQuestion ? (
                    <QuestionForm 
                        question={editingQuestion}
                        onSave={handleSaveQuestion}
                        onCancel={cancelEdit}
                    />
                ) : (
                    <Card>
                        <div className="space-y-4">
                            {appState.questions.map(q => (
                                <div key={q.id} className="flex justify-between items-center p-4 border rounded-lg bg-white hover:bg-slate-50">
                                    <p className="font-medium text-slate-700">{q.text}</p>
                                    <div className="flex gap-2">
                                        <Button variant='secondary' className="p-2" onClick={() => setEditingQuestion(q)} aria-label="Edit question"><Edit className="w-5 h-5"/></Button>
                                        <Button variant='danger' className="p-2" onClick={() => handleDeleteQuestion(q.id)} aria-label="Delete question"><Trash2 className="w-5 h-5"/></Button>
                                    </div>
                                </div>
                            ))}
                             {appState.questions.length === 0 && (
                                <p className="text-center text-slate-500 py-4">No questions yet. Add one to get started!</p>
                             )}
                        </div>
                        <Button onClick={() => setIsAddingNew(true)} className="mt-6 w-full">
                           <Plus className="w-5 h-5 mr-2" /> Add New Question
                        </Button>
                    </Card>
                )}
            </div>
        </div>
    );
  }

  // Render Presentation View
  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold text-slate-800">Administrator Dashboard</h1>
            <div className="flex items-center gap-2">
              <Link to="/">
                <Button variant="secondary"><Home className="w-5 h-5"/></Button>
              </Link>
               <Button variant="secondary" onClick={() => setMode('setup')}><Edit className="w-5 h-5 mr-2" /> Manage Questions</Button>
              <Button variant="danger" onClick={resetSession}><RefreshCw className="w-5 h-5 mr-2" /> Reset Session</Button>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {totalQuestions > 0 ? (
                <>
                <Card className="animate-fade-in">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-indigo-600">Question {appState.currentQuestionIndex + 1} of {totalQuestions}</p>
                        <h2 className="text-3xl font-bold text-slate-900 mt-1">{currentQuestion.text}</h2>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={goToPrevQuestion} disabled={appState.currentQuestionIndex === 0}>
                            <ChevronLeft className="w-5 h-5"/>
                        </Button>
                        <Button onClick={goToNextQuestion} disabled={appState.currentQuestionIndex >= totalQuestions - 1}>
                            <ChevronRight className="w-5 h-5"/>
                        </Button>
                    </div>
                </div>
                </Card>

                <Card className="animate-slide-in" style={{ animationDelay: '200ms' }}>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">Live Results</h3>
                    <ResultsChart question={currentQuestion} votes={appState.votes[currentQuestion.id] || {}} />
                </Card>
                </>
            ) : (
                <Card>
                    <h2 className="text-2xl font-bold text-center text-slate-700">No questions available.</h2>
                    <p className="text-center text-slate-500 mt-2">Go to "Manage Questions" to add your first question.</p>
                </Card>
            )}
          </div>

          <div className="space-y-8">
             <Card className="animate-slide-in" style={{ animationDelay: '400ms' }}>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Join the Session</h3>
                
                <div className="mb-6">
                    <label htmlFor="local-ip" className="block text-sm font-medium text-slate-700 mb-1">
                        Your Local Network IP
                    </label>
                    <input
                        id="local-ip"
                        type="text"
                        value={localIp}
                        onChange={(e) => setLocalIp(e.target.value)}
                        placeholder="e.g., 192.168.1.10"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="text-xs text-slate-500 mt-2">
                        Enter your IP so others on your Wi-Fi can connect. Find it with <code className="bg-slate-200 p-1 rounded">ipconfig</code> (Windows) or <code className="bg-slate-200 p-1 rounded">ifconfig</code> (macOS/Linux).
                    </p>
                </div>

                <p className="text-slate-600 mb-4">Participants can scan this QR code to join:</p>
                <div className="flex justify-center">
                    <QRCode value={participantUrl} />
                </div>
                <div className="mt-4 text-center">
                    <a href={participantUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline break-all">{participantUrl}</a>
                </div>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;