import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Summary");
  const token = localStorage.getItem("token");

  const baseUrl = "https://stackwave-h1x0.onrender.com";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${baseUrl}/users/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load user profile. Please ensure the user exists and try again."
        );
      }
    };
    fetchUser();
  }, [id]);

  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!user)
    return <div className="text-center mt-10 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center px-4 py-8">
      {/* Navbar mimic */}
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
            <AvatarImage
              src={user.media?.url || "/default-avatar.png"}
              alt={user.name}
            />
            <AvatarFallback>
              {user.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div className="mt-4 md:mt-0 text-center md:text-left">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-400 text-sm">{user.email}</p>
            <p className="text-gray-400 text-sm mt-1">
              🕒 Dropped {formatTime(user.dropped)}
            </p>
            <p className="text-gray-500 text-sm">
              🟢 Last activity {formatTime(user.lastActivity)}
            </p>
          </div>

          {/* Edit Button */}
          <div className="ml-auto mt-4 md:mt-0">
            <Button variant="ghost" className="border border-white/10">
              Edit
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-4 flex-wrap justify-center md:justify-start">
          {["Summary", "Questions", "Answers", "Votes"].map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              variant="secondary"
              className={`bg-zinc-800 text-white hover:bg-zinc-700 ${
                activeTab === tab ? "bg-zinc-700" : ""
              }`}
            >
              {tab}
            </Button>
          ))}
        </div>
      </Card>

      {/* Tab Content */}
      <div className="w-full max-w-4xl mt-4">
        {activeTab === "Summary" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <Card className="bg-zinc-900 border border-zinc-700 p-6">
              <p className="text-sm text-gray-400">Reputation</p>
              <p className="text-2xl mt-2 font-semibold">
                {user.reputation || 1}
              </p>
            </Card>
            <Card className="bg-zinc-900 border border-zinc-700 p-6">
              <p className="text-sm text-gray-400">Questions asked</p>
              <p className="text-2xl mt-2 font-semibold">
                {user.questions?.length || 0}
              </p>
            </Card>
            <Card className="bg-zinc-900 border border-zinc-700 p-6">
              <p className="text-sm text-gray-400">Answers given</p>
              <p className="text-2xl mt-2 font-semibold">
                {user.answers?.length || 0}
              </p>
            </Card>
          </div>
        )}

        {activeTab === "Questions" && (
          <>
            {user.questions.length > 0 ? (
              user.questions.map((q) => (
                <Card
                  key={q._id}
                  className="bg-zinc-900 border border-zinc-700 p-4 mb-4 rounded-xl"
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-400">
                      {q.votes.length} votes
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatTime(q.createdAt)} ago
                    </p>
                  </div>
                  <Link
                    to={`/questions/${q._id}`}
                    className="text-lg font-semibold text-orange-400 hover:underline"
                  >
                    {q.title}
                  </Link>
                  <div className="flex gap-2 mt-2">
                    {q.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="bg-zinc-800 text-xs px-2 py-1 rounded-full text-gray-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-4 text-gray-500">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-sm">
                        {user.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-gray-400 text-center">No questions yet.</p>
            )}
          </>
        )}

        {activeTab === "Answers" && (
          <>
            {user.answers && user.answers.length > 0 ? (
              user.answers.map((a) => (
                <Card
                  key={a._id}
                  className="bg-zinc-900 border border-zinc-700 p-4 mb-4 rounded-xl"
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-400">
                      {a.votes?.length || 0} votes
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatTime(a.createdAt)} ago
                    </p>
                  </div>
                  <p className="text-white mb-2">{a.content}</p>

                  {a.question && (
                    <div className="text-sm text-orange-400">
                      In response to:{" "}
                      <Link
                        to={`/questions/${a.question._id}`}
                        className="hover:underline"
                      >
                        {a.question.title}
                      </Link>
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <p className="text-gray-400 text-center">No answers given yet.</p>
            )}
          </>
        )}

        {activeTab === "Votes" && (
          <p className="text-gray-400 text-center">No votes yet.</p>
        )}
      </div>

      {/* Pagination (optional for questions tab only) */}
      {activeTab === "Questions" && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button variant="outline" className="border-white text-white px-4">
            Previous
          </Button>
          <span className="text-gray-400">1 of 1</span>
          <Button variant="outline" className="border-white text-white px-4">
            Next
          </Button>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-10 text-center text-gray-500 text-sm">
        <div className="flex justify-center gap-6 mb-2">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Questions</a>
        </div>
        <p className="text-xs text-gray-600">© 2024 Riverpod</p>
      </footer>
    </div>
  );
}

function formatTime(dateString) {
  if (!dateString) return "N/A";
  const diff = Math.floor((Date.now() - new Date(dateString)) / 60000);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff} minutes`;
  const hours = Math.floor(diff / 60);
  return `${hours} hour${hours > 1 ? "s" : ""}`;
}
