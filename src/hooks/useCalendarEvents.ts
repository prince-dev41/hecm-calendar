import { useState, useEffect } from 'react';
import { ClassEvent } from '../types';

export function useCalendarEvents() {
  const [events, setEvents] = useState<ClassEvent[]>(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    return savedEvents ? JSON.parse(savedEvents).map((event: ClassEvent) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end)
    })) : [];
  });

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  return { events, setEvents };
}