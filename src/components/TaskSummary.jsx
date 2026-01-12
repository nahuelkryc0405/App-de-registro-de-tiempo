import React, { useState, useMemo } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { formatTime, formatDate, getWeekNumber } from '../utils/timeFormat'

export default function TaskSummary({ tasks }) {
  const [viewMode, setViewMode] = useState('daily') // daily or weekly

  const summaryData = useMemo(() => {
    if (viewMode === 'daily') {
      const dailyMap = {}

      tasks.forEach(task => {
        const date = formatDate(task.endTime)
        if (!dailyMap[date]) {
          dailyMap[date] = {
            date,
            timestamp: task.endTime,
            totalTime: 0,
            tasks: []
          }
        }
        dailyMap[date].totalTime += task.elapsedTime
        dailyMap[date].tasks.push(task)
      })

      return Object.values(dailyMap).sort((a, b) => b.timestamp - a.timestamp)
    } else {
      // Weekly view
      const weeklyMap = {}

      tasks.forEach(task => {
        const date = new Date(task.endTime)
        const weekNum = getWeekNumber(date)
        const year = date.getFullYear()
        const key = `${year}-W${weekNum}`

        if (!weeklyMap[key]) {
          // Get Monday of that week
          const monday = new Date(date)
          monday.setDate(date.getDate() - (date.getDay() || 7) + 1)

          weeklyMap[key] = {
            week: `Semana ${weekNum}, ${year}`,
            weekStart: formatDate(monday.getTime()),
            timestamp: monday.getTime(),
            totalTime: 0,
            tasks: []
          }
        }
        weeklyMap[key].totalTime += task.elapsedTime
        weeklyMap[key].tasks.push(task)
      })

      return Object.values(weeklyMap).sort((a, b) => b.timestamp - a.timestamp)
    }
  }, [tasks, viewMode])

  const totalAllTime = tasks.reduce((sum, task) => sum + task.elapsedTime, 0)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Resumen de Tiempo</Text>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'daily' && styles.toggleButtonActive]}
            onPress={() => setViewMode('daily')}
          >
            <Text style={[styles.toggleText, viewMode === 'daily' && styles.toggleTextActive]}>
              Diario
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'weekly' && styles.toggleButtonActive]}
            onPress={() => setViewMode('weekly')}
          >
            <Text style={[styles.toggleText, viewMode === 'weekly' && styles.toggleTextActive]}>
              Semanal
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Tiempo Total Registrado</Text>
        <Text style={styles.totalTime}>{formatTime(totalAllTime)}</Text>
        <Text style={styles.totalTasks}>
          {tasks.length} tarea{tasks.length !== 1 ? 's' : ''} completada{tasks.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {summaryData.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No hay datos para mostrar</Text>
          <Text style={styles.emptySubtext}>Completa algunas tareas para ver el resumen</Text>
        </View>
      ) : (
        <ScrollView style={styles.list}>
          {summaryData.map((period, index) => (
            <View key={index} style={styles.periodCard}>
              <View style={styles.periodHeader}>
                <Text style={styles.periodTitle}>
                  {viewMode === 'daily' ? period.date : period.week}
                </Text>
                <Text style={styles.periodTime}>{formatTime(period.totalTime)}</Text>
              </View>

              <Text style={styles.periodSubtitle}>
                {period.tasks.length} tarea{period.tasks.length !== 1 ? 's' : ''}
              </Text>

              <View style={styles.tasksList}>
                {period.tasks.map((task, taskIndex) => (
                  <View key={taskIndex} style={styles.taskItem}>
                    <Text style={styles.taskItemName} numberOfLines={1}>
                      • {task.name}
                    </Text>
                    <Text style={styles.taskItemTime}>{formatTime(task.elapsedTime)}</Text>
                  </View>
                ))}
              </View>
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
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#2196F3',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  toggleTextActive: {
    color: '#fff',
  },
  totalCard: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  totalLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  totalTime: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  totalTasks: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
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
  periodCard: {
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
  periodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  periodTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  periodTime: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    fontFamily: 'monospace',
  },
  periodSubtitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 12,
  },
  tasksList: {
    gap: 8,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  taskItemName: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 12,
  },
  taskItemTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    fontFamily: 'monospace',
  },
})
