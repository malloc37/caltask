import { useEffect, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'
import { EventInput } from '@fullcalendar/core'
import { FireIcon } from '@heroicons/react/24/outline'

interface Task {
  id: string
  title: string
  description?: string
  category: 'Personal' | 'Uni' | 'Work' | 'Backlog'
  color?: string
  dueDate?: Date | null
  duration?: number
  isPriority: boolean
  isAllDay: boolean
}

interface CalendarProps {
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
}

const Calendar = ({ tasks, setTasks }: CalendarProps) => {
  const calendarRef = useRef<FullCalendar>(null)

  const events: EventInput[] = tasks
    .filter(task => task.dueDate)
    .map(task => ({
      id: task.id,
      title: task.title,
      start: task.dueDate!.toISOString(),
      allDay: task.isAllDay,
      duration: !task.isAllDay && task.duration ? `${task.duration}:00` : undefined,
      backgroundColor: task.color || '#3B82F6',
      borderColor: task.color || '#3B82F6',
      extendedProps: {
        description: task.description,
        category: task.category,
        isPriority: task.isPriority,
      },
    }))

  const handleEventDrop = (info: any) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === info.event.id) {
        return {
          ...task,
          dueDate: info.event.start,
          isAllDay: info.event.allDay,
        }
      }
      return task
    })
    setTasks(updatedTasks)
  }

  const handleEventResize = (info: any) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === info.event.id) {
        const duration = Math.round(
          (info.event.end.getTime() - info.event.start.getTime()) / (1000 * 60 * 60)
        )
        return {
          ...task,
          dueDate: info.event.start,
          duration,
          isAllDay: info.event.allDay,
        }
      }
      return task
    })
    setTasks(updatedTasks)
  }

  const handleDateClick = (info: any) => {
    const clickedDate = info.date
    console.log('Clicked date:', clickedDate)
  }

  const handleEventClick = (info: any) => {
    const task = tasks.find(t => t.id === info.event.id)
    if (task) {
      console.log('Clicked task:', task)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Calendar
        </h2>
      </div>

      <div className="flex-1 p-4">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale="de"
          firstDay={1}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={events}
          editable={true}
          droppable={true}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="100%"
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
          allDaySlot={true}
          allDayText="All Day"
          expandRows={true}
          stickyHeaderDates={true}
          dayMaxEvents={true}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }}
          nowIndicator={true}
          scrollTime="08:00:00"
          slotDuration="00:30:00"
          eventContent={(arg) => (
            <div className="p-1">
              <div className="flex items-center gap-1">
                <div className="font-medium">{arg.event.title}</div>
                {arg.event.extendedProps.isPriority && (
                  <FireIcon className="h-4 w-4 text-red-500" />
                )}
              </div>
              {arg.event.extendedProps.category && (
                <div className="text-xs opacity-75">{arg.event.extendedProps.category}</div>
              )}
            </div>
          )}
          dayHeaderFormat={{
            weekday: 'short',
            day: 'numeric',
            month: 'numeric',
            omitCommas: true,
          }}
        />
      </div>
    </div>
  )
}

export default Calendar 