import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ProfilePage() {
  const baseUrl = "https://stackwave-h1x0.onrender.com";
  const { id } = useParams();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const questionsRes = await axios.get(`${baseUrl}/questions/user/${id}`);
        setQuestions(questionsRes.data);
      } catch (err) {
        console.error("Error fetching while profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading)
    return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center px-4 py-8">
      {/* Nav */}
      <div className="flex justify-center gap-6 mb-8">
        <Button variant="ghost" className="text-white">
          Home
        </Button>
        <Button variant="ghost" className="text-white">
          Questions
        </Button>
        <Button variant="ghost" className="text-white">
          Profile
        </Button>
        <Button variant="outline" className="border-white text-white">
          Logout
        </Button>
      </div>

      {/* Profile Card */}
      <Card className="w-full max-w-4xl backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start md:gap-6">
          {/* Avatar */}
          <Avatar className="w-24 h-24 bg-cyan-400 text-black text-3xl font-bold">
            <AvatarFallback>
              {user.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div className="mt-4 md:mt-0 text-center md:text-left">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-400 text-sm">{user.email}</p>
            <p className="text-gray-400 text-sm mt-1">
              🕒 Dropped {timeAgo(user.dropped)}
            </p>
            <p className="text-gray-500 text-sm">
              🟢 Last activity {timeAgo(user.lastActivity)}
            </p>
          </div>

          {/* Edit Button */}
          <div className="ml-auto mt-4 md:mt-0">
            <Button variant="ghost" className="border border-white/10">
              Edit
            </Button>
          </div>
        </div>

        {/* Sidebar Tabs */}
        <div className="mt-6 flex gap-4 flex-wrap justify-center md:justify-start">
          {["Summary", "Questions", "Answers", "Votes"].map((tab) => (
            <Button
              key={tab}
              variant="secondary"
              className="bg-white/10 hover:bg-white/20 text-white"
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Question List */}
        <div className="mt-8">
          <p className="text-lg mb-4">
            {questions.length} question{questions.length !== 1 ? "s" : ""}
          </p>

          {questions.map((q) => (
            <div
              key={q._id}
              className="bg-white/10 p-4 rounded-lg shadow-sm mb-4"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-400">
                  {q.votes.length} votes • {q.answers.length} answers
                </p>
                <p className="text-xs text-gray-500">
                  🕒 {timeAgo(q.createdAt)}
                </p>
              </div>
              <h3 className="text-orange-400 font-semibold">{q.title}</h3>
              <div className="flex gap-2 mt-2">
                {q.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-700 text-xs px-2 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-2">👤 {user.name}</p>
            </div>
          ))}

          {/* Pagination (if needed) */}
          <div className="flex justify-center mt-4 gap-4 text-sm text-gray-400">
            <span className="cursor-pointer hover:text-white">Previous</span>
            <span>1 of 1</span>
            <span className="cursor-pointer hover:text-white">Next</span>
          </div>
        </div>
      </Card>

      {/* Footer */}
      <footer className="mt-8 text-sm text-gray-500 text-center">
        <div className="flex flex-wrap justify-center gap-4 mb-2">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Questions</a>
        </div>
        <p>© 2024 Riverpod</p>
      </footer>
    </div>
  );
}

// Utility to convert timestamp to time ago
function timeAgo(dateStr) {
  const now = new Date();
  const past = new Date(dateStr);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000); // in seconds

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
