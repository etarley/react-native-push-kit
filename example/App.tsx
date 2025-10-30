import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, StyleSheet, Button } from 'react-native';
import {
  addTokenListener,
  addPayloadListener,
  addErrorListener,
  register,
  type TokenPayload,
  type PayloadPayload,
  type ErrorPayload, 
} from 'react-native-pushkit';

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [payload, setPayload] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);  
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  

  useEffect(() => {
    // Listen for new PushKit tokens
    const tokenSubscription = addTokenListener((event: TokenPayload) => {
      console.log('Received PushKit Token:', event.token);
      setToken(event.token);
      setError(null); // Clear previous errors on success
    });

    // Listen for incoming PushKit payloads
    const payloadSubscription = addPayloadListener((event: PayloadPayload) => {
      console.log('Received PushKit Payload:', event.payload);
      setPayload(event.payload);
    });

    // Listen for registration errors
    const errorSubscription = addErrorListener((event: ErrorPayload) => {
      console.error('PushKit Registration Error:', event.error);
      setError(event.error);
    });

    // Clean up listeners when the component unmounts
    return () => {
      tokenSubscription.remove();
      payloadSubscription.remove();
      errorSubscription.remove(); 
    };
  }, []);

  const handleRegister = async () => {
    try {
      // Register for VoIP pushes when the button is pressed.
      await register(['voip']);
      setIsRegistered(true);
      console.log('Successfully registered for VoIP pushes.');
    } catch (e: any) {
      setError(e.message);
    }
  };  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>React Native PushKit</Text>
        
        {error && (
          <Group name="Error">
            <Text style={[styles.text, { color: 'red' }]}>{error}</Text>
          </Group>
        )}
        
        <Group name="PushKit Token">
          <Text style={styles.text} selectable>{token ?? 'Waiting for token...'}</Text>
        </Group>
        
        <Group name="Last Received Payload">
          <Text style={styles.text}>{payload ? JSON.stringify(payload, null, 2) : 'No payload received yet.'}</Text>
        </Group>

        <Group name="Is Registered">
          <Text style={styles.text}>{isRegistered ? 'Yes' : 'No'}</Text>
        </Group>

        <Button title="Register" onPress={handleRegister} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f7',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#1c1c1e',
  },
  group: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  groupHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  text: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'Menlo',
    lineHeight: 20,
  }
});