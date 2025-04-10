import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Image } from 'react-native';
import { login, register } from '../authService';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // make sure this is imported
import { useNavigation } from '@react-navigation/native'; // if not yet imported
import YTLogo from '../assets/YTLogo.png';
export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      alert(error.message);
    }
  };
  const handleRegister = async () => {
    if (!email || !password || !username) return;

    try {
      const userCredential = await register(email, password);
      const uid = userCredential.user.uid;
      console.log('UID11111:', uid);
      console.log('Saving username:', username);

      // Save username to Firestore
      await setDoc(doc(db, 'users', uid), {
        username,
        email,
      });
      navigation.navigate('Home');
    } catch (error) {
      alert(error.message);
      console.log('Register Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={YTLogo} style={{ width: '100%', height: '40%' }} />
      <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>
      {!isLogin && (
        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
      )}
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
      {isLogin ? (
        <Button title="Login" onPress={handleLogin} />
      ) : (
        <Button title="Register" onPress={handleRegister} />
      )}
      <Text
        style={styles.toggle}
        onPress={() => {
          setIsLogin(!isLogin);
          setEmail('');
          setPassword('');
          setUsername('');
        }}
      >
        {isLogin ? 'No account? Register' : 'Have an account? Login'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    marginTop: -100,
  },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
  toggle: { color: 'blue', textAlign: 'center', marginTop: 15 },
});
