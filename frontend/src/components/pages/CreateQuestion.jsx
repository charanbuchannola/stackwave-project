import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const toolbarButtons = [
  { label: "B", title: "Bold", insert: "**bold**" },
  { label: "I", title: "Italic", insert: "*italic*" },
  { label: "<>", title: "Code", insert: "`code`" },
  { label: '"', title: "Quote", insert: "> quote" },
  { label: "🔗", title: "Link", insert: "[title](url)" },
  { label: "🖼️", title: "Image", insert: "![alt text](image-url)" },
  { label: "H", title: "Heading", insert: "# Heading" },
  { label: "UL", title: "Unordered List", insert: "- item" },
  { label: "OL", title: "Ordered List", insert: "1. item" },
  {
    label: "{}",
    title: "Table",
    insert: "| col1 | col2 |\n| --- | --- |\n| val1 | val2 |",
  },
  { label: "<>", title: "HTML", insert: "<b>bold</b>" },
];

export default function AskQuestion() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [preview, setPreview] = useState(false);

  const baseUrl = "https://stackwave-h1x0.onrender.com";

  const insertAtCursor = (text) => {
    const textarea = document.getElementById("markdown-editor");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = body.slice(0, start) + text + body.slice(end);
    setBody(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result;
        if (base64Image.startsWith("data:image/")) {
          insertAtCursor(`![Uploaded Image](${base64Image})`);
        } else {
          alert("Invalid image format. Please upload a valid image.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token"); // or get from context
      if (!token) {
        alert("You must be logged in to ask a question.");
        return;
      }

      const res = await axios.post(
        `${baseUrl}/questions/createquestion`,
        { title, body, tags: tags.split(",").map((tag) => tag.trim()) },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Question submitted!");
      setTitle("");
      setBody("");
      setTags("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 mt-10 bg-black bg-opacity-40 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl text-white">
      <h2 className="text-3xl font-bold mb-6 text-white">
        Ask a Public Question
      </h2>

      {/* Title */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Title<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="w-full bg-zinc-900 text-white border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Be specific and imagine you're asking a question to another person"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Body */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Body<span className="text-red-500">*</span>
        </label>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 bg-zinc-800 border border-gray-600 px-3 py-2 rounded-t-lg">
          {toolbarButtons.map((btn, idx) => (
            <button
              key={idx}
              type="button"
              title={btn.title}
              onClick={() => insertAtCursor(btn.insert)}
              className="text-sm bg-zinc-700 hover:bg-zinc-600 px-2 py-1 rounded text-white"
            >
              {btn.label}
            </button>
          ))}
          <label className="ml-auto text-sm cursor-pointer bg-zinc-700 hover:bg-zinc-600 px-3 py-1 rounded text-white">
            🖼️ Upload
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </label>
          <button
            type="button"
            className="text-sm text-blue-400 hover:underline ml-3"
            onClick={() => setPreview(!preview)}
          >
            {preview ? "Edit Markdown" : "Live Preview"}
          </button>
        </div>

        {/* Editor or Preview */}
        {!preview ? (
          <textarea
            id="markdown-editor"
            className="w-full h-64 bg-zinc-900 text-white border border-t-0 border-gray-600 p-4 rounded-b-lg resize-none focus:outline-none"
            placeholder="Include all the information someone would need to answer your question"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        ) : (
          <div className="prose prose-invert bg-zinc-900 p-6 border border-t-0 border-gray-600 rounded-b-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Tags<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="w-full bg-zinc-900 text-white border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="e.g., react tailwind markdown"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-all duration-200 text-white font-semibold px-6 py-3 rounded-lg shadow-md"
      >
        Review Your Question
      </button>
    </div>
  );
}
