import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Trash2, Clock, Calendar as CalendarIcon, Edit3, Building2, User } from 'lucide-react';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Users, GraduationCap, BarChart2, Settings } from 'lucide-react';
import { fr } from 'date-fns/locale';

import {
  format,
  addDays,
  addHours,
  differenceInHours,
  isSameDay,
  startOfWeek,
  isBefore,
} from 'date-fns';
import { Sidebar } from './Sidebar';
interface ClassEvent {
  id: string;
  courseName: string;
  professor: string;
  room: string;
  start: Date;
  end: Date;
  color: string;
  description?: string;
}

// Modifier la plage horaire (6h à 00h)
const timeSlots = Array.from({ length: 18 }, (_, i) => i + 6);

const eventColors = [
  { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', text: 'text-blue-700', label: 'Bleu' },
  { bg: 'bg-green-500', hover: 'hover:bg-green-600', text: 'text-green-700', label: 'Vert' },
  { bg: 'bg-purple-500', hover: 'hover:bg-purple-600', text: 'text-purple-700', label: 'Violet' },
  { bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600', text: 'text-yellow-700', label: 'Jaune' },
  { bg: 'bg-red-500', hover: 'hover:bg-red-600', text: 'text-red-700', label: 'Rouge' },
];

function App() {
  const { user } = useAuth();
  const isDirector = user?.email === "princeekpinse97@gmail.com";
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<ClassEvent[]>(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    return savedEvents ? JSON.parse(savedEvents).map((event: ClassEvent) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end)
    })) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ClassEvent | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newEvent, setNewEvent] = useState({
    courseName: '',
    professor: '',
    room: '',
    start: new Date(),
    end: new Date(),
    color: eventColors[0].bg,
    description: ''
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    setEvents(prevEvents =>
      prevEvents.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      }))
    );
  }, [selectedDate]);

  const getDatesForWeek = () => {
    const start = startOfWeek(selectedDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const handleCreateOrUpdateEvent = () => {
    if (newEvent.courseName.trim() === '') {
      toast.error('Le nom du cours est requis');
      return;
    }
    if (newEvent.professor.trim() === '') {
      toast.error('Le nom du professeur est requis');
      return;
    }
    if (newEvent.room.trim() === '') {
      toast.error('La salle est requise');
      return;
    }
    if (isBefore(newEvent.end, newEvent.start)) {
      toast.error('L\'heure de fin ne peut pas être avant l\'heure de début');
      return;
    }

    const eventData: ClassEvent = {
      id: isEditMode ? selectedEvent!.id : Math.random().toString(36).substr(2, 9),
      courseName: newEvent.courseName,
      professor: newEvent.professor,
      room: newEvent.room,
      start: newEvent.start,
      end: newEvent.end,
      color: newEvent.color,
      description: newEvent.description
    };

    setEvents(prevEvents => {
      const updatedEvents = isEditMode 
        ? prevEvents.map(event => event.id === selectedEvent!.id ? eventData : event)
        : [...prevEvents, eventData];
      return updatedEvents;
    });

    closeModal();
  };

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      setEvents(prevEvents => {
        const updatedEvents = prevEvents.filter(event => event.id !== eventId);
        return updatedEvents;
      });
      toast.success('Cours supprimé avec succès');
      closeModal();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setIsEditMode(false);
    setNewEvent({
      courseName: '',
      professor: '',
      room: '',
      start: new Date(),
      end: addHours(new Date(), 1),
      color: eventColors[0].bg,
      description: ''
    });
  };

  const handleEventClick = (event: ClassEvent) => {
    if (!isDirector) {
      return;
    }

    setSelectedEvent(event);
    setNewEvent({
      courseName: event.courseName,
      professor: event.professor,
      room: event.room,
      start: new Date(event.start),
      end: new Date(event.end),
      color: event.color,
      description: event.description || ''
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const draggedEvent = events.find(e => e.id === active.id);
    if (!draggedEvent) return;

    const [newDay, newHour] = over.id.toString().split('-').map(Number);
    const weekStart = startOfWeek(selectedDate);
    const newStart = addDays(weekStart, newDay);
    newStart.setHours(newHour);

    const duration = differenceInHours(draggedEvent.end, draggedEvent.start);
    const newEnd = addHours(newStart, duration);

    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === draggedEvent.id
          ? { ...event, start: newStart, end: newEnd }
          : event
      )
    );
  };

  const getEventStyle = (event: ClassEvent, slotDate: Date, hour: number) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const slotStart = new Date(slotDate);
    slotStart.setHours(hour, 0, 0, 0);

    if (!isSameDay(slotStart, start) || start.getHours() !== hour) return null;

    const duration = differenceInHours(end, start);
    const isFirstSlot = isSameDay(slotStart, start) && start.getHours() === hour;
    const isLastSlot = isSameDay(addHours(slotStart, 1), end) && end.getHours() === hour + 1;

    return {
      height: `${Math.min(duration * 56)}px`,
      top: isFirstSlot ? `${(start.getMinutes() / 60) * 55}px` : '0',
      zIndex: isFirstSlot ? 10 : 5,
      borderRadius: isFirstSlot ? 'rounded-t' : isLastSlot ? 'rounded-b' : ''
    };
  };

  const getEventsForSlot = (date: Date, hour: number) => {
    return events.filter(event => {
      const eventStart = new Date(event.start);
      const slotStart = new Date(date);
      slotStart.setHours(hour, 0, 0, 0);

      return (
        isSameDay(eventStart, slotStart) &&
        eventStart.getHours() === hour
      );
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => addDays(prev, direction === 'next' ? 7 : -7));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-white flex overflow-hidden">
        {/* Sidebar with improved z-index and responsive behavior */}
        <Sidebar/>
        {/* Main content with improved responsive layout */}
        <div className="flex-1 ml-16 w-full">
          <header className="border-b border-gray-200 bg-white sticky top-0 ">
            <div className="flex flex-col sm:flex-row items-start sm:items-center px-4 py-3 space-y-3 sm:space-y-0">
              
              <div className="flex flex-wrap gap-2 w-full sm:w-auto sm:ml-8">
                {isDirector && (
                  <>
                    <button
                      onClick={() => {
                        setIsEditMode(false);
                        setIsModalOpen(true);
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center shadow-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter un cours
                    </button>
                    
                  </>
                )}
                <button
                  onClick={goToToday}
                  className="px-4 py-2 hidden md:block bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors shadow-sm whitespace-nowrap"
                >
                  Aujourd'hui
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateWeek('prev')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => navigateWeek('next')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="text-lg font-semibold whitespace-nowrap">
                    {format(selectedDate, 'MMMM yyyy', { locale: fr })}
                  </span>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-hidden">
            <div className="h-[calc(100vh-64px)] overflow-x-auto" id="calendar-container">
              <div className="min-w-[2800px] flex">
                <div className="w-16 sm:w-20 flex-none border-r border-gray-200 bg-white sticky left-0 z-40">
                  <div className="h-14 border-b border-gray-200"></div>
                  {timeSlots.map((hour) => (
                    <div key={hour} className="h-14 border-b border-gray-200">
                      <span className="text-xs text-gray-500 px-2">
                        {hour === 24 ? '00:00' : `${hour.toString().padStart(2, '0')}:00`}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex-1 grid grid-cols-7 min-w-0">
                  {getDatesForWeek().map((date, index) => (
                    <div key={index} className="border-r border-gray-200 min-w-[100px] relative">
                      {/* Header with improved sticky behavior */}
                      <div className="h-14 border-b border-gray-200 text-center py-2 sticky top-0 bg-white z-30">
                        <div className="text-xs sm:text-sm text-gray-500">{format(date, 'EEEE', { locale: fr })}</div>
                        <div className={`text-sm sm:text-lg font-semibold ${isSameDay(date, new Date()) ? 'text-blue-600' : ''}`}>
                          {format(date, 'd MMM', { locale: fr })}
                        </div>
                      </div>

                      {/* Time slots with improved event rendering */}
                      {timeSlots.map((hour) => (
                      <div
                        key={`${index}-${hour}`}
                        className="h-14 border-b border-gray-200 relative group"
                        onClick={() => {
                          if (isDirector && !isEditMode) {
                            const newDate = new Date(date);
                            newDate.setHours(hour);
                            setNewEvent(prev => ({
                              ...prev,
                              start: newDate,
                              end: addHours(newDate, 1)
                            }));
                            setIsModalOpen(true);
                          }
                        }}
                      >
                        <div className="absolute inset-0 group-hover:bg-blue-50 transition-colors duration-100"></div>
                        {getEventsForSlot(date, hour).map(event => {
                          const style = getEventStyle(event, date, hour);
                          if (!style) return null;

                          return (
                            <div
                              key={event.id}
                              className={`absolute left-0 right-0 flex flex-col gap-2 p-2 ${event.color} text-white text-sm ${isDirector ? 'cursor-pointer' : 'cursor-default'} overflow-auto transition-transform ${isDirector ? 'hover:scale-[1.02]' : ''} ${style.borderRadius}`}
                              style={{
                                height: style.height,
                                top: style.top,
                                zIndex: style.zIndex
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEventClick(event);
                              }}
                            >
                              <div className="font-semibold" style={{ wordBreak: 'break-word' }}>{event.courseName}</div>
                              <div className="text-xs opacity-90 truncate">
                                {format(event.start, 'HH:mm', { locale: fr })} - {format(event.end, 'HH:mm', { locale: fr })}
                              </div>
                              <div className="text-xs mt-1 truncate">
                                <span className="opacity-90">Salle {event.room}</span>
                                <span className="opacity-90 mx-1">•</span>
                                <span className="opacity-90">{event.professor}</span>
                              </div>
                            </div>
                          );
                        })}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Modal with highest z-index */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
              <div className="bg-white rounded-lg p-6 w-[480px] max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    {isEditMode ? (
                      <>
                        <Edit3 className="w-5 h-5 mr-2 text-gray-600" />
                        Modifier le cours
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 mr-2 text-gray-600" />
                        Ajouter un nouveau cours
                      </>
                    )}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom du cours
                    </label>
                    <input
                      type="text"
                      placeholder="Entrez le nom du cours"
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={newEvent.courseName}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, courseName: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      Professeur
                    </label>
                    <input
                      type="text"
                      placeholder="Entrez le nom du professeur"
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={newEvent.professor}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, professor: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Building2 className="w-4 h-4 mr-1" />
                      Salle
                    </label>
                    <input
                      type="text"
                      placeholder="Entrez le numéro de la salle"
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={newEvent.room}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, room: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className=" text-sm font-medium text-gray-700 mb-1">
                      Notes supplémentaires
                    </label>
                    <textarea
                      placeholder="Ajoutez des informations supplémentaires"
                      className="w-full p-2 border rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Heure de début
                      </label>
                      <input
                        type="datetime-local"
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={format(newEvent.start, "yyyy-MM-dd'T'HH:mm")}
                        onChange={(e) => {
                          const newStart = new Date(e.target.value);
                          setNewEvent(prev => ({
                            ...prev,
                            start: newStart,
                            end: addHours(newStart, 1)
                          }));
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Heure de fin
                      </label>
                      <input
                        type="datetime-local"
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={format(newEvent.end, "yyyy-MM-dd'T'HH:mm")}
                        onChange={(e) => {
                          const newEnd = new Date(e.target.value);
                          setNewEvent(prev => ({ ...prev, end: newEnd }));
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className=" text-sm font-medium text-gray-700 mb-2">
                      Couleur
                    </label>
                    <div className="flex gap-2">
                      {eventColors.map(color => (
                        <button
                          key={color.bg}
                          className={`w-8 h-8 rounded-full ${color.bg} ${color.hover} transition-transform hover:scale-110 ${newEvent.color === color.bg ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''}`}
                          onClick={() => setNewEvent(prev => ({ ...prev, color: color.bg }))}
                          title={color.label}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={handleCreateOrUpdateEvent}
                      className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                    >
                      {isEditMode ? (
                        <>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Mettre à jour
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Ajouter
                        </>
                      )}
                    </button>
                    {isEditMode && (
                      <button
                        onClick={() => handleDeleteEvent(selectedEvent!.id)}
                        className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DndContext>
  );
}

export default App;