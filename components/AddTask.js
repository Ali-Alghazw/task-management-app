import React, { useEffect, useState } from 'react';
import {
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addTask } from '../taskService';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

export default function AddTask() {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  const taskToEdit = route.params?.taskToEdit;

  const handleAdd = async () => {
    if (!title.trim()) return;

    const uid = auth.currentUser.uid;

    const taskData = {
      title,
      deadline: deadline.toISOString(),
      completed: taskToEdit?.completed ?? false,
      createdAt: taskToEdit?.createdAt ?? new Date().toISOString(),
    };

    if (taskToEdit) {
      // Edit existing task
      const taskRef = doc(db, 'users', uid, 'tasks', taskToEdit.id);
      await updateDoc(taskRef, taskData);
    } else {
      // Add new task
      await addTask(taskData);
    }

    navigation.goBack();
  };
  useEffect(() => {
    console.log('Editing task:', taskToEdit);
  }, []);
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDeadline(new Date(taskToEdit.deadline));
    }
  }, [taskToEdit]);

  return (
    <>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        placeholder="Task title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <Text style={styles.label}>Select Deadline:</Text>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={styles.input}
      >
        <Text>{deadline.toDateString()}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={deadline}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(e, selectedDate) => {
            const current = selectedDate || deadline;
            setShowPicker(false);
            setDeadline(current);
          }}
        />
      )}

      <Button
        title={taskToEdit ? 'Update Task' : 'Add Task'}
        onPress={handleAdd}
      />
    </>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 10 },
  label: { fontWeight: 'bold', paddingVertical: 5 },
});
