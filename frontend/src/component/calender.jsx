import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import enUS from "date-fns/locale/en-US";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function MyCalendar({ events, onSelectSlot }) {
  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-center fw-bold">📅 Booking Calendar</h2>
      <Calendar
        localizer={localizer}
        events={events || []}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={onSelectSlot}
        style={{ height: 550, background: "#fff", padding: "10px", borderRadius: "10px" }}
      />
    </div>
  );
}
