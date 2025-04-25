import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../ui/Navbar";

export default function QuestionDetailsPage() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState("");
  const [submitError, setSubmitError] = useState("");

  const baseUrl = "https://stackwave-h1x0.onrender.com";

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`${baseUrl}/questions/question/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setQuestion(res.data.question);
      } catch (err) {
        console.error("Error fetching question:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  const handleAnswerSubmit = async () => {
    if (!newAnswer.trim()) return;

    try {
      const res = await axios.post(
        `${baseUrl}/questions/createanswer/${id}`,
        { content: newAnswer },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setQuestion((prev) => ({
        ...prev,
        answers: [res.data, ...prev.answers],
      }));
      setNewAnswer("");
      setSubmitError("");
    } catch (err) {
      console.error("Error submitting answer:", err);
      setSubmitError("Failed to submit answer. Please try again.");
    }
  };

  if (loading) return <div className="p-10 text-white">Loading...</div>;
  if (!question)
    return <div className="p-10 text-red-400">Question not found.</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto mt-6 px-4">
        {/* Question Section */}
        <div className="bg-gray-900 p-6 rounded-lg mb-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-xl">
              {typeof question.askedBy?.media === "string" ? (
                question.askedBy.media
              ) : (
                <img
                  src={question.askedBy?.media?.url || ""}
                  alt="User Media"
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{question.title}</h1>
              <p className="text-gray-400 mt-2">{question.body}</p>
              <p className="text-sm text-gray-500 mt-1">
                Posted by {question.askedBy?.username || "Unknown"} on{" "}
                {new Date(question.createdAt).toLocaleDateString()}
              </p>

              <div className="flex space-x-2 mt-4">
                <button className="px-3 py-1 bg-green-600 rounded">
                  ⬆️ Upvote
                </button>
                <button className="px-3 py-1 bg-red-600 rounded">
                  ⬇️ Downvote
                </button>
                <span className="ml-4 text-gray-300">
                  {question.votes || 0} votes
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Answers</h2>
          {question.answers.length === 0 ? (
            <p className="text-gray-400">
              No answers yet. Be the first to answer!
            </p>
          ) : (
            question.answers.map((ans) => (
              <div key={ans._id} className="bg-gray-900 p-4 rounded-lg mb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold">
                    {ans.answeredBy &&
                    typeof ans.answeredBy.media === "string" ? (
                      ans.answeredBy.media
                    ) : ans.answeredBy?.media?.url ? (
                      <img
                        src={ans.answeredBy.media.url}
                        alt="User Media"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      "U"
                    )}
                  </div>
                  <div>
                    <p className="text-gray-300">{ans.content}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      By {ans.answeredBy?.username || "Unknown"} •{" "}
                      {new Date(ans.createdAt).toLocaleString()}
                    </p>
                    <div className="mt-2 space-x-2">
                      <button className="bg-green-600 px-2 py-1 rounded">
                        ⬆️
                      </button>
                      <button className="bg-red-600 px-2 py-1 rounded">
                        ⬇️
                      </button>
                      <span className="text-gray-400">
                        {ans.votes || 0} votes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Answer Form */}
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Your Answer</h2>
          <textarea
            className="w-full p-3 rounded bg-gray-800 text-white mb-4"
            rows="5"
            placeholder="Type your answer here..."
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
          ></textarea>
          {submitError && <p className="text-red-500 mb-2">{submitError}</p>}
          <button
            onClick={handleAnswerSubmit}
            className="bg-blue-600 px-6 py-2 rounded"
          >
            Post Answer
          </button>
        </div>
      </div>
    </div>
  );
}
