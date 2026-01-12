import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { formatTime, formatDateTime } from '../utils/timeFormat'

export default function TaskHistory({ tasks, onUpdateTask, onDeleteTask }) {
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editTime, setEditTime] = useState('')

  const handleEdit = (task) => {
    setEditingId(task.id)
    setEditName(task.name)
    // Convert milliseconds to HH:MM:SS format for editing
    const totalSeconds = Math.floor(task.elapsedTime / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    setEditTime(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`)
  }

  const handleSave = (taskId) => {
    // Parse time format HH:MM:SS back to milliseconds
    const timeParts = editTime.split(':')
    if (timeParts.length === 3) {
      const hours = parseInt(timeParts[0]) || 0
      const minutes = parseInt(timeParts[1]) || 0
      const seconds = parseInt(timeParts[2]) || 0
      const totalMs = (hours * 3600 + minutes * 60 + seconds) * 1000

      onUpdateTask(taskId, {
        name: editName,
        elapsedTime: totalMs
      })
    }

    setEditingId(null)
    setEditName('')
    setEditTime('')
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditName('')
    setEditTime('')
  }

  const sortedTasks = [...tasks].sort((a, b) => b.endTime - a.endTime)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historial de Tareas</Text>
        <Text style={styles.subtitle}>
          {tasks.length} tarea{tasks.length !== 1 ? 's' : ''} completada{tasks.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No hay tareas completadas aún</Text>
          <Text style={styles.emptySubtext}>Las tareas que completes aparecerán aquí</Text>
        </View>
      ) : (
        <ScrollView style={styles.list}>
          {sortedTasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              {editingId === task.id ? (
                <View style={styles.editForm}>
                  <Text style={styles.editLabel}>Nombre:</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editName}
                    onChangeText={setEditName}
                    placeholder="Nombre de la tarea"
                  />

                  <Text style={styles.editLabel}>Tiempo (HH:MM:SS):</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editTime}
                    onChangeText={setEditTime}
                    placeholder="00:00:00"
                  />

                  <View style={styles.editButtons}>
                    <TouchableOpacity
                      style={[styles.editButton, styles.cancelButton]}
                      onPress={handleCancel}
                    >
                      <Text style={styles.editButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.editButton, styles.saveButton]}
                      onPress={() => handleSave(task.id)}
                    >
                      <Text style={styles.editButtonText}>Guardar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <>
                  <View style={styles.taskHeader}>
                    <Text style={styles.taskName}>{task.name}</Text>
                    <Text style={styles.taskTime}>{formatTime(task.elapsedTime)}</Text>
                  </View>

                  <Text style={styles.taskDate}>{formatDateTime(task.endTime)}</Text>

                  <View style={styles.taskActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.editActionButton]}
                      onPress={() => handleEdit(task)}
                    >
                      <Text style={styles.actionButtonText}>✏ Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => {
                        if (confirm('¿Estás seguro de eliminar esta tarea?')) {
                          onDeleteTask(task.id)
                        }
                      }}
                    >
                      <Text style={styles.actionButtonText}>🗑 Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
  },
  list: {
    flex: 1,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  taskTime: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    fontFamily: 'monospace',
  },
  taskDate: {
    fontSize: 13,
    color: '#999',
    marginBottom: 12,
  },
  taskActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  editActionButton: {
    backgroundColor: '#FF9800',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  editForm: {
    gap: 12,
  },
  editLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  editInput: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    outlineStyle: 'none',
  },
  editButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  editButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
})
