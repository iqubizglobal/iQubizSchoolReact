import React, { useEffect, useMemo, useState } from "react";

/**
 * Lost & Found Module
 * Props: currentRole, users, brand (optional)
 * localStorage key: iq_lost_found_v1
 */
export default function LostFound({ currentRole, users = [], brand = {} }) {
  const STORAGE_KEY = "iq_lost_found_v1";
  const canManage = ["Teacher", "Class Teacher", "Principal", "Owner"].includes(currentRole);

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

  // filters & search
  const [statusFilter, setStatusFilter] = useState("all"); // all | unclaimed | claimed | returned
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      const okStatus = statusFilter === "all" ? true : it.status === statusFilter;
      const okQuery = !q
        ? true
        : [it.title, it.description, it.location, it.foundBy, it.ownerHint]
            .filter(Boolean)
            .some((t) => t.toLowerCase().includes(q));
      return okStatus && okQuery;
    });
  }, [items, statusFilter, query]);

  // create item (staff)
  const handleAdd = (newItem) => {
    setItems((prev) => [{ ...newItem, id: Date.now() }, ...prev]);
  };

  // claim item (student/parent)
  const handleClaim = (itemId, claim) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId
          ? {
              ...it,
              status: "claimed",
              claim: { ...claim, date: new Date().toISOString() },
            }
          : it
      )
    );
  };

  // approve return (staff)
  const handleMarkReturned = (itemId, receiverName) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId
          ? {
              ...it,
              status: "returned",
              returnedAt: new Date().toISOString(),
              returnedTo: receiverName || it?.claim?.name || "Unknown",
            }
          : it
      )
    );
  };

  // delete (staff)
  const handleDelete = (itemId) => {
    if (!confirm("Delete this item?")) return;
    setItems((prev) => prev.filter((it) => it.id !== itemId));
  };

  const safeBrand = {
    blue: brand.blue || "#0C3C78",
    orange: brand.orange || "#F15A24",
  };

  return (
    <div className="p-4 card space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold" style={{ color: safeBrand.blue }}>
            🧳 Lost & Found
          </h2>
          <p className="text-sm text-gray-500">Post lost items with images. Students/parents can claim.</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search item, location, hint…"
            className="input"
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input">
            <option value="all">All</option>
            <option value="unclaimed">Unclaimed</option>
            <option value="claimed">Claimed</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </div>

      {canManage && <LFEditor onAdd={handleAdd} brand={safeBrand} />}

      <LFGrid
        items={filtered}
        currentRole={currentRole}
        onClaim={handleClaim}
        onMarkReturned={handleMarkReturned}
        onDelete={handleDelete}
        brand={safeBrand}
      />
    </div>
  );
}

/* ------------------- Editor (staff only) ------------------- */
function LFEditor({ onAdd, brand }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dateFound: new Date().toISOString().slice(0, 10),
    location: "",
    ownerHint: "",
    photo: null, // Data URL
    foundBy: "",
  });

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setForm((f) => ({ ...f, photo: e.target.result }));
    reader.readAsDataURL(file);
  };

  const submit = (e) => {
    e.preventDefault();
    const { title, description, dateFound, location } = form;
    if (!title.trim() || !dateFound || !location.trim()) {
      alert("Title, Date Found, and Location are required.");
      return;
    }
    onAdd({
      ...form,
      status: "unclaimed",
      claim: null,
      returnedAt: null,
      returnedTo: null,
    });
    setForm({
      title: "",
      description: "",
      dateFound: new Date().toISOString().slice(0, 10),
      location: "",
      ownerHint: "",
      photo: null,
      foundBy: "",
    });
  };

  return (
    <form onSubmit={submit} className="p-3 border rounded-xl bg-white space-y-2">
      <h3 className="font-semibold mb-1">Add Lost Item</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <input className="input" placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="input" type="date" value={form.dateFound} onChange={(e) => setForm({ ...form, dateFound: e.target.value })} />
        <input className="input" placeholder="Location *" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input className="input md:col-span-2" placeholder="Owner hint (e.g., name on tag, class)" value={form.ownerHint} onChange={(e) => setForm({ ...form, ownerHint: e.target.value })} />
        <input className="input" placeholder="Found by (optional)" value={form.foundBy} onChange={(e) => setForm({ ...form, foundBy: e.target.value })} />
        <textarea className="input md:col-span-3" rows={2} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="flex items-center gap-3 md:col-span-3">
          <label className="px-3 py-2 rounded border cursor-pointer bg-[rgba(12,60,120,0.06)]">📷 Upload Photo
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
          </label>
          {form.photo && <img src={form.photo} alt="preview" className="h-16 w-16 object-cover rounded border" />}
        </div>
      </div>
      <button type="submit" className="px-4 py-2 rounded text-white" style={{ background: brand.blue }}>
        ➕ Add Item
      </button>
    </form>
  );
}

