const STORAGE_KEY = 'time_tracker_tasks'

export const loadTasks = () => {
  try {
    const storedTasks = localStorage.getItem(STORAGE_KEY)
    return storedTasks ? JSON.parse(storedTasks) : []
  } catch (error) {
    console.error('Error loading tasks:', error)
    return []
  }
}

export const saveTasks = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch (error) {
    console.error('Error saving tasks:', error)
  }
}

export const clearAllTasks = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing tasks:', error)
  }
}
