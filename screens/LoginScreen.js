import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import YTLogo from '../assets/YTLogo.png';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <View style={styles.container}>
      <Image source={YTLogo} style={styles.image} />
      <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>

      {isLogin ? <LoginForm /> : <RegisterForm />}
      <Text
        style={styles.toggle}
        onPress={() => {
          setIsLogin(!isLogin);
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
  toggle: { color: 'blue', textAlign: 'center', marginTop: 15 },
  image: { width: '100%', height: '40%' },
});
