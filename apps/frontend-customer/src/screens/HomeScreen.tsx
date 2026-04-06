import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

const HomeScreen = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchBackendData = async () => {
    setLoading(true);
    try {
      const idToken = await user?.getIdToken();
      const response = await fetch('http://localhost:3000/protected', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error(error);
      setData({ error: 'Failed to fetch from backend' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.email}>{user?.email}</Text>
      
      <TouchableOpacity style={styles.backendButton} onPress={fetchBackendData}>
        <Text style={styles.buttonText}>Fetch Protected Data from Backend</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
      
      {data && (
        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>{JSON.stringify(data, null, 2)}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.signOutButton} onPress={() => signOut(auth)}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  backendButton: {
    backgroundColor: '#5856D6',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dataContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#eee',
    borderRadius: 8,
    width: '100%',
  },
  dataText: {
    fontFamily: 'monospace',
  }
});

export default HomeScreen;
