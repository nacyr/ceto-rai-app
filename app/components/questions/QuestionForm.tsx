import { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { Toast } from '../common/Toast';

export function QuestionForm() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic here
    setShowToast(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Your Question</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700"
      >
        Submit Question
      </button>

      {showToast && (
        <Toast
          message="Question submitted successfully!"
          onClose={() => setShowToast(false)}
        />
      )}
    </form>
  )
}
