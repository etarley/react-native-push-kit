---

# React Native PushKit

[![NPM Version](https://img.shields.io/npm/v/react-native-pushkit.svg)](https://www.npmjs.com/package/react-native-pushkit)
[![License](https://img.shields.io/npm/l/react-native-pushkit.svg)](https://github.com/etarley/react-native-pushkit/blob/main/LICENSE)

A React Native library for handling Apple's PushKit VoIP notifications, built with the modern Expo Modules API.

This module provides a simple and type-safe way to receive PushKit tokens and incoming VoIP push payloads in your React Native or Expo application.

## Features

-   ✅ **Modern API:** Built with the latest Expo Modules API.
-   ✅ **Fully Typed:** Written in TypeScript for a great developer experience.
-   ✅ **Event-Driven:** Use simple listeners to subscribe to PushKit events.
-   ✅ **Automatic Setup:** Expo Autolinking handles the native module integration.
-   ✅ **Robust Error Handling:** Receive events when PushKit registration fails.

## Platform Support

| iOS | Android |
| --- | ------- |
| ✅  | ❌      |

PushKit is an Apple-specific framework and is only available on iOS.

## Installation

This library requires `expo-notifications` as a peer dependency.

```bash
npm install react-native-pushkit expo-notifications
```

Or if you use Yarn:

```bash
yarn add react-native-pushkit expo-notifications
```

## Native Configuration (Required)

After installing the package, you need to configure background remote notifications in your `app.json` or `app.config.js` using the `expo-notifications` config plugin:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "enableBackgroundRemoteNotifications": true
        }
      ]
    ]
  }
}
```

> **Note:** This configuration is required for PushKit to work. The `expo-notifications` plugin automatically handles the necessary iOS capabilities and background modes.

## API Usage

The library is event-based. You can add listeners to subscribe to token updates, incoming payloads, and errors.

Here is a complete example of how to use the library in a React component.

```tsx
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet } from 'react-native';
import {
  addTokenListener,
  addPayloadListener,
  addErrorListener,
  type TokenPayload,
  type PayloadPayload,
  type ErrorPayload,
} from 'react-native-pushkit';

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [lastPayload, setLastPayload] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This listener is called when the app receives a new PushKit token.
    // You should send this token to your server to send VoIP pushes.
    const tokenSubscription = addTokenListener((event: TokenPayload) => {
      console.log('Received PushKit Token:', event.token);
      setToken(event.token);
      setError(null); // Clear previous errors on success.
    });

    // This listener is called when a new PushKit payload is received.
    const payloadSubscription = addPayloadListener((event: PayloadPayload) => {
      console.log('Received PushKit Payload:', event.payload);
      setLastPayload(event.payload);
      // Here you would typically trigger your incoming call UI.
    });

    // This listener is called if PushKit fails to register.
    const errorSubscription = addErrorListener((event: ErrorPayload) => {
      console.error('PushKit Registration Error:', event.error);
      setError(event.error);
    });

    // Don't forget to remove the listeners when the component unmounts.
    return () => {
      tokenSubscription.remove();
      payloadSubscription.remove();
      errorSubscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {error && <Text style={styles.errorText}>Error: {error}</Text>}
      <Text style={styles.title}>PushKit Token</Text>
      <Text style={styles.token} selectable>
        {token ?? 'Waiting for token...'}
      </Text>

      <Text style={styles.title}>Last Received Payload</Text>
      <Text style={styles.payload}>
        {lastPayload ? JSON.stringify(lastPayload, null, 2) : 'No payload received yet.'}
      </Text>
    </SafeAreaView>
  );
}

// Add your styles here...
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  errorText: { color: 'red', marginBottom: 10 },
  token: { fontFamily: 'Menlo', marginTop: 10, backgroundColor: '#fff', padding: 10, borderRadius: 5 },
  payload: { fontFamily: 'Menlo', marginTop: 10, backgroundColor: '#fff', padding: 10, borderRadius: 5 },
});
```

## API Reference

### Functions

#### `addTokenListener(listener)`

Adds a listener that will be called when a new PushKit token is registered.

-   **`listener: (event: TokenPayload) => void`**: The function to execute.
-   **Returns:** `EventSubscription` - An object with a `remove()` method to unsubscribe.

#### `addPayloadListener(listener)`

Adds a listener that will be called when a new PushKit payload is received.

-   **`listener: (event: PayloadPayload) => void`**: The function to execute.
-   **Returns:** `EventSubscription` - An object with a `remove()` method to unsubscribe.

#### `addInvalidateTokenListener(listener)`

Adds a listener that will be called when the PushKit token is invalidated by the system.

-   **`listener: (event: InvalidateTokenPayload) => void`**: The function to execute.
-   **Returns:** `EventSubscription` - An object with a `remove()` method to unsubscribe.

#### `addErrorListener(listener)`

Adds a listener that will be called if PushKit fails to register for pushes.

-   **`listener: (event: ErrorPayload) => void`**: The function to execute.
-   **Returns:** `EventSubscription` - An object with a `remove()` method to unsubscribe.

### Types

```ts
// The payload for the onToken event.
export type TokenPayload = {
  token: string;
};

// The payload for the onPayload event.
export type PayloadPayload = {
  payload: Record<string, any>;
};

// The payload for the onInvalidateToken event.
export type InvalidateTokenPayload = {
  type: string; // e.g., 'voip'
};

// The payload for the onError event.
export type ErrorPayload = {
  error: string;
};
```

## Running the Example App

To run the example app:

1.  Clone the repository.
2.  Navigate to the `example` directory: `cd example`
3.  Install dependencies: `npm install`
4.  Configure background notifications in `app.json` (see [Native Configuration](#native-configuration-required))
5.  Run on iOS: `npx expo run:ios`

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the MIT License.