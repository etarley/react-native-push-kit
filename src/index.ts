import { type EventSubscription, Platform, } from 'expo-modules-core';
import ReactNativePushkitModule from './ReactNativePushkitModule';
import {
  type PayloadPayload,
  type TokenPayload,
  type InvalidateTokenPayload,
  type ErrorPayload,
  type IosPushType,
} from './ReactNativePushkit.types';

// On Android, we need to register a headless task that can receive events when the app is backgrounded.
if (Platform.OS === 'android') {
  const { registerTask } = require('expo-modules-core');
  registerTask('ReactNativePushkit');
}

/**
 * Registers the app for high-priority notifications.
 * On iOS, this registers for the specified PushKit notification types.
 * On Android, this requests the FCM token.
 * This function must be called for the app to receive any notifications from this library.
 * @param types (iOS only) An array of push types to register for, e.g., ['voip'].
 */
export function register(types?: IosPushType[]): Promise<void> {
  if (Platform.OS === 'ios') {
    // The native `register` function on iOS expects an array.
    return ReactNativePushkitModule.register(types || []);
  }

  // On Android, the `register` function takes no arguments.
  if (types && types.length > 0) {
    console.warn('[react-native-pushkit] The `types` argument for `register()` is ignored on Android.');
  }
  // The module is already defined to accept a Promise here, so no need to specify args
  return (ReactNativePushkitModule.register as () => Promise<void>)();
}


/**
 * Adds a listener that will be called when a new PushKit/FCM token is registered.
 * @param listener A function that receives an event with the token.
 * @returns A subscription object that you can use to remove the listener.
 */
export function addTokenListener(listener: (event: TokenPayload) => void): EventSubscription {
  return ReactNativePushkitModule.addListener('onToken', listener);
}

/**
 * Adds a listener that will be called when a new PushKit/FCM payload is received.
 * @param listener A function that receives an event with the payload.
 * @returns A subscription object that you can use to remove the listener.
 */
export function addPayloadListener(listener: (event: PayloadPayload) => void): EventSubscription {
  return ReactNativePushkitModule.addListener('onPayload', (event: any) => {
    // The Android headless task may wrap the payload, so we unwrap it here for consistency.
    listener(event.payload ? { payload: event.payload } : event)
  });
}

/**
 * Adds a listener that will be called when the PushKit token is invalidated by the system.
 * This is a no-op on Android.
 * @param listener A function that receives an event with the type of the invalidated push.
 * @returns A subscription object that you can use to remove the listener.
 */
export function addInvalidateTokenListener(
  listener: (event: InvalidateTokenPayload) => void
): EventSubscription {
  if (Platform.OS === 'android') {
    return { remove: () => {} }; // Return a no-op subscription on Android
  }
  return ReactNativePushkitModule.addListener('onInvalidateToken', listener);
}

/**
 * Adds a listener that will be called if PushKit/FCM fails to register.
 * This is a no-op on Android as errors are handled in the `register` promise.
 * @param listener A function that receives an event with an error message.
 * @returns A subscription object that you can use to remove the listener.
 */
export function addErrorListener(listener: (event: ErrorPayload) => void): EventSubscription {
  if (Platform.OS === 'android') {
    return { remove: () => {} }; // Return a no-op subscription on Android
  }
  return ReactNativePushkitModule.addListener('onError', listener);
}

// Re-export all the types.
export * from './ReactNativePushkit.types';