import {
  FaHome,
  FaQuestionCircle,
  FaTags,
  FaUsers,
  FaComments,
} from "react-icons/fa";
import SidebarItem from "../pages/SidebarItem";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/ContextAuth";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);

  const baseUrl = "https://stackwave-h1x0.onrender.com";

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`${baseUrl}/questions/getquestions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // or from context/cookie if you don't use localStorage
          },
        });
        setQuestions(res.data.questions);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Sidebar */}
      <aside className="w-72 p-6 backdrop-blur-md bg-white/5 border-r border-white/10 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400 mb-10">StackClone</h1>
          <nav className="space-y-4">
            <Link to="/">
              <SidebarItem icon={<FaHome />} text="Home" />
            </Link>
            <Link to="/questions">
              <SidebarItem icon={<FaQuestionCircle />} text="Questions" />
            </Link>
            <Link to="/tags">
              <SidebarItem icon={<FaTags />} text="Tags" />
            </Link>
            <Link to="/allusers">
              <SidebarItem icon={<FaUsers />} text="Users" />
            </Link>
            <Link to="/rooms">
              <SidebarItem icon={<FaComments />} text="Discussions" />
            </Link>
          </nav>
        </div>
        <div className="text-sm text-gray-400 mt-8">&copy; 2025 StackClone</div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {/* Welcome message for logged-in user */}
        {user && (
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-cyan-400 mb-3 flex items-center gap-3">
              <span role="img" aria-label="wave">
                👋
              </span>
              Welcome back, <span className="text-white">{user.name}</span>
            </h2>
            <p className="text-lg text-gray-400">
              Find answers to your technical questions and help others answer
              theirs.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Newest Questions</h2>
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-xl shadow transition duration-300">
            <Link to="/create" className="text-white">
              Ask Question
            </Link>
          </button>
        </div>

        <div className="space-y-6">
          {questions.map((q, index) => (
            <div
              key={q._id || index}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold text-cyan-300 hover:underline cursor-pointer">
                <Link to={`/question/${q._id}`}>{q.title}</Link>
              </h3>
              <p className="text-sm text-gray-300 mt-2">
                {q.body?.slice(0, 150)}...
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                {q.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-cyan-700/30 text-cyan-200 px-2 py-0.5 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center text-xs text-gray-400 mt-4">
                <div className="flex gap-4">
                  <span>{q.votes?.length || 0} votes</span>
                  <span>{q.answers?.length || 0} answers</span>
                  <span>0 views</span>
                </div>
                <div>
                  <span>
                    {q.askedBy?.username || "Anonymous"} •{" "}
                    {new Date(q.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-72 p-6 backdrop-blur-md bg-white/5 border-l border-white/10 space-y-4">
        <h3 className="text-xl font-semibold text-cyan-400">
          StackOverflow Teams
        </h3>
        <p className="text-sm text-gray-300">
          Ask questions, find answers, and collaborate at work.
        </p>
        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-xl shadow transition">
          Try Teams for Free
        </button>
      </aside>
    </div>
  );
}
