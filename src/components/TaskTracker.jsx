import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { formatTime } from '../utils/timeFormat'

export default function TaskTracker({ currentTask, onAddTask, onPauseTask, onResumeTask, onCompleteTask }) {
  const [taskName, setTaskName] = useState('')
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    let interval
    if (currentTask && currentTask.status === 'running') {
      interval = setInterval(() => {
        const elapsed = currentTask.elapsedTime + (Date.now() - currentTask.startTime)
        setCurrentTime(elapsed)
      }, 100)
    } else if (currentTask && currentTask.status === 'paused') {
      setCurrentTime(currentTask.elapsedTime)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [currentTask])

  const handleStartTask = () => {
    if (taskName.trim()) {
      onAddTask({ name: taskName })
      setTaskName('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && taskName.trim() && !currentTask) {
      handleStartTask()
    }
  }

  return (
    <View style={styles.container}>
      {!currentTask ? (
        <View style={styles.startSection}>
          <Text style={styles.title}>Nueva Tarea</Text>
          <Text style={styles.subtitle}>Escribe el nombre de la tarea y comienza a registrar tiempo</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre de la tarea..."
            value={taskName}
            onChangeText={setTaskName}
            onKeyPress={handleKeyPress}
            placeholderTextColor="#999"
          />

          <TouchableOpacity
            style={[styles.button, styles.startButton, !taskName.trim() && styles.buttonDisabled]}
            onPress={handleStartTask}
            disabled={!taskName.trim()}
          >
            <Text style={styles.buttonText}>Iniciar Tarea</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.activeSection}>
          <View style={styles.taskCard}>
            <Text style={styles.activeLabel}>TAREA ACTIVA</Text>
            <Text style={styles.taskName}>{currentTask.name}</Text>

            <View style={styles.timerContainer}>
              <Text style={styles.timer}>{formatTime(currentTime)}</Text>
              <View style={[styles.statusIndicator, currentTask.status === 'paused' && styles.statusPaused]} />
            </View>

            <Text style={styles.statusText}>
              {currentTask.status === 'running' ? 'En progreso' : 'En pausa'}
            </Text>

            <View style={styles.buttonGroup}>
              {currentTask.status === 'running' ? (
                <TouchableOpacity
                  style={[styles.button, styles.pauseButton]}
                  onPress={() => onPauseTask(currentTask.id)}
                >
                  <Text style={styles.buttonText}>⏸ Pausar</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.button, styles.resumeButton]}
                  onPress={() => onResumeTask(currentTask.id)}
                >
                  <Text style={styles.buttonText}>▶ Reanudar</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.button, styles.completeButton]}
                onPress={() => onCompleteTask(currentTask.id)}
              >
                <Text style={styles.buttonText}>✓ Completar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  startSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fafafa',
    outlineStyle: 'none',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  activeSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  activeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2196F3',
    letterSpacing: 1,
    marginBottom: 12,
  },
  taskName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2196F3',
    fontFamily: 'monospace',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    marginLeft: 12,
  },
  statusPaused: {
    backgroundColor: '#FF9800',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  pauseButton: {
    flex: 1,
    backgroundColor: '#FF9800',
  },
  resumeButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  completeButton: {
    flex: 1,
    backgroundColor: '#2196F3',
  },
})
