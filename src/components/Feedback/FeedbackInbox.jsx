import React, { useMemo, useState } from "react";

/**
 * Principal/Owner inbox for feedback
 * - filter by status/category
 * - reply
 * - change status: New / In Progress / Closed
 * - delete
 */
export default function FeedbackInbox({ items = [], onReply, onStatus, onDelete, brand = {} }) {
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(null); // selected feedback

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      const okStatus = status === "all" ? true : it.status === status;
      const okCat = category === "all" ? true : it.category === category;
      const okQuery = !q
        ? true
        : [it.subject, it.message, it.raisedBy, it.class, it.contact]
            .filter(Boolean)
            .some((t) => t.toLowerCase().includes(q));
      return okStatus && okCat && okQuery;
    });
  }, [items, status, category, query]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Left: Filters + List */}
      <div className="md:col-span-1 space-y-2">
        <div className="p-3 border rounded-xl bg-white space-y-2">
          <div className="flex gap-2">
            <select className="input flex-1" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All Statuses</option>
              <option>New</option>
              <option>In Progress</option>
              <option>Closed</option>
            </select>
            <select className="input flex-1" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All Categories</option>
              <option>General</option>
              <option>Teacher</option>
              <option>Facilities</option>
              <option>Transport</option>
              <option>Fees</option>
              <option>Other</option>
            </select>
          </div>
          <input
            className="input w-full"
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="p-0 border rounded-xl overflow-hidden bg-white">
          {filtered.length === 0 ? (
            <div className="p-6 text-sm text-gray-500 text-center">No feedback found.</div>
          ) : (
            <ul className="divide-y">
              {filtered.map((f) => (
                <li
                  key={f.id}
                  className={`p-3 cursor-pointer hover:bg-gray-50 ${active?.id === f.id ? "bg-gray-50" : ""}`}
                  onClick={() => setActive(f)}
                >
                  <div className="flex justify-between items-start">
                    <div className="font-medium">{f.subject}</div>
                    <StatusPill status={f.status} />
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {f.raisedBy} {f.class ? `• ${f.class}` : ""} • {new Date(f.createdAt).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-700 line-clamp-2 mt-1">{f.message}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right: Detail */}
      <div className="md:col-span-2">
        {active ? (
          <FeedbackDetail
            item={active}
            onReply={(text) => onReply(active.id, { text, date: new Date().toISOString(), by: "Principal/Owner" })}
            onStatus={(s) => { onStatus(active.id, s); setActive((a) => ({ ...a, status: s })); }}
            onDelete={() => { if (confirm("Delete this feedback?")) { onDelete(active.id); setActive(null); } }}
            brand={brand}
          />
        ) : (
          <div className="p-6 border rounded-xl bg-white text-sm text-gray-500">Select a feedback to view details</div>
        )}
      </div>
    </div>
  );
}

function FeedbackDetail({ item, onReply, onStatus, onDelete, brand }) {
  const [text, setText] = useState("");

  return (
    <div className="p-4 border rounded-xl bg-white space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-lg font-semibold">{item.subject}</div>
          <div className="text-xs text-gray-500">
            {item.raisedBy} {item.class ? `• ${item.class}` : ""} • {new Date(item.createdAt).toLocaleString()} • {item.category}
          </div>
        </div>
        <div className="flex gap-2">
          <select className="input" value={item.status} onChange={(e) => onStatus(e.target.value)}>
            <option>New</option>
            <option>In Progress</option>
            <option>Closed</option>
          </select>
          <button className="px-3 py-2 rounded border" onClick={onDelete}>🗑 Delete</button>
        </div>
      </div>

      <div className="text-sm text-gray-800 whitespace-pre-line">{item.message}</div>
      {item.contact && <div className="text-xs text-gray-500">Contact: {item.contact}</div>}

      <div className="space-y-2">
        {(item.replies || []).map((r, i) => (
          <div key={i} className="p-2 border rounded bg-gray-50 text-sm">
            <div className="font-medium">{r.by}</div>
            <div>{r.text}</div>
            <div className="text-xs text-gray-400">{new Date(r.date).toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="input flex-1"
          placeholder="Write a reply to sender…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="px-4 py-2 rounded text-white"
          style={{ background: brand.blue || "var(--brand-blue)" }}
          onClick={() => {
            if (!text.trim()) return;
            onReply(text.trim());
            setText("");
          }}
        >
          Reply
        </button>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    "New": "bg-yellow-100 text-yellow-800",
    "In Progress": "bg-blue-100 text-blue-800",
    "Closed": "bg-green-100 text-green-800",
  };
  return <span className={`px-2 py-1 rounded text-xs ${map[status] || "bg-gray-100 text-gray-800"}`}>{status}</span>;
}
