import { useState } from 'react'
import { PlusIcon, FunnelIcon, FireIcon } from '@heroicons/react/24/outline'

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

interface TaskListProps {
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
}

const categoryColors = {
  Personal: '#3B82F6', // blue
  Uni: '#10B981', // green
  Work: '#F59E0B', // yellow
  Backlog: '#6B7280', // gray
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const TaskList = ({ tasks, setTasks }: TaskListProps) => {
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    category: 'Personal',
    isPriority: false,
    isAllDay: false,
    dueDate: new Date(), // Set default to today
  })
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<'all' | Task['category']>('all')

  const filteredTasks = selectedCategory === 'all' 
    ? tasks 
    : tasks.filter(task => task.category === selectedCategory)

  // Sort tasks by priority first, then by date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // First sort by priority
    if (a.isPriority && !b.isPriority) return -1
    if (!a.isPriority && b.isPriority) return 1

    // Then sort by due date if both tasks have one
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }
    // Tasks with due dates come before tasks without
    if (a.dueDate) return -1
    if (b.dueDate) return 1
    
    // Finally, sort by title
    return a.title.localeCompare(b.title)
  })

  const handleAddTask = () => {
    if (!newTask.title) return

    const task: Task = {
      id: crypto.randomUUID(),
      title: newTask.title,
      description: newTask.description || '',
      category: newTask.category || 'Personal',
      color: categoryColors[newTask.category || 'Personal'],
      dueDate: newTask.dueDate || null,
      duration: newTask.duration,
      isPriority: newTask.isPriority || false,
      isAllDay: newTask.isAllDay || false,
    }

    setTasks([...tasks, task])
    setNewTask({
      title: '',
      category: 'Personal',
      isPriority: false,
      isAllDay: false,
      dueDate: new Date(),
    })
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ))
    setIsModalOpen(false)
    setSelectedTask(null)
  }

  const handleSetToday = (task: Task) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to midnight for all-day events
    handleUpdateTask({ 
      ...task, 
      dueDate: today,
      isAllDay: true, // Always set as all-day event
      duration: undefined // Remove duration for all-day events
    })
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tasks
          </h2>
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as 'all' | Task['category'])}
              className="text-sm rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="all">All Categories</option>
              <option value="Personal">Personal</option>
              <option value="Uni">University</option>
              <option value="Work">Work</option>
              <option value="Backlog">Backlog</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {sortedTasks.map(task => (
          <div
            key={task.id}
            className="mb-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleEditTask(task)}
            style={{ borderLeft: `4px solid ${categoryColors[task.category]}` }}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {task.title}
                  </h3>
                  {task.isPriority && (
                    <FireIcon className="h-4 w-4 text-red-500" title="Priority Task" />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {task.category}
                  </span>
                  {task.dueDate && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      • {formatDate(new Date(task.dueDate))}
                      {!task.isAllDay && task.duration && ` (${task.duration}h)`}
                      {task.isAllDay && ' (All day)'}
                    </span>
                  )}
                </div>
                {task.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteTask(task.id)
                }}
                className="text-gray-400 hover:text-red-500"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Add new task..."
              className="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 px-4"
            />
            <button
              onClick={handleAddTask}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
          <select
            value={newTask.category}
            onChange={(e) => setNewTask({ ...newTask, category: e.target.value as Task['category'] })}
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="Personal">Personal</option>
            <option value="Uni">University</option>
            <option value="Work">Work</option>
            <option value="Backlog">Backlog</option>
          </select>
        </div>
      </div>

      {/* Task Details Modal */}
      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Task
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setSelectedTask(null)
                }}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={selectedTask.title}
                  onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={selectedTask.description || ''}
                  onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                  rows={3}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Add task description..."
                />
              </div>

              {/* Category and Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={selectedTask.category}
                    onChange={(e) => setSelectedTask({
                      ...selectedTask,
                      category: e.target.value as Task['category'],
                      color: categoryColors[e.target.value as Task['category']]
                    })}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Uni">University</option>
                    <option value="Work">Work</option>
                    <option value="Backlog">Backlog</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <button
                    onClick={() => setSelectedTask({
                      ...selectedTask,
                      isPriority: !selectedTask.isPriority
                    })}
                    className={`flex items-center justify-center px-3 py-1.5 rounded-md border text-sm ${
                      selectedTask.isPriority
                        ? 'bg-red-50 border-red-500 text-red-700 hover:bg-red-100'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FireIcon className={`h-4 w-4 ${selectedTask.isPriority ? 'text-red-500' : 'text-gray-400'}`} />
                    <span className="ml-1.5">{selectedTask.isPriority ? 'Priority' : 'Not Priority'}</span>
                  </button>
                </div>
              </div>

              {/* Due Date and Duration */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="date"
                      value={selectedTask.dueDate ? new Date(selectedTask.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        const date = e.target.value;
                        const time = selectedTask.dueDate && !selectedTask.isAllDay
                          ? new Date(selectedTask.dueDate).toTimeString().split(' ')[0]
                          : '09:00';
                        setSelectedTask({
                          ...selectedTask,
                          dueDate: date ? new Date(`${date}T${time}`) : null
                        });
                      }}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                    <button
                      onClick={() => setSelectedTask({
                        ...selectedTask,
                        isAllDay: !selectedTask.isAllDay,
                        duration: selectedTask.isAllDay ? 1 : undefined
                      })}
                      className={`px-3 py-1.5 rounded-md border text-sm ${
                        selectedTask.isAllDay
                          ? 'bg-blue-50 border-blue-500 text-blue-700 hover:bg-blue-100'
                          : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      All Day
                    </button>
                  </div>
                </div>

                {!selectedTask.isAllDay && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        value={selectedTask.dueDate ? new Date(selectedTask.dueDate).toTimeString().slice(0, 5) : '09:00'}
                        onChange={(e) => {
                          const time = e.target.value;
                          const date = selectedTask.dueDate 
                            ? new Date(selectedTask.dueDate).toISOString().split('T')[0]
                            : new Date().toISOString().split('T')[0];
                          setSelectedTask({
                            ...selectedTask,
                            dueDate: time ? new Date(`${date}T${time}`) : null
                          });
                        }}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Duration (hours)
                      </label>
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={selectedTask.duration || '1'}
                        onChange={(e) => setSelectedTask({
                          ...selectedTask,
                          duration: parseFloat(e.target.value) || 1
                        })}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-6">
                <button
                  onClick={() => handleSetToday(selectedTask)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Set to Today
                </button>
                <div className="space-x-3">
                  <button
                    onClick={() => {
                      setIsModalOpen(false)
                      setSelectedTask(null)
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateTask(selectedTask)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskList 