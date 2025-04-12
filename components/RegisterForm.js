import { register } from '../authService';
import React, { useState } from 'react';
import { TextInput, Button, StyleSheet } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !username) return;
    try {
      const userCredential = await register(email, password);
      const uid = userCredential.user.uid;
      await setDoc(doc(db, 'users', uid), {
        username,
        email,
      });
    } catch (error) {
      alert(error.message);
      console.log('Register Error:', error);
    }
  };

  return (
    <>
      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Register" onPress={handleRegister} />
    </>
  );
}
const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
});
