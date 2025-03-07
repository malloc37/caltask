import { useState, useEffect } from 'react'
import TaskList from './components/TaskList'
import Calendar from './components/Calendar'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'

interface Task {
  id: string
  title: string
  description?: string
  category: 'Personal' | 'Uni' | 'Work' | 'Backlog'
  color?: string
  dueDate?: Date | null
  duration?: number
  priority: 'low' | 'medium' | 'high'
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark'
    }
    return false
  })

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Caltask
          </h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <SunIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex h-[calc(100vh-12rem)]">
          {/* Task List Sidebar */}
          <div className="w-80 bg-white dark:bg-gray-800 shadow rounded-lg mr-4 overflow-hidden">
            <TaskList tasks={tasks} setTasks={setTasks} />
          </div>

          {/* Calendar View */}
          <div className="flex-1 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <Calendar tasks={tasks} setTasks={setTasks} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
