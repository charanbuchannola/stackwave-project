// components/QuestionCard.jsx
export default function QuestionCard({ question }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
      <h3 className="text-lg font-bold text-blue-600 hover:underline cursor-pointer">
        {question.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
        {question.description}
      </p>
      <div className="flex space-x-2 mt-2">
        {question.tags.map((tag, i) => (
          <span
            key={i}
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-1 rounded text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex justify-between mt-4 text-sm text-gray-500 dark:text-gray-400">
        <span>
          ⬆ {question.votes} votes • {question.answers} answers •{" "}
          {question.views} views
        </span>
        <span>
          Asked by {question.user} • {question.time}
        </span>
      </div>
    </div>
  );
}
