import React, { useState, useEffect } from 'react';
import type { Question } from '../types';
import Button from './common/Button';
import { Plus, Trash2 } from 'lucide-react';

interface QuestionFormProps {
  question?: Question;
  onSave: (question: Question) => void;
  onCancel: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ question, onSave, onCancel }) => {
  const [text, setText] = useState('');
  const [options, setOptions] = useState<{ id: string; text: string }[]>([
    { id: `new_${Date.now()}`, text: '' },
    { id: `new_${Date.now() + 1}`, text: '' },
  ]);

  useEffect(() => {
    if (question) {
      setText(question.text);
      setOptions(question.options.length > 0 ? question.options : [{ id: `new_${Date.now()}`, text: '' }]);
    }
  }, [question]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 10) { // Limit options
      setOptions([...options, { id: `new_${Date.now()}`, text: '' }]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) { // Minimum 2 options
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      alert('Question text cannot be empty.');
      return;
    }
    const validOptions = options.filter(opt => opt.text.trim() !== '');
    if (validOptions.length < 2) {
      alert('Please provide at least two non-empty options.');
      return;
    }

    const questionToSave: Question = {
      id: question?.id || `q_${Date.now()}`,
      text: text.trim(),
      options: validOptions.map((opt, index) => ({ id: opt.id.startsWith('new_') ? `o_${Date.now() + index}` : opt.id, text: opt.text.trim() })),
    };
    onSave(questionToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-slate-200 shadow-md animate-fade-in">
      <div>
        <label htmlFor="question-text" className="block text-sm font-medium text-slate-700 mb-1">
          Question Text
        </label>
        <input
          id="question-text"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g., What is your favorite color?"
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Answer Options
        </label>
        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Button
                type="button"
                variant="danger"
                onClick={() => removeOption(index)}
                disabled={options.length <= 2}
                className="p-2"
                aria-label="Remove option"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={addOption}
          disabled={options.length >= 10}
          className="mt-4"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Option
        </Button>
      </div>
      <div className="flex justify-end gap-4 border-t pt-4 mt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save Question
        </Button>
      </div>
    </form>
  );
};

export default QuestionForm;
