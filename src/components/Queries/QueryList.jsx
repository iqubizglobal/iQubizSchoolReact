import React from "react";

export default function QueryList({ queries, currentRole, student, onSelect }) {
  const filtered = currentRole === "Student"
    ? queries.filter((q) => q.raisedBy === student?.name)
    : queries;

  const getStatusColor = (status) => {
    switch (status) {
      case "New": return "bg-yellow-100 text-yellow-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Closed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">Your Queries</h3>
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500">No queries found.</p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((q) => (
            <li
              key={q.id}
              onClick={() => onSelect(q)}
              className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">{q.title}</div>
                  <div className="text-xs text-gray-500">{new Date(q.date).toLocaleString()}</div>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${getStatusColor(q.status)}`}>
                  {q.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-1 line-clamp-2">{q.description}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
