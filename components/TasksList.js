import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { getTasks, updateTask, deleteTask } from '../taskService';
import { useNavigation } from '@react-navigation/native';

export default function TasksList() {
  const [tasks, setTasks] = useState([]);
  const navigation = useNavigation();

  const loadTasks = async () => {
    const fetched = await getTasks();
    setTasks(fetched);
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
  useEffect(() => {
    loadTasks();
  }, [tasks]);
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
          <TouchableOpacity onPress={() => handleDelete(item)}>
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
