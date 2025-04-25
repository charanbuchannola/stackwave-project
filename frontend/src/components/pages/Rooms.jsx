import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Star, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const baseUrl = "https://stackwave-h1x0.onrender.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, roomsRes] = await Promise.all([
          axios.get(`${baseUrl}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseUrl}/chat/rooms`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setCurrentUser(userRes.data);
        setRooms(roomsRes.data);
      } catch (err) {
        console.error("Error loading data", err);
      }
    };
    fetchData();
  }, []);

  const handleJoin = async (roomId) => {
    try {
      await axios.post(
        `${baseUrl}/chat/room/${roomId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/room/${roomId}`);
    } catch (err) {
      console.error("Join room failed:", err);
      alert("Failed to join the room. Please try again.");
    }
  };

  const handleDelete = async (roomId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this room?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${baseUrl}/chat/room/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms((prev) => prev.filter((room) => room._id !== roomId));
    } catch (err) {
      console.error("Failed to delete room:", err);
      alert("Failed to delete the room.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-4xl font-bold mb-12 text-center text-white/90">
        💬 Available Chat Rooms
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {rooms.map((room) => {
          const isCreator = currentUser?._id === room.createdBy?._id;

          return (
            <div
              key={room._id}
              className="relative p-8 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Star className="absolute top-3 right-3 h-5 w-5 text-white/50" />

              <div className="space-y-4">
                <div className="text-xl font-semibold text-white/90 line-clamp-2">
                  {room.question}
                </div>

                <div className="flex items-center space-x-3 text-sm text-white/70">
                  <img
                    src={room.createdBy?.media.url || "/default-avatar.png"}
                    alt="creator avatar"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                  />
                  <span>{room.createdBy?.username || "Unknown"}</span>
                </div>

                <div className="text-xs text-white/50">
                  {formatDistanceToNow(new Date(room.createdAt || Date.now()), {
                    addSuffix: true,
                  })}
                </div>

                <span className="inline-block text-xs px-4 py-1 bg-blue-500/10 text-blue-300 rounded-full">
                  {room.techCategory}
                </span>

                <div className="flex -space-x-2 mt-4">
                  {room.participants?.map((user) => (
                    <div
                      key={user._id}
                      className="group relative w-10 h-10 rounded-full border-2 border-white/30"
                    >
                      <img
                        src={user.media.url || "/default-avatar.png"}
                        alt={user.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                      <span className="absolute z-10 hidden group-hover:block text-xs bg-black text-white px-2 py-1 rounded shadow-lg top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        {user.username}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <Button
                  onClick={() => handleJoin(room._id)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200"
                >
                  Join
                </Button>

                {isCreator && (
                  <button
                    onClick={() => handleDelete(room._id)}
                    className="text-red-400 hover:text-red-600 text-sm flex items-center gap-1 font-semibold transition-all duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
