import { useState } from "react";
import Navbar from "../ui/Navbar";

const questions = [
  {
    _id: "1",
    title: "How to use a MongoDB with Node.js?",
    description:
      "I'm new to MongoDB and need guidance on how to connect it with a Node.js server.",
    votes: 5,
    answers: 3,
    createdAt: "2025-04-04T10:00:00Z",
    user: {
      name: "John Doe",
      media: "JD",
    },
  },
  {
    _id: "2",
    title: "Best practices for authentication in MERN stack?",
    description:
      "Should I use JWT or session-based authentication? What are the pros and cons?",
    votes: 10,
    answers: 5,
    createdAt: "2025-04-03T14:30:00Z",
    user: {
      name: "Jane Smith",
      media: "JS",
    },
  },
];

export default function QuestionsPage() {
  const [sortBy, setSortBy] = useState("Newest");

  // Sorting logic
  const sortedQuestions = [...questions].sort((a, b) => {
    if (sortBy === "Newest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "Most Voted") return b.votes - a.votes;
    if (sortBy === "Most Answered") return b.answers - a.answers;
  });

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">
      {/* Navbar */}
      <Navbar />

      {/* Page Header */}
      <div className="w-full max-w-5xl mt-6">
        <h1 className="text-2xl font-bold text-white">All Questions</h1>

        {/* Sorting Options */}
        <div className="mt-4 flex space-x-4">
          {["Newest", "Most Voted", "Most Answered"].map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`px-4 py-2 rounded-lg ${
                sortBy === option ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="w-full max-w-5xl mt-4">
        {sortedQuestions.map((question) => (
          <div
            key={question._id}
            className="bg-gray-900 p-4 rounded-lg shadow-md flex items-start mb-4"
          >
            {/* User Avatar */}
            <div className="w-12 h-12 flex items-center justify-center text-xl font-bold bg-orange-500 rounded-lg">
              {question.user.media}
            </div>

            {/* Question Content */}
            <div className="ml-4 flex-1">
              <h2 className="text-lg font-semibold hover:underline cursor-pointer">
                {question.title}
              </h2>
              <p className="text-gray-400 text-sm">{question.description}</p>

              {/* Question Stats */}
              <div className="flex items-center mt-2 space-x-4 text-sm text-gray-400">
                <span>⬆️ {question.votes} Votes</span>
                <span>💬 {question.answers} Answers</span>
                <span>
                  📅 {new Date(question.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
