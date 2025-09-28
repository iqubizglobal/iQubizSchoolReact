import React, { useState } from "react";

export default function QueryDetails({ query, currentRole, onClose, onReply, onStatusChange }) {
  const [replyText, setReplyText] = useState("");

  const canManage = ["Teacher", "Principal", "Owner"].includes(currentRole);

  const handleReply = () => {
    if (!replyText) return;
    const reply = {
      author: currentRole,
      text: replyText,
      date: new Date().toISOString(),
    };
    onReply(query.id, reply);
    setReplyText("");
  };

  return (
    <div className="p-4 mt-4 border rounded-lg bg-gray-50">
      <div className="flex justify-between mb-2">
        <h3 className="font-semibold">{query.title}</h3>
        <button onClick={onClose} className="text-gray-500 hover:underline">✕ Close</button>
      </div>
      <p className="text-sm text-gray-700">{query.description}</p>
      <p className="text-xs text-gray-500 mt-1">Raised by: {query.raisedBy} • {new Date(query.date).toLocaleString()}</p>

      <div className="mt-3 space-y-2">
        {query.replies.map((r, i) => (
          <div key={i} className="p-2 bg-white border rounded text-sm">
            <div className="font-semibold">{r.author}</div>
            <div>{r.text}</div>
            <div className="text-xs text-gray-400">{new Date(r.date).toLocaleString()}</div>
          </div>
        ))}
      </div>

      {canManage && (
        <>
          <div className="mt-3 flex gap-2">
            <select
              value={query.status}
              onChange={(e) => onStatusChange(query.id, e.target.value)}
              className="input"
            >
              <option>New</option>
              <option>In Progress</option>
              <option>Closed</option>
            </select>
          </div>

          <div className="mt-3 flex gap-2">
            <input
              className="input flex-1"
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button
              onClick={handleReply}
              className="bg-[var(--brand-blue)] text-white px-3 py-2 rounded"
            >
              Reply
            </button>
          </div>
        </>
      )}
    </div>
  );
}
