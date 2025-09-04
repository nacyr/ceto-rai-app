import { useState } from 'react';
import { Question } from '@/types/questions';
import { formatDate } from '@/utils/formatters';

export function QuestionList() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuestions = questions.filter(q => 
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search questions..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded-md"
      />

      <div className="space-y-4">
        {filteredQuestions.map(question => (
          <div key={question.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg">{question.title}</h3>
            <p className="text-gray-600 mt-2">{question.content}</p>
            {question.answer && (
              <div className="mt-4 pl-4 border-l-4 border-teal-500">
                <p className="text-gray-800">{question.answer.content}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Answered on {formatDate(question.answer.answeredAt)}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
