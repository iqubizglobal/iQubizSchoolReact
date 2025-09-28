import React, { useEffect, useState } from "react";
import FeedbackForm from "./FeedbackForm";
import FeedbackInbox from "./FeedbackInbox";

const STORAGE_KEY = "iq_feedback_v1";

export default function Feedback({ currentRole, users, brand = {} }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const canManage = ["Principal", "Owner"].includes(currentRole);
  const studentUser = users?.find((u) => u.role === "Student");

  const createFeedback = (f) => setItems((prev) => [{ ...f, id: Date.now() }, ...prev]);
  const addReply = (id, reply) =>
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, replies: [...(x.replies || []), reply] } : x)));
  const setStatus = (id, status) =>
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)));
  const remove = (id) => setItems((prev) => prev.filter((x) => x.id !== id));

  return (
    <div className="p-4 card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: brand.blue || "var(--brand-blue)" }}>
            📨 Feedback
          </h2>
          <p className="text-sm text-gray-500">
            Students/Parents can submit feedback. Principal/Owner can review & reply.
          </p>
        </div>
      </div>

      {/* Submit view for Students/Parents; Inbox for Principal/Owner */}
      {canManage ? (
        <FeedbackInbox
          items={items}
          onReply={addReply}
          onStatus={setStatus}
          onDelete={remove}
          brand={brand}
        />
      ) : (
        <FeedbackForm
          onSubmit={createFeedback}
          student={studentUser}
          brand={brand}
        />
      )}
    </div>
  );
}
