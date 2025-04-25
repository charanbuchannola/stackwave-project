import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import HomePage from "./components/pages/HomePage";
import ProfilePage from "./components/pages/ProfilePage";
import UsersPage from "./components/pages/UsersPage";
import QuestionsPage from "./components/pages/QuestionsPage";
import CreateQuestion from "./components/pages/CreateQuestion";
import QuestionDetailsPage from "./components/pages/QuestionDetailsPage";
import ChatRoom from "./components/pages/ChatRoom";
import CreateRoom from "./components/pages/CreateRoom";
import Rooms from "./components/pages/Rooms";
import UserProfile from "./components/pages/UserProfile";
import SubAdminPage from "./components/pages/SubAdminPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/allusers" element={<UsersPage />} />
        <Route path="/users/:id" element={<UserProfile />} />
        <Route path="/adminpage" element={<SubAdminPage />} />

        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/create" element={<CreateQuestion />} />
        <Route path="/question/:id" element={<QuestionDetailsPage />} />
        <Route path="/room/:roomId" element={<ChatRoom />} />
        <Route path="/createroom" element={<CreateRoom />} />
        <Route path="/rooms" element={<Rooms />} />
      </Routes>
    </>
  );
};

export default App;
