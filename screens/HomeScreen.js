import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { auth, db } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import TasksList from '../components/TasksList';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={{ marginRight: 15, fontSize: 16, color: 'blue' }}>
            ⚙️
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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

      <TasksList />
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
});
