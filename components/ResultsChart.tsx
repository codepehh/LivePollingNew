
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { Question, Votes } from '../types';

interface ResultsChartProps {
  question: Question;
  votes: Votes[string];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-md">
          <p className="font-bold">{`${label}`}</p>
          <p className="text-indigo-600">{`Votes: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

const ResultsChart: React.FC<ResultsChartProps> = ({ question, votes }) => {
  const data = question.options.map(option => ({
    name: option.text,
    votes: votes[option.id] || 0,
  }));

  const totalVotes = data.reduce((sum, entry) => sum + entry.votes, 0);

  if (totalVotes === 0) {
    return (
      <div className="text-center text-slate-500 py-10 bg-slate-50 rounded-lg">
        <p className="text-lg">Waiting for the first vote...</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
            <BarChart
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 0,
                bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#475569' }} />
            <YAxis allowDecimals={false} tick={{ fill: '#475569' }} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(238, 242, 255, 0.6)'}} />
            <Bar dataKey="votes" name="Votes" barSize={60}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Bar>
            </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultsChart;
