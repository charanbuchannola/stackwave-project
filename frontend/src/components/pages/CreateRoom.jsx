import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

export default function CreateRoom() {
  const [question, setQuestion] = useState("");
  const [tech, setTech] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const baseUrl = "https://stackwave-h1x0.onrender.com";

  const handleCreate = async () => {
    if (!question.trim() || !tech.trim()) return;
    try {
      await axios.post(
        `${baseUrl}/chat/create`,
        { question, techCategory: tech },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/rooms");
    } catch (err) {
      console.error("Room creation failed:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md p-6 space-y-4 shadow-xl">
        <h2 className="text-2xl font-semibold text-center">Create a Chat Room</h2>

        <div className="space-y-2">
          <Label htmlFor="question">Question</Label>
          <Input
            id="question"
            placeholder="Ask your tech question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tech">Tech Category</Label>
          <Input
            id="tech"
            placeholder="e.g., React, Node.js"
            value={tech}
            onChange={(e) => setTech(e.target.value)}
          />
        </div>

        <Button className="w-full mt-4" onClick={handleCreate}>
          Create Room
        </Button>
      </Card>
    </div>
  );
}