/* ------------------- Grid & Cards ------------------- */
function LFGrid({ items, currentRole, onClaim, onMarkReturned, onDelete, brand }) {
  if (items.length === 0) {
    return <div className="p-6 text-center text-sm text-gray-500 border rounded-xl bg-white">No items.</div>;
  }

  const palette = ["#FFF2E6", "#E6F7FF", "#F3E8FF", "#E6FFFA", "#FFF5F7", "#F0FFF4", "#FDF6B2"];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((it, idx) => (
        <div key={it.id} className="rounded-xl border shadow-sm overflow-hidden bg-white">
          <div className="h-36 w-full bg-gray-100 flex items-center justify-center" style={{ background: palette[idx % palette.length] }}>
            {it.photo ? (
              <img src={it.photo} alt={it.title} className="h-36 w-full object-cover" />
            ) : (
              <div className="text-gray-500 text-sm">No image</div>
            )}
          </div>

          <div className="p-3 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{it.title}</div>
                <div className="text-xs text-gray-500">Found: {it.dateFound} • {it.location}</div>
              </div>
              <StatusPill status={it.status} />
            </div>

            {it.ownerHint && <div className="text-xs text-gray-600">Hint: {it.ownerHint}</div>}
            {it.description && <div className="text-sm text-gray-700">{it.description}</div>}
            {it.foundBy && <div className="text-xs text-gray-500">Found by: {it.foundBy}</div>}

            {/* Claim details */}
            {it.status !== "unclaimed" && it.claim && (
              <div className="p-2 rounded border bg-gray-50 text-xs">
                <div className="font-medium mb-1">Claim</div>
                <div>Name: {it.claim.name}</div>
                {it.claim.class && <div>Class: {it.claim.class}</div>}
                {it.claim.contact && <div>Contact: {it.claim.contact}</div>}
                {it.claim.note && <div>Note: {it.claim.note}</div>}
                <div className="text-[11px] text-gray-500 mt-1">Requested: {new Date(it.claim.date).toLocaleString()}</div>
              </div>
            )}

            {/* Returned details */}
            {it.status === "returned" && (
              <div className="text-xs text-green-700">✅ Returned to {it.returnedTo} on {new Date(it.returnedAt).toLocaleString()}</div>
            )}

            <div className="pt-1 flex flex-wrap gap-2">
              {it.status === "unclaimed" && (
                <ClaimButton brand={brand} onSubmit={(claim) => onClaim(it.id, claim)} />
              )}

              {["Teacher", "Class Teacher", "Principal", "Owner"].includes(currentRole) && it.status === "claimed" && (
                <button
                  className="px-3 py-1 rounded text-white"
                  style={{ background: brand.blue }}
                  onClick={() => {
                    const receiver = prompt("Enter receiver name (student/parent):", it?.claim?.name || "");
                    if (receiver !== null) onMarkReturned(it.id, receiver || it?.claim?.name || "");
                  }}
                >
                  ✅ Mark Returned
                </button>
              )}

              {["Teacher", "Class Teacher", "Principal", "Owner"].includes(currentRole) && (
                <button className="px-3 py-1 rounded border" onClick={() => onDelete(it.id)}>
                  🗑 Delete
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    unclaimed: "bg-yellow-100 text-yellow-800",
    claimed: "bg-blue-100 text-blue-800",
    returned: "bg-green-100 text-green-800",
  };
  return <span className={`px-2 py-1 text-xs rounded ${map[status] || "bg-gray-100 text-gray-800"}`}>{status}</span>;
}

/* ------------------- Claim Button & Modal (lightweight) ------------------- */
function ClaimButton({ onSubmit, brand }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", class: "", contact: "", note: "" });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim()) {
      alert("Name and Contact are required to claim.");
      return;
    }
    onSubmit(form);
    setOpen(false);
    setForm({ name: "", class: "", contact: "", note: "" });
  };

  return (
    <>
      <button className="px-3 py-1 rounded text-white" style={{ background: brand.orange }} onClick={() => setOpen(true)}>
        🎫 Claim
      </button>

      {open && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 md:inset-auto md:m-auto md:top-1/2 md:-translate-y-1/2 md:w-[520px] bg-white rounded-t-2xl md:rounded-2xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Claim Item</h4>
              <button onClick={() => setOpen(false)} className="text-gray-500">✕</button>
            </div>
            <form onSubmit={submit} className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input className="input" placeholder="Your Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input className="input" placeholder="Class (optional)" value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} />
                <input className="input md:col-span-2" placeholder="Contact (phone/email) *" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
                <textarea className="input md:col-span-2" rows={3} placeholder="Note to staff (optional)" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button type="button" className="px-3 py-2 rounded border" onClick={() => setOpen(false)}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded text-white" style={{ background: brand.blue }}>Submit Claim</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
