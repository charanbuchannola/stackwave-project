import React from "react";
import { useAuth } from "@/context/ContextAuth";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full max-w-5xl flex justify-between items-center py-4 px-6">
      <div className="text-xl font-bold">StackClone</div>
      <div className="flex space-x-4">
        {user ? (
          <>
            <span className="px-4 py-2 rounded-lg bg-gray-700 text-white">
              {user.name}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600">
              Login
            </button>
            <button className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600">
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
