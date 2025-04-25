import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const baseUrl = "https://stackwave-h1x0.onrender.com";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/users/allusers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (err) {
        console.error("Error loading users", err);
      }
    };
    fetchUsers();
  }, []);

  const handleProfileClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-4xl font-bold mb-12 text-center text-white/90">
        👥 Users List
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {users?.map((user) => (
          <div
            key={user._id}
            className="p-5 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg hover:shadow-[0_0_12px_rgba(0,204,255,0.4)] hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <div className="flex justify-center mb-3">
              <img
                src={user.media?.url || "/default-avatar.png"}
                alt="User Avatar"
                className="w-20 h-20 rounded-full object-cover border-4 border-white/30"
              />
            </div>
            <div className="space-y-1 text-center">
              <div className="text-xl font-semibold text-white/90">
                {user.username}
              </div>
              <div className="text-sm text-white/60">{user.email}</div>
              <div className="text-xs text-white/50 truncate">
                {user.bio || "No bio available"}
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <Button
                onClick={() => handleProfileClick(user._id)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 hover:ring-2 hover:ring-blue-400 hover:ring-opacity-40"
              >
                View Profile
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
