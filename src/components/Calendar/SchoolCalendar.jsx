import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { readCalendarEvents, writeCalendarEvents } from "../../storage.js";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 0 }),
  getDay,
  locales,
});

const ALLOWED_CREATORS = ["Principal", "Owner", "Teacher", "Class Teacher"];

export default function SchoolCalendar({
  currentRole = "Principal",
  brand = { blue: "#0C3C78", orange: "#F15A24" },
}) {
  const [view, setView] = useState("month");
  const [events, setEvents] = useState(() => readCalendarEvents());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Event",
    start: "",
    end: "",
  });

  useEffect(() => {
    writeCalendarEvents(events);
  }, [events]);

  const eventStyleGetter = (event) => {
    const bg =
      event.type === "Holiday"
        ? "#EF4444"
        : event.type === "Event"
        ? "#F59E0B"
        : brand.blue;

    return {
      style: {
        backgroundColor: bg,
        color: "white",
        borderRadius: "6px",
        border: "none",
        padding: "3px 6px",
        fontSize: "0.75rem",
      },
    };
  };

  // ✅ Create new event flow
  const handleSlotSelect = (slot) => {
    if (!ALLOWED_CREATORS.includes(currentRole)) return;

    setEditingEvent(null);
    setFormData({
      title: "",
      description: "",
      type: "Event",
      start: format(slot.start, "yyyy-MM-dd'T'HH:mm"),
      end: format(slot.end, "yyyy-MM-dd'T'HH:mm"),
    });
    setModalOpen(true);
  };

  // ✅ Edit existing event
  const handleEventClick = (ev) => {
    if (!ALLOWED_CREATORS.includes(currentRole)) {
      alert(`${ev.title}\n${ev.type}\n${ev.description || ""}`);
      return;
    }

    setEditingEvent(ev);
    setFormData({
      title: ev.title,
      description: ev.description || "",
      type: ev.type || "Event",
      start: format(ev.start, "yyyy-MM-dd'T'HH:mm"),
      end: format(ev.end, "yyyy-MM-dd'T'HH:mm"),
    });
    setModalOpen(true);
  };

  // ✅ Save new or edited event
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.start || !formData.end) {
      alert("Please fill in required fields");
      return;
    }

    const eventObj = {
      id: editingEvent ? editingEvent.id : Date.now(),
      ...formData,
      start: new Date(formData.start),
      end: new Date(formData.end),
      allDay: true,
    };

    setEvents((prev) => {
      if (editingEvent) {
        // update
        return prev.map((ev) => (ev.id === editingEvent.id ? eventObj : ev));
      } else {
        // add
        return [...prev, eventObj];
      }
    });

    setModalOpen(false);
    setEditingEvent(null);
  };

  // ✅ Delete event
  const handleDelete = () => {
    if (!editingEvent) return;
    if (window.confirm(`Are you sure you want to delete "${editingEvent.title}"?`)) {
      setEvents((prev) => prev.filter((ev) => ev.id !== editingEvent.id));
      setModalOpen(false);
      setEditingEvent(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: brand.blue }}>
            School Calendar
          </h2>
          <p className="text-sm text-gray-500">
            Click a date to create event. Click existing event to edit/delete.
          </p>
        </div>
        <div>
          <select
            value={view}
            onChange={(e) => setView(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="day">Day</option>
            <option value="agenda">Agenda</option>
          </select>
        </div>
      </div>

      <div
        style={{
          minHeight: "600px",
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          style={{ height: "100%", minHeight: "600px" }}
          eventPropGetter={eventStyleGetter}
          selectable
          onSelectSlot={handleSlotSelect}
          onSelectEvent={handleEventClick}
        />
      </div>

      {/* ✨ Modal for Create / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              {editingEvent ? "Edit Event" : "Create Event"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Title *</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  className="w-full border rounded px-3 py-2 text-sm"
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Type</label>
                <select
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <option value="Event">Event</option>
                  <option value="Notice">Notice</option>
                  <option value="Holiday">Holiday</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Start *</label>
                  <input
                    type="datetime-local"
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={formData.start}
                    onChange={(e) =>
                      setFormData({ ...formData, start: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">End *</label>
                  <input
                    type="datetime-local"
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={formData.end}
                    onChange={(e) =>
                      setFormData({ ...formData, end: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between mt-5">
                {editingEvent ? (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-2 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                ) : (
                  <div />
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300"
                    onClick={() => {
                      setModalOpen(false);
                      setEditingEvent(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm rounded text-white"
                    style={{ backgroundColor: brand.blue }}
                  >
                    {editingEvent ? "Update" : "Save"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
