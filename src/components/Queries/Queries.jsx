import React, { useState, useEffect } from "react";
import QueryForm from "./QueryForm";
import QueryList from "./QueryList";
import QueryDetails from "./QueryDetails";

export default function Queries({ currentRole, users }) {
  const [queries, setQueries] = useState(() => {
    const stored = localStorage.getItem("school_queries");
    return stored ? JSON.parse(stored) : [];
  });
  const [selectedQuery, setSelectedQuery] = useState(null);

  useEffect(() => {
    localStorage.setItem("school_queries", JSON.stringify(queries));
  }, [queries]);

  const canManage = ["Teacher", "Principal", "Owner"].includes(currentRole);
  const studentUser = users.find((u) => u.role === "Student");

  const handleCreateQuery = (newQuery) => {
    setQueries((prev) => [...prev, newQuery]);
  };

  const handleReply = (queryId, reply) => {
    setQueries((prev) =>
      prev.map((q) =>
        q.id === queryId
          ? { ...q, replies: [...q.replies, reply] }
          : q
      )
    );
  };

  const handleStatusChange = (queryId, newStatus) => {
    setQueries((prev) =>
      prev.map((q) => (q.id === queryId ? { ...q, status: newStatus } : q))
    );
  };

  return (
    <div className="p-4 card space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">📬 Queries</h2>
      </div>

      {currentRole === "Student" && (
        <QueryForm onCreate={handleCreateQuery} student={studentUser} />
      )}

      <QueryList
        queries={queries}
        currentRole={currentRole}
        student={studentUser}
        onSelect={setSelectedQuery}
      />

      {selectedQuery && (
        <QueryDetails
          query={selectedQuery}
          currentRole={currentRole}
          onClose={() => setSelectedQuery(null)}
          onReply={handleReply}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
