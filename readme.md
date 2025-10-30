---

# React Native PushKit

[![NPM Version](https://img.shields.io/npm/v/react-native-pushkit.svg)](https://www.npmjs.com/package/react-native-pushkit)
[![License](https://img.shields.io/npm/l/react-native-pushkit.svg)](https://github.com/etarley/react-native-pushkit/blob/main/LICENSE)

A React Native library for handling Apple's PushKit notifications for VoIP, File Provider, and other services, built with the modern Expo Modules API.

This module provides a simple and type-safe way to receive high-priority PushKit tokens and incoming payloads in your React Native or Expo application, even when the app is in the background or terminated.

## Features

-   ✅ **Modern API:** Built with the latest Expo Modules API.
-   ✅ **Multi-Type Support:** Register for `voip`, `fileProvider`, or other PushKit types.
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

```bash
npm install react-native-pushkit
```

Or if you use Yarn:

```bash
yarn add react-native-pushkit
```

## Native Configuration (Required)

After installing the package, you need to configure the native iOS project to enable PushKit capabilities.

1.  Make sure you have generated the native `ios` directory:
    ```bash
    npx expo prebuild --platform ios
    ```

2.  Open your project's `ios/{YourProjectName}.xcworkspace` file in Xcode.

3.  In Xcode, select your project from the file navigator, then select your main app **Target**.

4.  Go to the **"Signing & Capabilities"** tab.

5.  Click the **"+ Capability"** button.

6.  Add the **"Push Notifications"** capability.

7.  Click the **"+ Capability"** button again.

8.  Add the **"Background Modes"** capability.

9.  In the "Background Modes" section, check the following boxes:
    *   ✅ **Remote notifications**
    *   ✅ **Voice over IP** (Only if you are using the `voip` push type)

Your configuration should look like this:

<img width="700" alt="Xcode Capabilities for PushKit" src="https://user-images.githubusercontent.com/1319082/220864312-09c31b5c-4d3b-483d-9d7a-18f15ab81d2f.png">

> **Note:** These capabilities are required by Apple. Your app will not receive PushKit notifications without them.

## API Usage

To begin receiving PushKit notifications, you must first call the `register()` function with the push types you want to handle. This should typically be done once when your app starts.

After registering, you can add listeners to subscribe to token updates, incoming payloads, and errors.

Here is a complete example of how to use the library in a React component.

```tsx
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, Button } from 'react-native';
import {
  register,
  addTokenListener,
  addPayloadListener,
  addErrorListener,
  type TokenPayload,
  type PayloadPayload,
  type ErrorPayload,
} from 'react-native-pushkit';

export default function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [lastPayload, setLastPayload] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set up listeners for PushKit events.
    const tokenSubscription = addTokenListener((event: TokenPayload) => {
      console.log('Received PushKit Token:', event.token);
      setToken(event.token);
      setError(null); // Clear previous errors on success.
    });

    const payloadSubscription = addPayloadListener((event: PayloadPayload) => {
      console.log('Received PushKit Payload:', event.payload);
      setLastPayload(event.payload);
      // Here you would handle the incoming payload, e.g., trigger an incoming call UI.
    });

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

  const handleRegister = async () => {
    try {
      // Register for the push types you want to handle.
      // This must be called for the app to receive any PushKit notifications.
      await register(['voip']);
      setIsRegistered(true);
      console.log('Successfully registered for VoIP pushes.');
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {error && <Text style={styles.errorText}>Error: {error}</Text>}

      <View style={styles.group}>
        <Text style={styles.title}>Registration</Text>
        {!isRegistered ? (
          <Button title="Register for VoIP Pushes" onPress={handleRegister} />
        ) : (
          <Text>Registered for PushKit notifications!</Text>
        )}
      </View>
      
      <View style={styles.group}>
        <Text style={styles.title}>PushKit Token</Text>
        <Text style={styles.token} selectable>
          {token ?? 'Waiting for token...'}
        </Text>
      </View>

      <View style={styles.group}>
        <Text style={styles.title}>Last Received Payload</Text>
        <Text style={styles.payload}>
          {lastPayload ? JSON.stringify(lastPayload, null, 2) : 'No payload received yet.'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

// Add your styles here...
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  group: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  errorText: { color: 'red', marginBottom: 10, fontWeight: 'bold' },
  token: { fontFamily: 'Menlo' },
  payload: { fontFamily: 'Menlo' },
});
```

## API Reference

### Functions

#### `register(types)`

Registers the app for the specified PushKit notification types. **This function must be called** for the app to receive any PushKit notifications.

-   **`types: PushType[]`**: An array of push types you want to register for.
-   **Returns:** `Promise<void>`

Example: `await register(['voip', 'fileProvider']);`

---

#### `addTokenListener(listener)`

Adds a listener that will be called when a new PushKit token is registered.

-   **`listener: (event: TokenPayload) => void`**: The function to execute.
-   **Returns:** `EventSubscription` - An object with a `remove()` method to unsubscribe.

---

#### `addPayloadListener(listener)`

Adds a listener that will be called when a new PushKit payload is received. This works whether the app is in the foreground, background, or was just launched by the push.

-   **`listener: (event: PayloadPayload) => void`**: The function to execute.
-   **Returns:** `EventSubscription` - An object with a `remove()` method to unsubscribe.

---

#### `addInvalidateTokenListener(listener)`

Adds a listener that will be called when the PushKit token is invalidated by the system.

-   **`listener: (event: InvalidateTokenPayload) => void`**: The function to execute.
-   **Returns:** `EventSubscription` - An object with a `remove()` method to unsubscribe.

---

#### `addErrorListener(listener)`

Adds a listener that will be called if PushKit fails to register for pushes. This is useful for debugging missing entitlements or other configuration issues.

-   **`listener: (event: ErrorPayload) => void`**: The function to execute.
-   **Returns:** `EventSubscription` - An object with a `remove()` method to unsubscribe.

### Types

```ts
// The push types you can register for.
export type PushType = 'voip' | 'fileProvider';

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
  type: string;
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
4.  Run on iOS: `npx expo run:ios`

Remember to follow the [Native Configuration](#native-configuration-required) steps for the example app's Xcode project.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the MIT License.