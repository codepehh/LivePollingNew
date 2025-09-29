
import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import AdminView from './components/AdminView';
import ParticipantView from './components/ParticipantView';
import { Presentation, Users } from 'lucide-react';

const HomePage: React.FC = () => (
  <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 animate-fade-in">
    <header className="text-center mb-12">
      <h1 className="text-5xl font-bold text-slate-800">Local Live Poll</h1>
      <p className="text-slate-600 mt-2 text-lg">Create and participate in live polls on your local network.</p>
    </header>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
      <Link to="/admin" className="group">
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center flex flex-col items-center animate-slide-in" style={{ animationDelay: '200ms' }}>
          <Presentation className="w-16 h-16 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
          <h2 className="text-3xl font-semibold text-slate-800 mt-4">Start as Administrator</h2>
          <p className="text-slate-500 mt-2">Create questions, manage the session, and view results in real-time.</p>
        </div>
      </Link>
      <Link to="/participant" className="group">
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center flex flex-col items-center animate-slide-in" style={{ animationDelay: '400ms' }}>
          <Users className="w-16 h-16 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
          <h2 className="text-3xl font-semibold text-slate-800 mt-4">Join as Participant</h2>
          <p className="text-slate-500 mt-2">Scan a QR code to join a session and cast your vote.</p>
        </div>
      </Link>
    </div>
  </div>
);


const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminView />} />
        <Route path="/participant" element={<ParticipantView />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
