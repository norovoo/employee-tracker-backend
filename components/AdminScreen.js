import React, { useState } from 'react';
import { View, TextInput, Text, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

const AdminLogin = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill out both email and password fields');
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await axios.post(`${config.BASE_URL}/api/auth/login`, { email, password });
      const { token, role } = response.data;

      if (token && role === 'admin') {
        await AsyncStorage.setItem('authToken', token); // Save token to AsyncStorage
        await AsyncStorage.setItem('userRole', role); // Save role to AsyncStorage
        Alert.alert('Success', 'Admin login successful!');
        navigation.replace('AdminDashboard'); // Navigate to Admin dashboard
      } else {
        Alert.alert('Login Failed', 'Only admin users can access this dashboard.');
      }
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid credentials or server issue');
      console.error('Login error:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={(text) => setEmail(text)}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#6200EE" />
      ) : (
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
        <Text style={styles.createNewUser}>Create a new admin</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: '100%',
    backgroundColor: '#fff',
  },
  loginButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  createNewUser: {
    marginTop: 10,
    fontSize: 14,
    color: '#6200EE',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default AdminLogin;