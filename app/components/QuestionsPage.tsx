import { QuestionForm } from './questions/QuestionForm';
import { QuestionList } from './questions/QuestionList';

export function QuestionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Questions & Answers</h1>
      
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ask a Question</h2>
        <QuestionForm />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Questions</h2>
        <QuestionList />
      </div>
    </div>
  )
}
