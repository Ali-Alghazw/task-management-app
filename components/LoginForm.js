import { login } from '../authService';
import React, { useState } from 'react';
import { TextInput, Button, StyleSheet } from 'react-native';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
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

      <Button title="Login" onPress={handleLogin} />
    </>
  );
}
const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
});
