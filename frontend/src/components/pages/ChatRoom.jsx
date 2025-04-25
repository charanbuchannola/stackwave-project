import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Editor from "@monaco-editor/react";
import axios from "axios";

export default function ChatRoom() {
  const { roomId } = useParams();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [code, setCode] = useState("// Start coding...");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const messagesEndRef = useRef(null);
  const ignoreChange = useRef(false); // <== Important fix

  const baseUrl = "https://stackwave-h1x0.onrender.com";

  useEffect(() => {
    const newSocket = io(baseUrl, {
      auth: { token: localStorage.getItem("token") },
    });

    newSocket.on("connect", () => {
      newSocket.emit("join-room", roomId);
    });

    newSocket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    newSocket.on("code-update", ({ code }) => {
      ignoreChange.current = true; // don't emit this change back
      setCode(code);
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!msg.trim()) return;
    socket.emit("send-message", { roomId, message: msg });
    setMessages((prev) => [...prev, { user: "You", message: msg }]);
    setMsg("");
  };

  const handleCodeChange = (newCode) => {
    if (ignoreChange.current) {
      ignoreChange.current = false;
      return; // ignore socket-updated change
    }
    setCode(newCode);
    socket.emit("code-change", { roomId, code: newCode });
  };

  const runCode = async () => {
    try {
      const response = await axios.post(
        "https://emkc.org/api/v2/piston/execute",
        {
          language,
          version: "*",
          files: [{ name: `main.${language}`, content: code }],
        }
      );

      const result = response.data;
      const outputText =
        result.run?.stdout ||
        result.run?.output ||
        result.run?.stderr ||
        "No output";
      setOutput(outputText);
    } catch (error) {
      setOutput(
        "Error running code: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen p-4 gap-4">
      {/* Chat Section */}
      <div className="flex flex-col rounded-2xl overflow-hidden bg-[#1E1E1E] border border-gray-700 shadow-inner">
        <div className="px-4 py-3 bg-[#2A2A2A] text-white text-lg font-semibold border-b border-gray-700 shadow-sm">
          Room: {roomId}
        </div>

        <ScrollArea className="flex-1 px-4 py-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.user === "You" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-sm px-4 py-3 rounded-xl shadow-md text-sm break-words ${
                    m.user === "You"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-700 text-white rounded-bl-none"
                  }`}
                >
                  <div className="text-xs font-semibold mb-1 opacity-60">
                    {m.user}
                  </div>
                  <div>{m.message}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-3 border-t border-gray-700 flex gap-2 items-center bg-[#2A2A2A]">
          <Input
            className="flex-1 bg-[#1E1E1E] text-white border border-gray-600 placeholder-gray-400 focus:ring-1 focus:ring-blue-500"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={send}
          >
            Send
          </Button>
        </div>
      </div>

      {/* Monaco Editor Section */}
      {/* Monaco Editor Section */}
      <div className="flex flex-col border border-gray-700 rounded-2xl overflow-hidden bg-[#1E1E1E] shadow-inner">
        <div className="flex justify-between items-center p-2 bg-gray-100 border-b gap-2">
          <select
            className="p-1 border rounded"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
          <Button size="sm" onClick={runCode}>
            Run Code
          </Button>
        </div>

        <Editor
          height="60%"
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
        />

        <div className="bg-black text-white text-sm p-2 h-[40%] overflow-auto border-t">
          <div className="font-mono whitespace-pre-wrap">
            {output || "// Output will appear here..."}
          </div>
        </div>
      </div>
    </div>
  );
}
