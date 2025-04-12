import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AddTask from '../components/AddTask';

export default function AddTaskScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Task</Text>
      <AddTask />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
});
