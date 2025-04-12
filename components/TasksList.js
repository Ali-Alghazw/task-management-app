import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { getTasks, updateTask, deleteTask } from '../taskService';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function TasksList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const loadTasks = async () => {
    //fetching the tasks
    try {
      setLoading(true);
      const fetched = await getTasks();
      setTasks(fetched);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (task) => {
    await updateTask(task.id, { completed: !task.completed });
    loadTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    loadTasks();
  };

  const handleEditTask = (task) => {
    navigation.navigate('AddTask', { taskToEdit: task });
  };

  useFocusEffect(
    //To rerender the tasks to display the new and updated tasks
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        await loadTasks();
        setLoading(false);
      };

      fetchData();
    }, [])
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      style={{ marginTop: 20 }}
      renderItem={({ item }) => (
        <View style={styles.task}>
          <TouchableOpacity onPress={() => handleToggle(item)}>
            <Text style={item.completed ? styles.completed : styles.incomplete}>
              {item.title}
            </Text>
            <Text style={item.completed ? styles.completed : styles.incomplete}>
              Deadline : {new Date(item.deadline).toDateString()}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleEditTask(item)}>
            <Text style={styles.edit}>📝</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Text style={styles.delete}>🗑️</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  task: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  completed: { textDecorationLine: 'line-through', color: 'gray' },
  incomplete: { color: '#000' },
  delete: { fontSize: 18 },
  edit: { fontSize: 18, right: -50 },
});
