import React, { useState } from "react";

export default function QueryForm({ onCreate, student }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) return;

    const newQuery = {
      id: Date.now(),
      title,
      description,
      raisedBy: student?.name || "Unknown",
      class: student?.cls || "",
      date: new Date().toISOString(),
      status: "New",
      replies: [],
    };

    onCreate(newQuery);
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 p-3 bg-gray-50 rounded-lg border">
      <h3 className="font-semibold mb-2">Raise a New Query</h3>
      <input
        className="input w-full"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="input w-full"
        placeholder="Describe your issue or query"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        type="submit"
        className="bg-[var(--brand-blue)] text-white px-4 py-2 rounded"
      >
        Submit Query
      </button>
    </form>
  );
}
