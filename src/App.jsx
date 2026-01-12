import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import TaskTracker from './components/TaskTracker'
import TaskHistory from './components/TaskHistory'
import TaskSummary from './components/TaskSummary'
import { loadTasks, saveTasks } from './utils/storage'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [currentTask, setCurrentTask] = useState(null)
  const [activeTab, setActiveTab] = useState('tracker') // tracker, history, summary

  useEffect(() => {
    const loadedTasks = loadTasks()
    setTasks(loadedTasks)

    // Check if there's a task in progress
    const inProgressTask = loadedTasks.find(task => task.status === 'running' || task.status === 'paused')
    if (inProgressTask) {
      setCurrentTask(inProgressTask)
    }
  }, [])

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const addTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      name: taskData.name,
      startTime: Date.now(),
      endTime: null,
      elapsedTime: 0,
      status: 'running', // running, paused, completed
      pausedAt: null,
      createdAt: Date.now()
    }
    setTasks([...tasks, newTask])
    setCurrentTask(newTask)
  }

  const updateTask = (taskId, updates) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ))

    if (currentTask && currentTask.id === taskId) {
      setCurrentTask({ ...currentTask, ...updates })
    }
  }

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
    if (currentTask && currentTask.id === taskId) {
      setCurrentTask(null)
    }
  }

  const pauseTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (task && task.status === 'running') {
      const now = Date.now()
      const elapsed = task.elapsedTime + (now - task.startTime)
      updateTask(taskId, {
        status: 'paused',
        pausedAt: now,
        elapsedTime: elapsed
      })
    }
  }

  const resumeTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (task && task.status === 'paused') {
      updateTask(taskId, {
        status: 'running',
        startTime: Date.now(),
        pausedAt: null
      })
    }
  }

  const completeTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      const now = Date.now()
      let totalElapsed = task.elapsedTime

      if (task.status === 'running') {
        totalElapsed += now - task.startTime
      }

      updateTask(taskId, {
        status: 'completed',
        endTime: now,
        elapsedTime: totalElapsed
      })

      setCurrentTask(null)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <View
          style={[styles.tab, activeTab === 'tracker' && styles.activeTab]}
          onTouchEnd={() => setActiveTab('tracker')}
        >
          <View style={styles.tabButton}>
            <View style={styles.tabText}>Registro</View>
          </View>
        </View>
        <View
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onTouchEnd={() => setActiveTab('history')}
        >
          <View style={styles.tabButton}>
            <View style={styles.tabText}>Historial</View>
          </View>
        </View>
        <View
          style={[styles.tab, activeTab === 'summary' && styles.activeTab]}
          onTouchEnd={() => setActiveTab('summary')}
        >
          <View style={styles.tabButton}>
            <View style={styles.tabText}>Resumen</View>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {activeTab === 'tracker' && (
          <TaskTracker
            currentTask={currentTask}
            onAddTask={addTask}
            onPauseTask={pauseTask}
            onResumeTask={resumeTask}
            onCompleteTask={completeTask}
          />
        )}
        {activeTab === 'history' && (
          <TaskHistory
            tasks={tasks.filter(t => t.status === 'completed')}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        )}
        {activeTab === 'summary' && (
          <TaskSummary tasks={tasks.filter(t => t.status === 'completed')} />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    maxWidth: 800,
    marginHorizontal: 'auto',
    width: '100%',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    cursor: 'pointer',
  },
  activeTab: {
    borderBottomColor: '#2196F3',
  },
  tabButton: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
  },
})
