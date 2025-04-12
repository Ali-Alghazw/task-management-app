import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';

export default function SettingsScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const uid = auth.currentUser.uid;

  useEffect(() => {
    const fetchUser = async () => {
      const docSnap = await getDoc(doc(db, 'users', uid));
      if (docSnap.exists()) {
        setUsername(docSnap.data().username || '');
      }
    };
    fetchUser();
  }, []);

  const handleUpdateUsername = async () => {
    try {
      await updateDoc(doc(db, 'users', uid), { username });
      Alert.alert('Success', 'Username updated!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const user = auth.currentUser;

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      Alert.alert('Success', 'Password updated!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Settings</Text>

      <Text style={styles.section}>Update Username</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        style={styles.input}
      />
      <Button title="Update Username" onPress={handleUpdateUsername} />

      <Text style={styles.section}>Update Password</Text>
      <TextInput
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder="Current Password"
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="New Password"
        secureTextEntry
        style={styles.input}
      />
      <Button title="Update Password" onPress={handleUpdatePassword} />

      <View style={{ marginTop: 30 }} />
      <Button title="Logout" color="red" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 30 },
  section: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
