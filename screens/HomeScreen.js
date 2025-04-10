import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { logout } from '../authService';
import { getTasks, updateTask, deleteTask } from '../taskService';
import { auth, db } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const navigation = useNavigation();
  const [username, setUsername] = useState('');

  const loadTasks = async () => {
    const fetched = await getTasks();
    setTasks(fetched);
  };
  useEffect(() => {
    const loadUsername = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUsername(docSnap.data().username);
      }
    };

    loadUsername();
  }, []);
  useEffect(() => {
    loadTasks();
  }, [tasks]);

  const handleToggle = async (task) => {
    await updateTask(task.id, { completed: !task.completed });
    loadTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    loadTasks();
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Task Manager</Text>
      <Text style={styles.welcome}>
        Welcome back, {username || auth.currentUser.email}!
      </Text>

      <Button
        title="➕ Add Task"
        onPress={() => navigation.navigate('AddTask')}
      />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <View style={styles.task}>
            <TouchableOpacity onPress={() => handleToggle(item)}>
              <Text
                style={item.completed ? styles.completed : styles.incomplete}
              >
                {item.title} ({new Date(item.deadline).toDateString()})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.delete}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={{ marginTop: 30 }}>
        <Button title="Logout" onPress={logout} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  welcome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
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
});
